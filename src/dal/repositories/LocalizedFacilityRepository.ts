
import { LocalizedFacility } from '@/types/localization';
import { Zone } from '@/types/zone';
import { FacilityFilters } from '@/types/facility';
import { PaginationParams, PaginatedResponse, RepositoryResponse } from '@/types/api';

export class LocalizedFacilityRepository {
  private facilities: LocalizedFacility[];

  constructor(facilities: LocalizedFacility[]) {
    this.facilities = facilities;
  }

  async findAllRaw(
    pagination: PaginationParams,
    filters?: FacilityFilters,
    sortField?: string,
    sortDirection: 'asc' | 'desc' = 'asc'
  ): Promise<RepositoryResponse<PaginatedResponse<LocalizedFacility>>> {
    try {
      let filteredFacilities = [...this.facilities];

      // Apply filters
      if (filters?.facilityType && filters.facilityType !== 'all') {
        filteredFacilities = filteredFacilities.filter(f => f.type === filters.facilityType);
      }

      if (filters?.location && filters.location !== 'all') {
        filteredFacilities = filteredFacilities.filter(f => f.area === filters.location);
      }

      if (filters?.searchTerm) {
        const searchTerm = filters.searchTerm.toLowerCase();
        filteredFacilities = filteredFacilities.filter(f => 
          f.name.NO.toLowerCase().includes(searchTerm) ||
          f.name.EN.toLowerCase().includes(searchTerm) ||
          f.description.NO.toLowerCase().includes(searchTerm) ||
          f.description.EN.toLowerCase().includes(searchTerm)
        );
      }

      // Apply sorting
      if (sortField) {
        filteredFacilities.sort((a, b) => {
          let aValue: any;
          let bValue: any;

          switch (sortField) {
            case 'name':
              aValue = a.name.NO;
              bValue = b.name.NO;
              break;
            case 'capacity':
              aValue = a.capacity;
              bValue = b.capacity;
              break;
            case 'price_per_hour':
              aValue = a.pricePerHour || a.price_per_hour;
              bValue = b.pricePerHour || b.price_per_hour;
              break;
            default:
              return 0;
          }

          if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
          if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
          return 0;
        });
      }

      // Apply pagination
      const total = filteredFacilities.length;
      const totalPages = Math.ceil(total / pagination.limit);
      const startIndex = (pagination.page - 1) * pagination.limit;
      const endIndex = startIndex + pagination.limit;
      const paginatedData = filteredFacilities.slice(startIndex, endIndex);

      const result: PaginatedResponse<LocalizedFacility> = {
        data: paginatedData,
        pagination: {
          page: pagination.page,
          limit: pagination.limit,
          total,
          totalPages,
          hasNext: pagination.page < totalPages,
          hasPrev: pagination.page > 1
        }
      };

      return {
        data: result
      };
    } catch (error: any) {
      return {
        data: {
          data: [],
          pagination: {
            page: pagination.page,
            limit: pagination.limit,
            total: 0,
            totalPages: 0,
            hasNext: false,
            hasPrev: false
          }
        },
        error: error.message
      };
    }
  }

  async findByIdRaw(id: string): Promise<RepositoryResponse<LocalizedFacility | null>> {
    try {
      const facility = this.facilities.find(f => f.id.toString() === id);
      return {
        data: facility || null
      };
    } catch (error: any) {
      return {
        data: null,
        error: error.message
      };
    }
  }

  async getZonesByFacilityId(facilityId: string): Promise<RepositoryResponse<Zone[]>> {
    try {
      const facility = this.facilities.find(f => f.id.toString() === facilityId);
      return {
        data: facility?.zones || []
      };
    } catch (error: any) {
      return {
        data: [],
        error: error.message
      };
    }
  }

  async getZoneById(zoneId: string): Promise<RepositoryResponse<Zone | null>> {
    try {
      for (const facility of this.facilities) {
        const zone = facility.zones?.find(z => z.id === zoneId);
        if (zone) {
          return {
            data: zone
          };
        }
      }
      return {
        data: null
      };
    } catch (error: any) {
      return {
        data: null,
        error: error.message
      };
    }
  }

  async getRawFacilitiesByType(type: string): Promise<RepositoryResponse<LocalizedFacility[]>> {
    try {
      const facilities = this.facilities.filter(f => f.type === type);
      return {
        data: facilities
      };
    } catch (error: any) {
      return {
        data: [],
        error: error.message
      };
    }
  }

  async getRawFacilitiesByArea(area: string): Promise<RepositoryResponse<LocalizedFacility[]>> {
    try {
      const facilities = this.facilities.filter(f => f.area === area);
      return {
        data: facilities
      };
    } catch (error: any) {
      return {
        data: [],
        error: error.message
      };
    }
  }
}
