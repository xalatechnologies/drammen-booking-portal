
import { SupabaseRepository } from '../SupabaseRepository';
import { Facility, FacilityFilters } from '@/types/facility';
import { SupabaseFacilityService } from '@/services/SupabaseFacilityService';
import { PaginationParams, ApiResponse, PaginatedResponse } from '@/types/api';

export class SupabaseFacilityRepository extends SupabaseRepository<Facility> {
  protected tableName = 'facilities';

  constructor() {
    super();
  }

  // Override base methods to use Supabase edge functions
  async getAll(pagination?: PaginationParams, filters?: FacilityFilters): Promise<ApiResponse<PaginatedResponse<Facility>>> {
    return SupabaseFacilityService.getFacilities(pagination, filters);
  }

  async getById(id: string): Promise<ApiResponse<Facility>> {
    return SupabaseFacilityService.getFacilityById(parseInt(id));
  }

  async createAsync(facilityData: Partial<Facility>): Promise<ApiResponse<Facility>> {
    return SupabaseFacilityService.createFacility(facilityData);
  }

  async updateAsync(id: string, facilityData: Partial<Facility>): Promise<ApiResponse<Facility>> {
    return SupabaseFacilityService.updateFacility(parseInt(id), facilityData);
  }

  async deleteAsync(id: string): Promise<ApiResponse<Facility>> {
    return SupabaseFacilityService.deleteFacility(parseInt(id));
  }

  async getFacilitiesByType(type: string): Promise<ApiResponse<Facility[]>> {
    const result = await SupabaseFacilityService.getFacilities(undefined, { facilityType: type });
    if (result.success && result.data) {
      return {
        success: true,
        data: result.data.data
      };
    }
    return {
      success: false,
      error: result.error || { message: 'Failed to fetch facilities by type' }
    };
  }

  async getFacilitiesByArea(area: string): Promise<ApiResponse<Facility[]>> {
    const result = await SupabaseFacilityService.getFacilities(undefined, { location: area });
    if (result.success && result.data) {
      return {
        success: true,
        data: result.data.data
      };
    }
    return {
      success: false,
      error: result.error || { message: 'Failed to fetch facilities by area' }
    };
  }

  async getFacilityZones(id: string): Promise<ApiResponse<any[]>> {
    return SupabaseFacilityService.getFacilityZones(parseInt(id));
  }
}

// Export singleton instance
export const supabaseFacilityRepository = new SupabaseFacilityRepository();
