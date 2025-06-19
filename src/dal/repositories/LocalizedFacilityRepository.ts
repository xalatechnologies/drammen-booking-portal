import { BaseRepository } from "@/dal/BaseRepository";
import { Facility, FacilityFilters } from "@/types/facility";
import { Zone } from "@/types/zone";
import { PaginatedResponse, ApiResponse } from "@/types/api";
import { Language } from "@/i18n/types";
import { LocalizedFacility } from "@/types/localization";
import { mockZones } from "@/data/mockZones";
import { getLocalizedFacility } from "@/utils/localizationHelper";

export class LocalizedFacilityRepository extends BaseRepository<Facility> {
  private currentLanguage: Language = 'NO';
  private localizedFacilities: LocalizedFacility[];

  constructor(initialData: LocalizedFacility[]) {
    // Convert initial localized data to regular facilities for the base repository
    const convertedFacilities = initialData.map(facility => 
      getLocalizedFacility(facility, 'NO')
    );
    super(convertedFacilities);
    this.localizedFacilities = initialData;
  }

  setLanguage(language: Language) {
    this.currentLanguage = language;
  }

  // Implement required abstract methods
  protected getId(item: Facility): string {
    return item.id.toString();
  }

  protected applyFilters(items: Facility[], filters: any): Facility[] {
    return items; // Filtering is handled in findAll method
  }

  protected createEntity(data: Partial<Facility>): Facility {
    throw new Error("Create operation not implemented for mock data");
  }

  protected updateEntity(existing: Facility, updates: Partial<Facility>): Facility {
    return { ...existing, ...updates };
  }

  async findAll(
    pagination: { page: number; limit: number },
    filters?: FacilityFilters,
    sortField?: string,
    sortDirection?: 'asc' | 'desc'
  ): Promise<ApiResponse<PaginatedResponse<Facility>>> {
    try {
      // Convert localized facilities to current language
      let facilities = this.localizedFacilities.map(facility => 
        getLocalizedFacility(facility, this.currentLanguage)
      );

      // Apply filters
      if (filters) {
        if (filters.searchTerm) {
          const searchLower = filters.searchTerm.toLowerCase();
          facilities = facilities.filter(facility =>
            facility.name.toLowerCase().includes(searchLower) ||
            facility.address.toLowerCase().includes(searchLower) ||
            facility.description.toLowerCase().includes(searchLower)
          );
        }

        if (filters.facilityType) {
          facilities = facilities.filter(facility =>
            facility.type === filters.facilityType
          );
        }

        if (filters.location) {
          facilities = facilities.filter(facility =>
            facility.area === filters.location
          );
        }

        if (filters.capacity && Array.isArray(filters.capacity) && filters.capacity.length === 2) {
          const [min, max] = filters.capacity;
          facilities = facilities.filter(facility => 
            facility.capacity >= min && facility.capacity <= max
          );
        }

        if (filters.amenities && filters.amenities.length > 0) {
          facilities = facilities.filter(facility =>
            filters.amenities!.some(amenity => 
              facility.equipment?.includes(amenity) || facility.amenities?.includes(amenity)
            )
          );
        }

        if (filters.accessibility) {
          facilities = facilities.filter(facility =>
            facility.accessibility.includes(filters.accessibility!)
          );
        }
      }

      // Apply sorting
      if (sortField && sortDirection) {
        facilities.sort((a, b) => {
          let aValue: any, bValue: any;
          
          switch (sortField) {
            case 'name':
              aValue = a.name;
              bValue = b.name;
              break;
            case 'capacity':
              aValue = a.capacity;
              bValue = b.capacity;
              break;
            case 'area':
              aValue = a.area;
              bValue = b.area;
              break;
            case 'type':
              aValue = a.type;
              bValue = b.type;
              break;
            default:
              return 0;
          }

          if (typeof aValue === 'string' && typeof bValue === 'string') {
            aValue = aValue.toLowerCase();
            bValue = bValue.toLowerCase();
          }

          if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
          if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
          return 0;
        });
      }

      // Apply pagination
      const total = facilities.length;
      const totalPages = Math.ceil(total / pagination.limit);
      const start = (pagination.page - 1) * pagination.limit;
      const paginatedFacilities = facilities.slice(start, start + pagination.limit);

      return {
        success: true,
        data: {
          data: paginatedFacilities,
          pagination: {
            page: pagination.page,
            limit: pagination.limit,
            total,
            totalPages,
            hasNext: pagination.page < totalPages,
            hasPrev: pagination.page > 1,
          },
        },
      };
    } catch (error) {
      return {
        success: false,
        error: {
          message: "Failed to fetch facilities",
          details: error,
        },
      };
    }
  }

