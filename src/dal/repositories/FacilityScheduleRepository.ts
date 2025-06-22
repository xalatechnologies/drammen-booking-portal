import { IFacilityScheduleRepository } from '../interfaces/IFacilityScheduleRepository';
import { RepositoryResponse } from '@/types/api';
import { BlackoutPeriod, OpeningHours } from '@/types/facility';
import { supabaseClient } from '@/supabase/client';

/**
 * Repository for managing facility schedules (opening hours and blackout periods)
 * Following the Single Responsibility Principle by focusing only on scheduling concerns
 */
export class FacilityScheduleRepository implements IFacilityScheduleRepository {
  private readonly openingHoursTableName = 'facility_opening_hours';
  private readonly blackoutPeriodsTableName = 'facility_blackout_periods';
  
  constructor(private readonly client = supabaseClient) {}

  /**
   * Get opening hours for a facility
   */
  async getOpeningHours(facilityId: string | number): Promise<RepositoryResponse<OpeningHours[]>> {
    try {
      const { data, error } = await this.client
        .from(this.openingHoursTableName)
        .select('*')
        .eq('facility_id', facilityId)
        .order('dayOfWeek', { ascending: true });

      if (error) {
        return {
          success: false,
          error: { message: error.message }
        };
      }

      return {
        success: true,
        data: data as OpeningHours[]
      };
    } catch (error) {
      return {
        success: false,
        error: { message: error instanceof Error ? error.message : 'An unknown error occurred' }
      };
    }
  }

  /**
   * Update or create opening hours for a facility
   */
  async setOpeningHours(facilityId: string | number, openingHours: OpeningHours[]): Promise<RepositoryResponse<OpeningHours[]>> {
    try {
      // Delete existing opening hours
      await this.client
        .from(this.openingHoursTableName)
        .delete()
        .eq('facility_id', facilityId)
        .is('date', null); // Only delete regular opening hours, not exceptions

      // Insert new opening hours
      const hoursWithFacilityId = openingHours.map(hours => ({
        ...hours,
        facility_id: facilityId,
        created_at: new Date()
      }));

      const { data, error } = await this.client
        .from(this.openingHoursTableName)
        .insert(hoursWithFacilityId)
        .select();

      if (error) {
        return {
          success: false,
          error: { message: error.message }
        };
      }

      return {
        success: true,
        data: data as OpeningHours[]
      };
    } catch (error) {
      return {
        success: false,
        error: { message: error instanceof Error ? error.message : 'An unknown error occurred' }
      };
    }
  }

  /**
   * Add a special opening hours exception (for holidays, special events)
   */
  async addOpeningHoursException(
    facilityId: string | number,
    date: Date,
    hours: Omit<OpeningHours, 'dayOfWeek'>
  ): Promise<RepositoryResponse<OpeningHours>> {
    try {
      // Check if there's already an exception for this date
      const { data: existing } = await this.client
        .from(this.openingHoursTableName)
        .select('id')
        .eq('facility_id', facilityId)
        .eq('date', date.toISOString().split('T')[0])
        .maybeSingle();

      // Delete if exists
      if (existing?.id) {
        await this.client
          .from(this.openingHoursTableName)
          .delete()
          .eq('id', existing.id);
      }

      // Insert new exception
      const { data, error } = await this.client
        .from(this.openingHoursTableName)
        .insert({
          ...hours,
          facility_id: facilityId,
          date: date.toISOString().split('T')[0],
          created_at: new Date()
        })
        .select()
        .single();

      if (error) {
        return {
          success: false,
          error: { message: error.message }
        };
      }

      return {
        success: true,
        data: data as OpeningHours
      };
    } catch (error) {
      return {
        success: false,
        error: { message: error instanceof Error ? error.message : 'An unknown error occurred' }
      };
    }
  }

  /**
   * Get blackout periods for a facility
   */
  async getBlackoutPeriods(facilityId: string | number): Promise<RepositoryResponse<BlackoutPeriod[]>> {
    try {
      const { data, error } = await this.client
        .from(this.blackoutPeriodsTableName)
        .select('*')
        .eq('facility_id', facilityId)
        .order('start_date', { ascending: true });

      if (error) {
        return {
          success: false,
          error: { message: error.message }
        };
      }

      return {
        success: true,
        data: data as BlackoutPeriod[]
      };
    } catch (error) {
      return {
        success: false,
        error: { message: error instanceof Error ? error.message : 'An unknown error occurred' }
      };
    }
  }

  /**
   * Add a blackout period for a facility
   */
  async addBlackoutPeriod(facilityId: string | number, blackoutPeriod: Omit<BlackoutPeriod, 'id'>): Promise<RepositoryResponse<BlackoutPeriod>> {
    try {
      const { data, error } = await this.client
        .from(this.blackoutPeriodsTableName)
        .insert({
          ...blackoutPeriod,
          facility_id: facilityId,
          created_at: new Date()
        })
        .select()
        .single();

      if (error) {
        return {
          success: false,
          error: { message: error.message }
        };
      }

      return {
        success: true,
        data: data as BlackoutPeriod
      };
    } catch (error) {
      return {
        success: false,
        error: { message: error instanceof Error ? error.message : 'An unknown error occurred' }
      };
    }
  }

