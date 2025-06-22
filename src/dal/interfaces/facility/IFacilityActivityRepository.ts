import { RepositoryResponse } from '@/types/api';

/**
 * Interface for facility activity repository operations
 * Following Interface Segregation Principle by providing focused activity-related methods
 */
export interface IFacilityActivityRepository {
  /**
   * Get suitable activities for a facility
   * @param facilityId The facility ID
   * @param languageCode The language code (defaults to 'NO')
   */
  getFacilitySuitableActivities(
    facilityId: number | string,
    languageCode?: 'NO' | 'EN'
  ): Promise<RepositoryResponse<string[]>>;

  /**
   * Add suitable activity for a facility
   * @param facilityId The facility ID
   * @param activityName The activity name
   * @param languageCode The language code (defaults to 'NO')
   */
  addFacilitySuitableActivity(
    facilityId: number | string,
    activityName: string,
    languageCode?: 'NO' | 'EN'
  ): Promise<RepositoryResponse<boolean>>;

  /**
   * Remove suitable activity from a facility
   * @param facilityId The facility ID
   * @param activityName The activity name
   * @param languageCode The language code (defaults to 'NO')
   */
  removeFacilitySuitableActivity(
    facilityId: number | string,
    activityName: string,
    languageCode?: 'NO' | 'EN'
  ): Promise<RepositoryResponse<boolean>>;
}