  async findById(id: string): Promise<ApiResponse<Facility>> {
    try {
      const facilityId = parseInt(id, 10);
      const localizedFacility = this.localizedFacilities.find(f => f.id === facilityId);
      
      if (!localizedFacility) {
        return {
          success: false,
          error: {
            message: `Facility with id ${id} not found`,
            code: 'NOT_FOUND',
          },
        };
      }

      const facility = getLocalizedFacility(localizedFacility, this.currentLanguage);

      return {
        success: true,
        data: facility,
      };
    } catch (error) {
      return {
        success: false,
        error: {
          message: "Failed to fetch facility",
          details: error,
        },
      };
    }
  }

  async getZonesByFacilityId(facilityId: string): Promise<ApiResponse<Zone[]>> {
    try {
      const zones = mockZones.filter(zone => zone.facilityId === facilityId);
      return {
        success: true,
        data: zones,
      };
    } catch (error) {
      return {
        success: false,
        error: {
          message: "Failed to fetch zones",
          details: error,
        },
      };
    }
  }

  async getZoneById(zoneId: string): Promise<ApiResponse<Zone>> {
    try {
      const zone = mockZones.find(z => z.id === zoneId);
      
      if (!zone) {
        return {
          success: false,
          error: {
            message: `Zone with id ${zoneId} not found`,
            code: 'NOT_FOUND',
          },
        };
      }

      return {
        success: true,
        data: zone,
      };
    } catch (error) {
      return {
        success: false,
        error: {
          message: "Failed to fetch zone",
          details: error,
        },
      };
    }
  }

  async getFacilitiesByType(type: string): Promise<ApiResponse<Facility[]>> {
    try {
      const facilities = this.localizedFacilities
        .filter(f => f.type === type)
        .map(facility => getLocalizedFacility(facility, this.currentLanguage));

      return {
        success: true,
        data: facilities,
      };
    } catch (error) {
      return {
        success: false,
        error: {
          message: "Failed to fetch facilities by type",
          details: error,
        },
      };
    }
  }

  async getFacilitiesByArea(area: string): Promise<ApiResponse<Facility[]>> {
    try {
      const facilities = this.localizedFacilities
        .filter(f => f.area === area)
        .map(facility => getLocalizedFacility(facility, this.currentLanguage));

      return {
        success: true,
        data: facilities,
      };
    } catch (error) {
      return {
        success: false,
        error: {
          message: "Failed to fetch facilities by area",
          details: error,
        },
      };
    }
  }

  async create(item: Partial<Facility>): Promise<ApiResponse<Facility>> {
    throw new Error("Create operation not implemented for mock data");
  }

  async update(id: string, item: Partial<Facility>): Promise<ApiResponse<Facility>> {
    throw new Error("Update operation not implemented for mock data");
  }

  async delete(id: string): Promise<ApiResponse<boolean>> {
    throw new Error("Delete operation not implemented for mock data");
  }

