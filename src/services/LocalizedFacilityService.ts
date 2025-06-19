
import { Facility, FacilityFilters, FacilitySortOptions } from "@/types/facility";
import { Zone } from "@/types/zone";
import { PaginatedResponse, PaginationParams, ApiResponse } from "@/types/api";
import { LocalizedFacilityRepository } from "@/dal/repositories/LocalizedFacilityRepository";
import { LocalizedFacility } from "@/types/localization";
import { Language } from "@/i18n/types";
import { localizedMockFacilities } from "@/data/localizedMockFacilities";

// Create singleton instance with initial data
const localizedFacilityRepository = new LocalizedFacilityRepository(localizedMockFacilities);

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export class LocalizedFacilityService {
  static setLanguage(language: Language) {
    localizedFacilityRepository.setLanguage(language);
  }

  static async getFacilities(
    pagination: PaginationParams,
    filters?: FacilityFilters,
    sort?: FacilitySortOptions
  ): Promise<ApiResponse<PaginatedResponse<Facility>>> {
    try {
      await delay(300); // Simulate network delay

      const result = await localizedFacilityRepository.findAll(
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

  // New method for raw facilities
  static async getRawFacilities(
    pagination: PaginationParams,
    filters?: FacilityFilters,
    sort?: FacilitySortOptions
  ): Promise<ApiResponse<PaginatedResponse<LocalizedFacility>>> {
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

      const result = await localizedFacilityRepository.findById(id.toString());
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

      const result = await localizedFacilityRepository.getZonesByFacilityId(facilityId);
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

      const result = await localizedFacilityRepository.getZoneById(zoneId);
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

      const result = await localizedFacilityRepository.getFacilitiesByType(type);
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

      const result = await localizedFacilityRepository.getFacilitiesByArea(area);
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
