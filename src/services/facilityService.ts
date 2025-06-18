
import { Facility, FacilityFilters, FacilitySortOptions } from "@/types/facility";
import { Zone } from "@/types/zone";
import { PaginatedResponse, PaginationParams, ApiResponse } from "@/types/api";
import { facilityRepository } from "@/dal/FacilityRepository";

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export class FacilityService {
  static async getFacilities(
    pagination: PaginationParams,
    filters?: FacilityFilters,
    sort?: FacilitySortOptions
  ): Promise<ApiResponse<PaginatedResponse<Facility>>> {
    try {
      await delay(300); // Simulate network delay

      // Use repository for filtering and pagination
      const result = await facilityRepository.findAll(
        pagination,
        filters,
        sort?.field,
        sort?.direction
      );

      return result;
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

      const result = await facilityRepository.findById(id.toString());
      return result;
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

  static async getZonesByFacilityId(facilityId: string): Promise<ApiResponse<Zone[]>> {
    try {
      await delay(150);

      const result = await facilityRepository.getZonesByFacilityId(facilityId);
      return result;
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

  static async getZoneById(zoneId: string): Promise<ApiResponse<Zone>> {
    try {
      await delay(150);

      const result = await facilityRepository.getZoneById(zoneId);
      return result;
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

  static async getFacilitiesByType(type: string): Promise<ApiResponse<Facility[]>> {
    try {
      await delay(250);

      const result = await facilityRepository.getFacilitiesByType(type);
      return result;
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

  static async getFacilitiesByArea(area: string): Promise<ApiResponse<Facility[]>> {
    try {
      await delay(250);

      const result = await facilityRepository.getFacilitiesByArea(area);
      return result;
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
}
