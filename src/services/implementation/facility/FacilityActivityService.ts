import { BaseService } from '@/services/implementation/base/BaseService';
import { IFacilityActivityService } from '@/services/interfaces/facility/IFacilityActivityService';
import { IFacilityActivityRepository } from '@/dal/interfaces/facility/IFacilityActivityRepository';
import { facilityActivityRepository } from '@/dal/repositories/facility/FacilityActivityRepository';

/**
 * Service implementation for facility activity operations
 * Follows Single Responsibility Principle by focusing only on activity operations
 * Follows Dependency Inversion Principle by depending on repository interface
 */
export class FacilityActivityService implements IFacilityActivityService {
  private repository: IFacilityActivityRepository;

  /**
   * Constructor with dependency injection
   * @param repository The facility activity repository
   */
  constructor(repository: IFacilityActivityRepository = facilityActivityRepository) {
    this.repository = repository;
  }

  /**
   * Get suitable activities for a facility
   * @param facilityId The facility ID
   * @param languageCode The language code (defaults to 'NO')
   */
  async getFacilitySuitableActivities(
    facilityId: number,
    languageCode: 'NO' | 'EN' = 'NO'
  ): Promise<string[]> {
    const result = await this.repository.getFacilitySuitableActivities(facilityId, languageCode);
    
    if (result.error) {
      console.error('Error fetching facility activities:', result.error);
      return [];
    }
    
    return result.data || [];
  }

  /**
   * Add suitable activity for a facility
   * @param facilityId The facility ID
   * @param activityName The activity name
   * @param languageCode The language code (defaults to 'NO')
   */
  async addFacilitySuitableActivity(
    facilityId: number,
    activityName: string,
    languageCode: 'NO' | 'EN' = 'NO'
  ): Promise<boolean> {
    const result = await this.repository.addFacilitySuitableActivity(
      facilityId,
      activityName,
      languageCode
    );
    
    if (result.error) {
      console.error('Error adding facility activity:', result.error);
      return false;
    }
    
    return result.data || false;
  }

  /**
   * Remove suitable activity from a facility
   * @param facilityId The facility ID
   * @param activityName The activity name
   * @param languageCode The language code (defaults to 'NO')
   */
  async removeFacilitySuitableActivity(
    facilityId: number,
    activityName: string,
    languageCode: 'NO' | 'EN' = 'NO'
  ): Promise<boolean> {
    const result = await this.repository.removeFacilitySuitableActivity(
      facilityId,
      activityName,
      languageCode
    );
    
    if (result.error) {
      console.error('Error removing facility activity:', result.error);
      return false;
    }
    
    return result.data || false;
  }
}

// Export singleton instance
export const facilityActivityService = new FacilityActivityService();
