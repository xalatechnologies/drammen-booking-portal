
import { BaseRepository } from "@/dal/BaseRepository";
import { Facility, FacilityFilters } from "@/types/facility";
import { Zone } from "@/types/zone";
import { PaginatedResponse, RepositoryResponse } from "@/types/api";
import { LocalizedFacility } from "@/types/localization";

export class OptimizedLocalizedFacilityRepository extends BaseRepository<LocalizedFacility> {
  private localizedFacilities: LocalizedFacility[];

  constructor(initialData: LocalizedFacility[]) {
    super();
    this.localizedFacilities = initialData;
  }

  // Implement required abstract methods
  protected getId(item: LocalizedFacility): string {
    return item.id.toString();
  }

  protected applyFilters(items: LocalizedFacility[], filters: any): LocalizedFacility[] {
    return items; // Filtering is handled in findAllRaw method
  }

  protected createEntity(data: Partial<LocalizedFacility>): LocalizedFacility {
    throw new Error("Create operation not implemented for mock data");
  }

  protected updateEntity(existing: LocalizedFacility, updates: Partial<LocalizedFacility>): LocalizedFacility {
    return { ...existing, ...updates };
  }

  async findAllRaw(
    pagination: { page: number; limit: number },
    filters?: FacilityFilters,
    sortField?: string,
    sortDirection?: 'asc' | 'desc'
  ): Promise<RepositoryResponse<PaginatedResponse<LocalizedFacility>>> {
    try {
      let facilities = [...this.localizedFacilities];

      // Apply filters (language-agnostic filtering)
      if (filters) {
        if (filters.searchTerm) {
          const searchLower = filters.searchTerm.toLowerCase();
          facilities = facilities.filter(facility =>
            Object.values(facility.name).some(name => name.toLowerCase().includes(searchLower)) ||
            Object.values(facility.address).some(addr => typeof addr === 'string' && addr.toLowerCase().includes(searchLower)) ||
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
        data: {
          data: [],
          pagination: {
            page: pagination.page,
            limit: pagination.limit,
            total: 0,
            totalPages: 0,
            hasNext: false,
            hasPrev: false,
          },
        },
        error: "Failed to fetch facilities"
      };
    }
  }

  async findByIdRaw(id: string): Promise<RepositoryResponse<LocalizedFacility | null>> {
    try {
      const facilityId = parseInt(id, 10);
      const facility = this.localizedFacilities.find(f => f.id === facilityId);
      
      if (!facility) {
        return {
          data: null,
          error: "Facility not found"
        };
      }

      return {
        data: facility,
      };
    } catch (error) {
      return {
        data: null,
        error: "Failed to fetch facility"
      };
    }
  }

  async getRawFacilitiesByType(type: string): Promise<RepositoryResponse<LocalizedFacility[]>> {
    try {
      const facilities = this.localizedFacilities.filter(f => f.type === type);
      return {
        data: facilities,
      };
    } catch (error) {
      return {
        data: [],
        error: "Failed to fetch facilities by type"
      };
    }
  }

  async getRawFacilitiesByArea(area: string): Promise<RepositoryResponse<LocalizedFacility[]>> {
    try {
      const facilities = this.localizedFacilities.filter(f => f.area === area);
      return {
        data: facilities,
      };
    } catch (error) {
      return {
        data: [],
        error: "Failed to fetch facilities by area"
      };
    }
  }

  async getZonesByFacilityId(facilityId: string): Promise<RepositoryResponse<Zone[]>> {
    try {
      // For now return empty zones - this should connect to actual zone repository
      return {
        data: [],
      };
    } catch (error) {
      return {
        data: [],
        error: "Failed to fetch zones"
      };
    }
  }

  async getZoneById(zoneId: string): Promise<RepositoryResponse<Zone | null>> {
    try {
      // For now return null - this should connect to actual zone repository
      return {
        data: null,
        error: "Zone not found"
      };
    } catch (error) {
      return {
        data: null,
        error: "Failed to fetch zone"
      };
    }
  }

  async create(item: Partial<LocalizedFacility>): Promise<RepositoryResponse<LocalizedFacility>> {
    return {
      data: item as LocalizedFacility,
      error: "Create operation not implemented for mock data"
    };
  }

  async update(id: string, item: Partial<LocalizedFacility>): Promise<RepositoryResponse<LocalizedFacility>> {
    return {
      data: item as LocalizedFacility,
      error: "Update operation not implemented for mock data"
    };
  }

  async delete(id: string): Promise<RepositoryResponse<boolean>> {
    return {
      data: false,
      error: "Delete operation not implemented for mock data"
    };
  }
}
