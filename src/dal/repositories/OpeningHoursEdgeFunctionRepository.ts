import { BaseEdgeFunctionRepository } from '../BaseEdgeFunctionRepository';
import { OpeningHour } from '@/services/OpeningHoursService';
import { RepositoryResponse } from '@/types/api';

/**
 * Repository for managing facility opening hours using Edge Functions
 * Extends BaseEdgeFunctionRepository for standardized operations
 */
export class OpeningHoursEdgeFunctionRepository extends BaseEdgeFunctionRepository<OpeningHour> {
  protected functionName = 'opening-hours';
  
  /**
   * Get opening hours for a specific facility
   * @param facilityId Facility ID
   * @returns Repository response with array of opening hours
   */
  async getOpeningHoursByFacilityId(facilityId: number): Promise<RepositoryResponse<OpeningHour[]>> {
    console.log('OpeningHoursEdgeFunctionRepository.getOpeningHoursByFacilityId - Called with facility ID:', facilityId);
    
    return this.customCall<OpeningHour[]>('GET', { facilityId });
  }
  
  /**
   * Save opening hours for a facility (bulk operation)
   * @param facilityId Facility ID
   * @param hours Opening hours data
   * @returns Repository response with saved opening hours
   */
  async saveOpeningHours(facilityId: number, hours: OpeningHour[]): Promise<RepositoryResponse<OpeningHour[]>> {
    console.log('OpeningHoursEdgeFunctionRepository.saveOpeningHours - Called with facility ID and hours:', facilityId, hours);
    
    return this.customCall<OpeningHour[]>('POST', { facilityId, hours });
  }
}

// Export singleton instance for use throughout the application
export const openingHoursEdgeFunctionRepository = new OpeningHoursEdgeFunctionRepository();
