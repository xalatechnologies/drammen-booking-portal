
import { Facility, FacilityFilters, FacilitySortOptions } from "@/types/facility";
import { Zone } from "@/types/zone";
import { PaginatedResponse, PaginationParams, RepositoryResponse } from "@/types/api";
import { LocalizedFacilityRepository } from "@/dal/repositories/LocalizedFacilityRepository";

// Create singleton instance
const localizedFacilityRepository = new LocalizedFacilityRepository();

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export class OptimizedLocalizedFacilityService {
  // Return raw localized facilities without language conversion
  static async getRawFacilities(
    pagination: PaginationParams,
    filters?: FacilityFilters,
    sort?: FacilitySortOptions
  ): Promise<RepositoryResponse<PaginatedResponse<Facility>>> {
    try {
      await delay(300);

      const result = await localizedFacilityRepository.findAllWithPagination(
        pagination,
        filters?.searchTerm,
        filters
      );

      return result;
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
            hasPrev: false
          }
        },
        error: "Failed to fetch facilities"
      };
    }
  }

  static async getRawFacilityById(id: number): Promise<RepositoryResponse<Facility | null>> {
    try {
      await delay(200);

      const result = await localizedFacilityRepository.findById(id.toString());
      return result;
    } catch (error) {
      return {
        data: null,
        error: "Failed to fetch facility"
      };
    }
  }

  static async getZonesByFacilityId(facilityId: string): Promise<RepositoryResponse<Zone[]>> {
    try {
      await delay(150);

      return {
        data: [],
        error: "OptimizedLocalizedFacilityService methods not implemented - use hooks instead"
      };
    } catch (error) {
      return {
        data: [],
        error: "Failed to fetch zones"
      };
    }
  }

  static async getZoneById(zoneId: string): Promise<RepositoryResponse<Zone | null>> {
    try {
      await delay(150);

      return {
        data: null,
        error: "OptimizedLocalizedFacilityService methods not implemented - use hooks instead"
      };
    } catch (error) {
      return {
        data: null,
        error: "Failed to fetch zone"
      };
    }
  }

  static async getFacilitiesByType(type: string): Promise<RepositoryResponse<Facility[]>> {
    try {
      await delay(250);

      const result = await localizedFacilityRepository.getFacilitiesByType(type);
      return result;
    } catch (error) {
      return {
        data: [],
        error: "Failed to fetch facilities by type"
      };
    }
  }

  static async getFacilitiesByArea(area: string): Promise<RepositoryResponse<Facility[]>> {
    try {
      await delay(250);

      const result = await localizedFacilityRepository.getFacilitiesByArea(area);
      return result;
    } catch (error) {
      return {
        data: [],
        error: "Failed to fetch facilities by area"
      };
    }
  }
}
