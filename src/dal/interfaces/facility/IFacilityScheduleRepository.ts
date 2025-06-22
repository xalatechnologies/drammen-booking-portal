import { RepositoryResponse } from '@/types/api';
import { BlackoutPeriod, OpeningHours } from '@/types/facility';

/**
 * Specialized repository interface for facility scheduling
 * Following Single Responsibility Principle by focusing only on scheduling concerns
 */
export interface IFacilityScheduleRepository {
  /**
   * Get opening hours for a facility
   */
  getOpeningHours(facilityId: string | number): Promise<RepositoryResponse<OpeningHours[]>>;
  
  /**
   * Update or create opening hours for a facility
   */
  setOpeningHours(facilityId: string | number, openingHours: OpeningHours[]): Promise<RepositoryResponse<OpeningHours[]>>;
  
  /**
   * Add a special opening hours exception (for holidays, special events)
   */
  addOpeningHoursException(
    facilityId: string | number, 
    date: Date, 
    hours: Omit<OpeningHours, 'dayOfWeek'>
  ): Promise<RepositoryResponse<OpeningHours>>;
  
  /**
   * Get blackout periods for a facility
   */
  getBlackoutPeriods(facilityId: string | number): Promise<RepositoryResponse<BlackoutPeriod[]>>;
  
  /**
   * Add a blackout period for a facility
   */
  addBlackoutPeriod(facilityId: string | number, blackoutPeriod: Omit<BlackoutPeriod, 'id'>): Promise<RepositoryResponse<BlackoutPeriod>>;
  
  /**
   * Update an existing blackout period
   */
  updateBlackoutPeriod(
    blackoutPeriodId: string | number, 
    blackoutPeriod: Partial<BlackoutPeriod>
  ): Promise<RepositoryResponse<BlackoutPeriod>>;
  
  /**
   * Delete a blackout period
   */
  deleteBlackoutPeriod(blackoutPeriodId: string | number): Promise<RepositoryResponse<boolean>>;
  
  /**
   * Check if a facility is available at a specific date and time
   * considering opening hours and blackout periods
   */
  checkAvailability(
    facilityId: string | number,
    date: Date,
    startTime: string,
    endTime: string
  ): Promise<RepositoryResponse<boolean>>;
}
