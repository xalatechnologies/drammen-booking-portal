
import { ApiResponse } from '@/types/api';
import { blackoutEdgeFunctionRepository } from '@/dal/repositories/BlackoutEdgeFunctionRepository';

export interface BlackoutPeriod {
  id?: string;
  facility_id: number;
  type: 'maintenance' | 'renovation' | 'event' | 'weather' | 'other';
  reason: string;
  start_date: string;
  end_date: string;
  created_by?: string;
  created_at?: string;
}

/**
 * Service for managing facility blackout periods
 * Uses BlackoutEdgeFunctionRepository for data access
 */
class BlackoutServiceClass {
  /**
   * Get blackout periods for a specific facility
   * @param facilityId Facility ID
   * @returns ApiResponse with array of blackout periods
   */
  async getBlackoutPeriods(facilityId: number): Promise<ApiResponse<BlackoutPeriod[]>> {
    console.log('BlackoutService.getBlackoutPeriods - Called with facility ID:', facilityId);
    
    const response = await blackoutEdgeFunctionRepository.getBlackoutPeriodsByFacilityId(facilityId);
    
    if (response.error) {
      return {
        success: false,
        error: { message: response.error }
      };
    }
    
    console.log('BlackoutService.getBlackoutPeriods - Success:', response.data?.length || 0);
    return {
      success: true,
      data: response.data || []
    };
  }

  /**
   * Create a new blackout period
   * @param blackoutData Blackout period data
   * @returns ApiResponse with created blackout period
   */
  async createBlackoutPeriod(blackoutData: Omit<BlackoutPeriod, 'id' | 'created_at'>): Promise<ApiResponse<BlackoutPeriod>> {
    console.log('BlackoutService.createBlackoutPeriod - Called with data:', blackoutData);
    
    const response = await blackoutEdgeFunctionRepository.customCall<BlackoutPeriod>('POST', blackoutData);
    
    if (response.error) {
      return {
        success: false,
        error: { message: response.error }
      };
    }
    
    console.log('BlackoutService.createBlackoutPeriod - Success:', response.data);
    return {
      success: true,
      data: response.data as BlackoutPeriod
    };
  }

  /**
   * Update an existing blackout period
   * @param id Blackout period ID
   * @param blackoutData Updated blackout period data
   * @returns ApiResponse with updated blackout period
   */
  async updateBlackoutPeriod(id: string, blackoutData: Partial<BlackoutPeriod>): Promise<ApiResponse<BlackoutPeriod>> {
    console.log('BlackoutService.updateBlackoutPeriod - Called with ID and data:', id, blackoutData);
    
    const response = await blackoutEdgeFunctionRepository.update(id, blackoutData);
    
    if (response.error) {
      return {
        success: false,
        error: { message: response.error }
      };
    }
    
    console.log('BlackoutService.updateBlackoutPeriod - Success:', response.data);
    return {
      success: true,
      data: response.data as BlackoutPeriod
    };
  }

  /**
   * Delete a blackout period
   * @param id Blackout period ID
   * @returns ApiResponse with success status
   */
  async deleteBlackoutPeriod(id: string): Promise<ApiResponse<boolean>> {
    console.log('BlackoutService.deleteBlackoutPeriod - Called with ID:', id);
    
    const response = await blackoutEdgeFunctionRepository.delete(id);
    
    if (response.error) {
      return {
        success: false,
        error: { message: response.error }
      };
    }
    
    console.log('BlackoutService.deleteBlackoutPeriod - Success');
    return {
      success: true,
      data: true
    };
  }
}

// Export singleton instance for use throughout the application
export const BlackoutService = new BlackoutServiceClass();
