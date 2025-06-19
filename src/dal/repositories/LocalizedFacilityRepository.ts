
import { BaseRepository } from "@/dal/BaseRepository";
import { Facility, FacilityFilters } from "@/types/facility";
import { Zone } from "@/types/zone";
import { PaginatedResponse, ApiResponse } from "@/types/api";
import { Language } from "@/i18n/types";
import { localizedMockFacilities } from "@/data/localizedMockFacilities";
import { mockZones } from "@/data/mockZones";
import { getLocalizedFacility } from "@/utils/localizationHelper";

export class LocalizedFacilityRepository extends BaseRepository<Facility> {
  private currentLanguage: Language = 'NO';

  setLanguage(language: Language) {
    this.currentLanguage = language;
  }

  async findAll(
    pagination: { page: number; limit: number },
    filters?: FacilityFilters,
    sortField?: string,
    sortDirection?: 'asc' | 'desc'
  ): Promise<ApiResponse<PaginatedResponse<Facility>>> {
    try {
      // Convert localized facilities to current language
      let facilities = localizedMockFacilities.map(facility => 
        getLocalizedFacility(facility, this.currentLanguage)
      );

      // Apply filters
      if (filters) {
        if (filters.search) {
          const searchLower = filters.search.toLowerCase();
          facilities = facilities.filter(facility =>
            facility.name.toLowerCase().includes(searchLower) ||
            facility.address.toLowerCase().includes(searchLower) ||
            facility.description.toLowerCase().includes(searchLower)
          );
        }

        if (filters.type && filters.type.length > 0) {
          facilities = facilities.filter(facility =>
            filters.type!.includes(facility.type)
          );
        }

        if (filters.area && filters.area.length > 0) {
          facilities = facilities.filter(facility =>
            filters.area!.includes(facility.area)
          );
        }

        if (filters.capacity) {
          if (filters.capacity.min !== undefined) {
            facilities = facilities.filter(facility => facility.capacity >= filters.capacity!.min!);
          }
          if (filters.capacity.max !== undefined) {
            facilities = facilities.filter(facility => facility.capacity <= filters.capacity!.max!);
          }
        }

        if (filters.equipment && filters.equipment.length > 0) {
          facilities = facilities.filter(facility =>
            filters.equipment!.some(eq => facility.equipment.includes(eq))
          );
        }

        if (filters.accessibility && filters.accessibility.length > 0) {
          facilities = facilities.filter(facility =>
            filters.accessibility!.every(acc => facility.accessibility.includes(acc))
          );
        }

        if (filters.suitableFor && filters.suitableFor.length > 0) {
          facilities = facilities.filter(facility =>
            filters.suitableFor!.some(sf => facility.suitableFor.includes(sf))
          );
        }

        if (filters.availability) {
          const { date, startTime, endTime } = filters.availability;
          if (date && startTime && endTime) {
            facilities = facilities.filter(facility => {
              const availableTimes = facility.availableTimes?.find(at => 
                at.date.toDateString() === date.toDateString()
              );
              return availableTimes?.slots.some(slot => 
                slot.available && slot.start >= startTime && slot.end <= endTime
              );
            });
          }
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
      const localizedFacility = localizedMockFacilities.find(f => f.id === facilityId);
      
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
      const facilities = localizedMockFacilities
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
      const facilities = localizedMockFacilities
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

  async delete(id: string): Promise<ApiResponse<void>> {
    throw new Error("Delete operation not implemented for mock data");
  }
}