  // New raw methods for optimized architecture
  async findAllRaw(
    pagination: { page: number; limit: number },
    filters?: FacilityFilters,
    sortField?: string,
    sortDirection?: 'asc' | 'desc'
  ): Promise<ApiResponse<PaginatedResponse<LocalizedFacility>>> {
    try {
      let facilities = [...this.localizedFacilities];

      // Apply filters (language-agnostic filtering)
      if (filters) {
        if (filters.searchTerm) {
          const searchLower = filters.searchTerm.toLowerCase();
          facilities = facilities.filter(facility =>
            Object.values(facility.name).some(name => name.toLowerCase().includes(searchLower)) ||
            Object.values(facility.address).some(addr => addr?.toLowerCase?.includes?.(searchLower)) ||
            Object.values(facility.description).some(desc => desc.toLowerCase().includes(searchLower))
          );
        }

        if (filters.facilityType) {
          facilities = facilities.filter(facility =>
            facility.type === filters.facilityType
          );
        }

        if (filters.location) {
          facilities = facilities.filter(facility =>
            facility.area === filters.location
          );
        }

        if (filters.capacity && Array.isArray(filters.capacity) && filters.capacity.length === 2) {
          const [min, max] = filters.capacity;
          facilities = facilities.filter(facility => 
            facility.capacity >= min && facility.capacity <= max
          );
        }

        if (filters.amenities && filters.amenities.length > 0) {
          facilities = facilities.filter(facility =>
            filters.amenities!.some(amenity => 
              Object.values(facility.equipment).some(equipList => 
                Array.isArray(equipList) && equipList.includes(amenity)
              ) ||
              (facility.amenities && Object.values(facility.amenities).some(amenityList => 
                Array.isArray(amenityList) && amenityList.includes(amenity)
              ))
            )
          );
        }

        if (filters.accessibility) {
          facilities = facilities.filter(facility =>
            facility.accessibility.includes(filters.accessibility!)
          );
        }
      }

      // Apply sorting
      if (sortField && sortDirection) {
        facilities.sort((a, b) => {
          let aValue: any, bValue: any;
          
          switch (sortField) {
            case 'name':
              // Sort by first available language name
              aValue = Object.values(a.name)[0];
              bValue = Object.values(b.name)[0];
              break;
            case 'capacity':
              aValue = a.capacity;
              bValue = b.capacity;
              break;
            case 'area':
              aValue = a.area;
              bValue = b.area;
              break;
            case 'type':
              aValue = a.type;
              bValue = b.type;
              break;
            default:
              return 0;
          }

          if (typeof aValue === 'string' && typeof bValue === 'string') {
            aValue = aValue.toLowerCase();
            bValue = bValue.toLowerCase();
          }

          if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
          if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
          return 0;
        });
      }

      // Apply pagination
      const total = facilities.length;
      const totalPages = Math.ceil(total / pagination.limit);
      const start = (pagination.page - 1) * pagination.limit;
      const paginatedFacilities = facilities.slice(start, start + pagination.limit);

      return {
        success: true,
        data: {
          data: paginatedFacilities,
          pagination: {
            page: pagination.page,
            limit: pagination.limit,
            total,
            totalPages,
            hasNext: pagination.page < totalPages,
            hasPrev: pagination.page > 1,
          },
        },
      };
    } catch (error) {
      return {
        success: false,
        error: {
          message: "Failed to fetch facilities",
          details: error,
        },
      };
    }
  }

  async findByIdRaw(id: string): Promise<ApiResponse<LocalizedFacility>> {
    try {
      const facilityId = parseInt(id, 10);
      const facility = this.localizedFacilities.find(f => f.id === facilityId);
      
      if (!facility) {
        return {
          success: false,
          error: {
            message: `Facility with id ${id} not found`,
            code: 'NOT_FOUND',
          },
        };
      }

      return {
        success: true,
        data: facility,
      };
    } catch (error) {
      return {
        success: false,
        error: {
          message: "Failed to fetch facility",
          details: error,
        },
      };
    }
  }

  async getRawFacilitiesByType(type: string): Promise<ApiResponse<LocalizedFacility[]>> {
    try {
      const facilities = this.localizedFacilities.filter(f => f.type === type);
      return {
        success: true,
        data: facilities,
      };
    } catch (error) {
      return {
        success: false,
        error: {
          message: "Failed to fetch facilities by type",
          details: error,
        },
      };
    }
  }

  async getRawFacilitiesByArea(area: string): Promise<ApiResponse<LocalizedFacility[]>> {
    try {
      const facilities = this.localizedFacilities.filter(f => f.area === area);
      return {
        success: true,
        data: facilities,
      };
    } catch (error) {
      return {
        success: false,
        error: {
          message: "Failed to fetch facilities by area",
          details: error,
        },
      };
    }
  }

  async create(item: Partial<LocalizedFacility>): Promise<ApiResponse<LocalizedFacility>> {
    throw new Error("Create operation not implemented for mock data");
  }

  async update(id: string, item: Partial<LocalizedFacility>): Promise<ApiResponse<LocalizedFacility>> {
    throw new Error("Update operation not implemented for mock data");
  }

  async delete(id: string): Promise<ApiResponse<boolean>> {
    throw new Error("Delete operation not implemented for mock data");
  }
}
