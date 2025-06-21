
import { OptimizedLocalizedFacilityRepository } from '@/dal/repositories/OptimizedLocalizedFacilityRepository';
import { LocalizedFacility } from '@/types/localization';
import { localizedMockFacilities } from '@/data/localizedMockFacilities';
import { FacilityFilters, FacilitySortOptions } from '@/types/facility';
import { PaginationParams, ApiResponse, PaginatedResponse } from '@/types/api';

// Create repository instance with mock data
const repository = new OptimizedLocalizedFacilityRepository();

export class LocalizedFacilityService {
  static async getFacilities(
    pagination: PaginationParams,
    filters?: FacilityFilters,
    sort?: FacilitySortOptions
  ): Promise<ApiResponse<PaginatedResponse<LocalizedFacility>>> {
    try {
      // Get current language facilities - default to Norwegian
      const currentFacilities = localizedMockFacilities['NO'] || [];
      
      // Apply filters
      let facilities = [...currentFacilities];
      
      if (filters) {
        if (filters.facilityType) {
          facilities = facilities.filter(f => f.type === filters.facilityType);
        }
        
        if (filters.searchTerm) {
          const searchLower = filters.searchTerm.toLowerCase();
          facilities = facilities.filter(f =>
            Object.values(f.name).some(name => name.toLowerCase().includes(searchLower)) ||
            Object.values(f.description).some(desc => desc.toLowerCase().includes(searchLower))
          );
        }
      }

      // Apply sorting
      if (sort) {
        facilities.sort((a, b) => {
          let aValue: any, bValue: any;
          
          switch (sort.field) {
            case 'name':
              aValue = Object.values(a.name)[0];
              bValue = Object.values(b.name)[0];
              break;
            case 'capacity':
              aValue = a.capacity;
              bValue = b.capacity;
              break;
            case 'price_per_hour':
              aValue = a.price_per_hour;
              bValue = b.price_per_hour;
              break;
            default:
              return 0;
          }

          if (typeof aValue === 'string' && typeof bValue === 'string') {
            aValue = aValue.toLowerCase();
            bValue = bValue.toLowerCase();
          }

          if (aValue < bValue) return sort.direction === 'asc' ? -1 : 1;
          if (aValue > bValue) return sort.direction === 'asc' ? 1 : -1;
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
        error: { message: "Failed to fetch facilities" }
      };
    }
  }

  static async getFacilityById(id: string): Promise<ApiResponse<LocalizedFacility | null>> {
    try {
      const facilityId = parseInt(id, 10);
      const currentFacilities = localizedMockFacilities['NO'] || [];
      const facility = currentFacilities.find(f => f.id === facilityId);
      
      return {
        success: true,
        data: facility || null
      };
    } catch (error) {
      return {
        success: false,
        error: { message: "Failed to fetch facility" }
      };
    }
  }
}
