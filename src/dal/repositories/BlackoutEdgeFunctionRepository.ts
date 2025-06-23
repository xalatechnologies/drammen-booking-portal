import { BaseEdgeFunctionRepository } from '../BaseEdgeFunctionRepository';
import { BlackoutPeriod } from '@/services/BlackoutService';
import { RepositoryResponse } from '@/types/api';

/**
 * Repository for managing facility blackout periods using Edge Functions
 * Extends BaseEdgeFunctionRepository for standardized operations
 */
export class BlackoutEdgeFunctionRepository extends BaseEdgeFunctionRepository<BlackoutPeriod> {
  protected functionName = 'facility-blackouts';
  
  /**
   * Get blackout periods for a specific facility
   * @param facilityId Facility ID
   * @returns Repository response with array of blackout periods
   */
  async getBlackoutPeriodsByFacilityId(facilityId: number): Promise<RepositoryResponse<BlackoutPeriod[]>> {
    console.log('BlackoutEdgeFunctionRepository.getBlackoutPeriodsByFacilityId - Called with facility ID:', facilityId);
    
    return this.customCall<BlackoutPeriod[]>('GET', { facilityId });
  }
  
  /**
   * Create a new blackout period
   * @param blackoutData Blackout period data
   * @returns Repository response with created blackout period
   */
  async createBlackoutPeriod(blackoutData: Omit<BlackoutPeriod, 'id' | 'created_at'>): Promise<RepositoryResponse<BlackoutPeriod>> {
    return this.create(blackoutData);
  }
  
  /**
   * Update an existing blackout period
   * @param id Blackout period ID
   * @param blackoutData Updated blackout period data
   * @returns Repository response with updated blackout period
   */
  async updateBlackoutPeriod(id: string, blackoutData: Partial<BlackoutPeriod>): Promise<RepositoryResponse<BlackoutPeriod>> {
    return this.update(id, blackoutData);
  }
  
  /**
   * Delete a blackout period
   * @param id Blackout period ID
   * @returns Repository response with success status
   */
  async deleteBlackoutPeriod(id: string): Promise<RepositoryResponse<boolean>> {
    return this.delete(id);
  }
}

// Export singleton instance for use throughout the application
export const blackoutEdgeFunctionRepository = new BlackoutEdgeFunctionRepository();
