
import { ApiResponse } from '@/types/api';
import { openingHoursEdgeFunctionRepository } from '@/dal/repositories/OpeningHoursEdgeFunctionRepository';

export interface OpeningHour {
  id?: string;
  facility_id: number;
  day_of_week: number;
  open_time: string;
  close_time: string;
  is_open: boolean;
  valid_from?: string;
  valid_to?: string;
}

/**
 * Service for managing facility opening hours
 * Uses OpeningHoursEdgeFunctionRepository for data access
 */
class OpeningHoursServiceClass {
  /**
   * Get opening hours for a specific facility
   * @param facilityId Facility ID
   * @returns ApiResponse with array of opening hours
   */
  async getOpeningHours(facilityId: number): Promise<ApiResponse<OpeningHour[]>> {
    console.log('OpeningHoursService.getOpeningHours - Called with facility ID:', facilityId);
    
    const response = await openingHoursEdgeFunctionRepository.getOpeningHoursByFacilityId(facilityId);
    
    if (response.error) {
      return {
        success: false,
        error: { message: response.error }
      };
    }
    
    console.log('OpeningHoursService.getOpeningHours - Success:', response.data?.length || 0);
    return {
      success: true,
      data: response.data || []
    };
  }

  /**
   * Save opening hours for a facility
   * @param facilityId Facility ID
   * @param hours Opening hours data
   * @returns ApiResponse with saved opening hours
   */
  async saveOpeningHours(facilityId: number, hours: OpeningHour[]): Promise<ApiResponse<OpeningHour[]>> {
    console.log('OpeningHoursService.saveOpeningHours - Called with facility ID and hours:', facilityId, hours);
    
    const response = await openingHoursEdgeFunctionRepository.saveOpeningHours(facilityId, hours);
    
    if (response.error) {
      return {
        success: false,
        error: { message: response.error }
      };
    }
    
    console.log('OpeningHoursService.saveOpeningHours - Success:', response.data?.length || 0);
    return {
      success: true,
      data: response.data || []
    };
  }
}

// Export singleton instance for use throughout the application
export const OpeningHoursService = new OpeningHoursServiceClass();
