
import { Facility, FacilityFilters, FacilitySortOptions } from "@/types/facility";
import { PaginatedResponse, PaginationParams, ApiResponse } from "@/types/api";
import { mockFacilities } from "@/data/mockFacilities";

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export class FacilityService {
  private static facilities: Facility[] = mockFacilities;

  static async getFacilities(
    pagination: PaginationParams,
    filters?: FacilityFilters,
    sort?: FacilitySortOptions
  ): Promise<ApiResponse<PaginatedResponse<Facility>>> {
    try {
      await delay(300); // Simulate network delay

      let filteredFacilities = [...this.facilities];

      // Apply filters
      if (filters) {
        filteredFacilities = this.applyFilters(filteredFacilities, filters);
      }

      // Apply sorting
      if (sort) {
        filteredFacilities = this.applySorting(filteredFacilities, sort);
      }

      // Apply pagination
      const startIndex = (pagination.page - 1) * pagination.limit;
      const endIndex = startIndex + pagination.limit;
      const paginatedData = filteredFacilities.slice(startIndex, endIndex);

      const totalPages = Math.ceil(filteredFacilities.length / pagination.limit);

      return {
        success: true,
        data: {
          data: paginatedData,
          pagination: {
            page: pagination.page,
            limit: pagination.limit,
            total: filteredFacilities.length,
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

  static async getFacilityById(id: number): Promise<ApiResponse<Facility>> {
    try {
      await delay(200);

      const facility = this.facilities.find(f => f.id === id);
      
      if (!facility) {
        return {
          success: false,
          error: {
            message: "Facility not found",
            code: "NOT_FOUND",
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

  private static applyFilters(facilities: Facility[], filters: FacilityFilters): Facility[] {
    return facilities.filter(facility => {
      // Search term filter
      if (filters.searchTerm && filters.searchTerm.trim() !== "") {
        const searchLower = filters.searchTerm.toLowerCase();
        const matchesSearch = 
          facility.name.toLowerCase().includes(searchLower) ||
          facility.description.toLowerCase().includes(searchLower) ||
          facility.type.toLowerCase().includes(searchLower) ||
          facility.area.toLowerCase().includes(searchLower) ||
          facility.suitableFor.some(activity => 
            activity.toLowerCase().includes(searchLower)
          );
        
        if (!matchesSearch) return false;
      }

      // Facility type filter
      if (filters.facilityType && filters.facilityType !== "all") {
        const typeMatch = facility.type.toLowerCase().includes(
          filters.facilityType.toLowerCase().replace("-", " ")
        );
        if (!typeMatch) return false;
      }

      // Location filter
      if (filters.location && filters.location !== "all") {
        const locationMatch = facility.address.toLowerCase().includes(
          filters.location.toLowerCase().replace("-", " ")
        );
        if (!locationMatch) return false;
      }

      // Accessibility filter
      if (filters.accessibility && filters.accessibility !== "all") {
        const accessibilityMatch = facility.accessibility.includes(filters.accessibility);
        if (!accessibilityMatch) return false;
      }

      // Capacity filter
      if (filters.capacity && Array.isArray(filters.capacity) && filters.capacity[0] > 0) {
        const [minCapacity, maxCapacity] = filters.capacity;
        if (facility.capacity < minCapacity || facility.capacity > maxCapacity) {
          return false;
        }
      }

      return true;
    });
  }

  private static applySorting(facilities: Facility[], sort: FacilitySortOptions): Facility[] {
    return [...facilities].sort((a, b) => {
      let aValue: any = a[sort.field];
      let bValue: any = b[sort.field];

      // Handle undefined values
      if (aValue === undefined) aValue = sort.field === 'rating' ? 0 : '';
      if (bValue === undefined) bValue = sort.field === 'rating' ? 0 : '';

      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (sort.direction === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });
  }
}
