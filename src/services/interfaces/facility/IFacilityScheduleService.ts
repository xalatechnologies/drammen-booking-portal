import { BlackoutPeriod, OpeningHours } from '@/types/facility';

/**
 * Service interface for facility schedule operations
 * Follows Single Responsibility Principle by focusing only on scheduling concerns
 * Follows Interface Segregation Principle by providing focused methods
 */
export interface IFacilityScheduleService {
  /**
   * Get opening hours for a facility
   * @param facilityId The facility ID
   */
  getOpeningHours(facilityId: string | number): Promise<OpeningHours[]>;
  
  /**
   * Update or create opening hours for a facility
   * @param facilityId The facility ID
   * @param openingHours The opening hours data
   */
  setOpeningHours(facilityId: string | number, openingHours: OpeningHours[]): Promise<OpeningHours[]>;
  
  /**
   * Add a special opening hours exception (for holidays, special events)
   * @param facilityId The facility ID
   * @param date The specific date for the exception
   * @param hours The special hours for this date
   */
  addOpeningHoursException(
    facilityId: string | number,
    date: Date,
    hours: Omit<OpeningHours, 'dayOfWeek'>
  ): Promise<OpeningHours>;
  
  /**
   * Get all blackout periods for a facility
   * @param facilityId The facility ID
   */
  getBlackoutPeriods(facilityId: string | number): Promise<BlackoutPeriod[]>;
  
  /**
   * Add a new blackout period for a facility
   * @param facilityId The facility ID
   * @param blackoutPeriod The blackout period data
   */
  addBlackoutPeriod(
    facilityId: string | number,
    blackoutPeriod: Omit<BlackoutPeriod, 'id'>
  ): Promise<BlackoutPeriod>;
  
  /**
   * Update an existing blackout period
   * @param blackoutPeriodId The blackout period ID
   * @param blackoutPeriod The blackout period data to update
   */
  updateBlackoutPeriod(
    blackoutPeriodId: string | number,
    blackoutPeriod: Partial<BlackoutPeriod>
  ): Promise<BlackoutPeriod>;
  
  /**
   * Delete a blackout period
   * @param blackoutPeriodId The blackout period ID to delete
   */
  deleteBlackoutPeriod(blackoutPeriodId: string | number): Promise<boolean>;
  
  /**
   * Check if a facility is available at a specific date and time
   * considering opening hours and blackout periods
   * @param facilityId The facility ID
   * @param date The date to check
   * @param startTime The start time to check (format: "HH:MM")
   * @param endTime The end time to check (format: "HH:MM")
   */
  checkAvailability(
    facilityId: string | number,
    date: Date,
    startTime: string,
    endTime: string
  ): Promise<boolean>;
  
  /**
   * Get next available slots for a facility
   * @param facilityId The facility ID
   * @param fromDate Start looking from this date
   * @param durationMinutes The required duration in minutes
   * @param limit Maximum number of slots to return
   */
  getNextAvailableSlots(
    facilityId: string | number,
    fromDate: Date,
    durationMinutes: number,
    limit?: number
  ): Promise<Array<{ date: Date; startTime: string; endTime: string }>>;
}