  /**
   * Update an existing blackout period
   */
  async updateBlackoutPeriod(
    blackoutPeriodId: string | number,
    blackoutPeriod: Partial<BlackoutPeriod>
  ): Promise<RepositoryResponse<BlackoutPeriod>> {
    try {
      const { data, error } = await this.client
        .from(this.blackoutPeriodsTableName)
        .update({
          ...blackoutPeriod,
          updated_at: new Date()
        })
        .eq('id', blackoutPeriodId)
        .select()
        .single();

      if (error) {
        return {
          success: false,
          error: { message: error.message }
        };
      }

      return {
        success: true,
        data: data as BlackoutPeriod
      };
    } catch (error) {
      return {
        success: false,
        error: { message: error instanceof Error ? error.message : 'An unknown error occurred' }
      };
    }
  }

  /**
   * Delete a blackout period
   */
  async deleteBlackoutPeriod(blackoutPeriodId: string | number): Promise<RepositoryResponse<boolean>> {
    try {
      const { error } = await this.client
        .from(this.blackoutPeriodsTableName)
        .delete()
        .eq('id', blackoutPeriodId);

      if (error) {
        return {
          success: false,
          error: { message: error.message }
        };
      }

      return {
        success: true,
        data: true
      };
    } catch (error) {
      return {
        success: false,
        error: { message: error instanceof Error ? error.message : 'An unknown error occurred' }
      };
    }
  }

  /**
   * Check if a facility is available at a specific date and time
   * considering opening hours and blackout periods
   */
  async checkAvailability(
    facilityId: string | number,
    date: Date,
    startTime: string,
    endTime: string
  ): Promise<RepositoryResponse<boolean>> {
    try {
      const dateString = date.toISOString().split('T')[0];
      const dayOfWeek = date.getDay(); // 0 is Sunday, 1 is Monday, etc.
      
      // Check for blackout periods
      const { data: blackoutPeriods, error: blackoutError } = await this.client
        .from(this.blackoutPeriodsTableName)
        .select('*')
        .eq('facility_id', facilityId)
        .lte('start_date', dateString)
        .gte('end_date', dateString);
      
      if (blackoutError) {
        return {
          success: false,
          error: { message: blackoutError.message }
        };
      }
      
      // If there's an active blackout period, the facility is unavailable
      if (blackoutPeriods.length > 0) {
        return {
          success: true,
          data: false
        };
      }
      
      // Check for specific opening hours for this date
      const { data: specificHours, error: specificError } = await this.client
        .from(this.openingHoursTableName)
        .select('*')
        .eq('facility_id', facilityId)
        .eq('date', dateString)
        .maybeSingle();
      
      if (specificError) {
        return {
          success: false,
          error: { message: specificError.message }
        };
      }
      
      // If there are specific hours for this date
      if (specificHours) {
        // Check if the facility is open at all on this day
        if (!specificHours.isOpen) {
          return {
            success: true,
            data: false
          };
        }
        
        // Check if the requested time falls within opening hours
        return {
          success: true,
          data: this.isTimeWithinRange(startTime, endTime, specificHours.openTime, specificHours.closeTime)
        };
      }
      
      // If no specific hours, check regular opening hours for this day of week
      const { data: regularHours, error: regularError } = await this.client
        .from(this.openingHoursTableName)
        .select('*')
        .eq('facility_id', facilityId)
        .eq('dayOfWeek', dayOfWeek)
        .is('date', null)
        .maybeSingle();
      
      if (regularError) {
        return {
          success: false,
          error: { message: regularError.message }
        };
      }
      
      // If no regular hours defined for this day or facility is closed
      if (!regularHours || !regularHours.isOpen) {
        return {
          success: true,
          data: false
        };
      }
      
      // Check if the requested time falls within regular opening hours
      return {
        success: true,
        data: this.isTimeWithinRange(startTime, endTime, regularHours.openTime, regularHours.closeTime)
      };
    } catch (error) {
      return {
        success: false,
        error: { message: error instanceof Error ? error.message : 'An unknown error occurred' }
      };
    }
  }
  
  /**
   * Helper method to check if a time range is within another time range
   * @private
   */
  private isTimeWithinRange(
    startTime: string, 
    endTime: string, 
    facilityOpenTime: string, 
    facilityCloseTime: string
  ): boolean {
    // Convert times to minutes for easy comparison
    const convertToMinutes = (time: string): number => {
      const [hours, minutes] = time.split(':').map(Number);
      return hours * 60 + minutes;
    };
    
    const requestStart = convertToMinutes(startTime);
    const requestEnd = convertToMinutes(endTime);
    const facilityStart = convertToMinutes(facilityOpenTime);
    const facilityEnd = convertToMinutes(facilityCloseTime);
    
    // Check if the requested time range is within facility opening hours
    return requestStart >= facilityStart && requestEnd <= facilityEnd;
  }
}

// Export singleton instance
export const facilityScheduleRepository = new FacilityScheduleRepository();
