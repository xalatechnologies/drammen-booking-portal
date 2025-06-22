/**
 * Interface for facility activity service operations
 * Following Interface Segregation Principle by defining focused service methods
 */
export interface IFacilityActivityService {
  /**
   * Get suitable activities for a facility
   * @param facilityId The facility ID
   * @param languageCode The language code (defaults to 'NO')
   */
  getFacilitySuitableActivities(
    facilityId: number,
    languageCode?: 'NO' | 'EN'
  ): Promise<string[]>;

  /**
   * Add suitable activity for a facility
   * @param facilityId The facility ID
   * @param activityName The activity name
   * @param languageCode The language code (defaults to 'NO')
   */
  addFacilitySuitableActivity(
    facilityId: number,
    activityName: string,
    languageCode?: 'NO' | 'EN'
  ): Promise<boolean>;

  /**
   * Remove suitable activity from a facility
   * @param facilityId The facility ID
   * @param activityName The activity name
   * @param languageCode The language code (defaults to 'NO')
   */
  removeFacilitySuitableActivity(
    facilityId: number,
    activityName: string,
    languageCode?: 'NO' | 'EN'
  ): Promise<boolean>;
}
