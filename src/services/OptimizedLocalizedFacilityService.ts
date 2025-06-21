
import { Facility, FacilityFilters, FacilitySortOptions } from "@/types/facility";
import { Zone } from "@/types/zone";
import { PaginatedResponse, PaginationParams, RepositoryResponse } from "@/types/api";
import { LocalizedFacilityRepository } from "@/dal/repositories/LocalizedFacilityRepository";
import { LocalizedFacility } from "@/types/localization";
import { localizedMockFacilities } from "@/data/localizedMockFacilities";

// Create singleton instance with initial data
const localizedFacilityRepository = new LocalizedFacilityRepository(localizedMockFacilities);

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export class OptimizedLocalizedFacilityService {
  // Return raw localized facilities without language conversion
  static async getRawFacilities(
    pagination: PaginationParams,
    filters?: FacilityFilters,
    sort?: FacilitySortOptions
  ): Promise<RepositoryResponse<PaginatedResponse<LocalizedFacility>>> {
    try {
      await delay(300);

      const result = await localizedFacilityRepository.findAllRaw(
        pagination,
        filters,
        sort?.field,
        sort?.direction
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

  static async getRawFacilityById(id: number): Promise<RepositoryResponse<LocalizedFacility | null>> {
    try {
      await delay(200);

      const result = await localizedFacilityRepository.findByIdRaw(id.toString());
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

      const result = await localizedFacilityRepository.getZonesByFacilityId(facilityId);
      return result;
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

      const result = await localizedFacilityRepository.getZoneById(zoneId);
      return result;
    } catch (error) {
      return {
        data: null,
        error: "Failed to fetch zone"
      };
    }
  }

  static async getFacilitiesByType(type: string): Promise<RepositoryResponse<LocalizedFacility[]>> {
    try {
      await delay(250);

      const result = await localizedFacilityRepository.getRawFacilitiesByType(type);
      return result;
    } catch (error) {
      return {
        data: [],
        error: "Failed to fetch facilities by type"
      };
    }
  }

  static async getFacilitiesByArea(area: string): Promise<RepositoryResponse<LocalizedFacility[]>> {
    try {
      await delay(250);

      const result = await localizedFacilityRepository.getRawFacilitiesByArea(area);
      return result;
    } catch (error) {
      return {
        data: [],
        error: "Failed to fetch facilities by area"
      };
    }
  }
}
