import { IFacilityActivityRepository } from '@/dal/interfaces/facility/IFacilityActivityRepository';
import { RepositoryResponse } from '@/types/api';
import { supabaseClient } from '@/supabase/client';

/**
 * Repository implementation for facility activity operations
 * Follows Single Responsibility Principle by focusing only on activity operations
 */
export class FacilityActivityRepository implements IFacilityActivityRepository {
  private readonly client;
  private readonly tableName = 'facility_suitable_activities';

  constructor(client = supabaseClient) {
    this.client = client;
  }

  /**
   * Get suitable activities for a facility
   * @param facilityId The facility ID
   * @param languageCode The language code (defaults to 'NO')
   */
  async getFacilitySuitableActivities(
    facilityId: number | string,
    languageCode: 'NO' | 'EN' = 'NO'
  ): Promise<RepositoryResponse<string[]>> {
    try {
      const { data, error } = await this.client
        .from(this.tableName)
        .select('activity_name')
        .eq('facility_id', facilityId)
        .eq('language_code', languageCode);

      if (error) {
        return {
          data: [],
          error: error.message || 'Error fetching facility activities'
        };
      }

      return {
        data: data?.map(item => item.activity_name) || []
      };
    } catch (error: any) {
      return {
        data: [],
        error: error.message || 'Error in getFacilitySuitableActivities'
      };
    }
  }

  /**
   * Add suitable activity for a facility
   * @param facilityId The facility ID
   * @param activityName The activity name
   * @param languageCode The language code (defaults to 'NO')
   */
  async addFacilitySuitableActivity(
    facilityId: number | string,
    activityName: string,
    languageCode: 'NO' | 'EN' = 'NO'
  ): Promise<RepositoryResponse<boolean>> {
    try {
      const { error } = await this.client
        .from(this.tableName)
        .insert({
          facility_id: facilityId,
          activity_name: activityName,
          language_code: languageCode
        });

      if (error) {
        return {
          data: false,
          error: error.message || 'Error adding facility activity'
        };
      }

      return {
        data: true
      };
    } catch (error: any) {
      return {
        data: false,
        error: error.message || 'Error in addFacilitySuitableActivity'
      };
    }
  }

  /**
   * Remove suitable activity from a facility
   * @param facilityId The facility ID
   * @param activityName The activity name
   * @param languageCode The language code (defaults to 'NO')
   */
  async removeFacilitySuitableActivity(
    facilityId: number | string,
    activityName: string,
    languageCode: 'NO' | 'EN' = 'NO'
  ): Promise<RepositoryResponse<boolean>> {
    try {
      const { error } = await this.client
        .from(this.tableName)
        .delete()
        .eq('facility_id', facilityId)
        .eq('activity_name', activityName)
        .eq('language_code', languageCode);

      if (error) {
        return {
          data: false,
          error: error.message || 'Error removing facility activity'
        };
      }

      return {
        data: true
      };
    } catch (error: any) {
      return {
        data: false,
        error: error.message || 'Error in removeFacilitySuitableActivity'
      };
    }
  }
}

// Export singleton instance
export const facilityActivityRepository = new FacilityActivityRepository();
