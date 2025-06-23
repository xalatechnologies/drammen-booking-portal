
import { supabase } from '@/integrations/supabase/client';
import { ApiResponse } from '@/types/api';

export interface OpeningHour {
  id?: string;
  facility_id: number;
  day_of_week: number;
  open_time: string;
  close_time: string;
  is_open: boolean;
  valid_from?: string;
  valid_to?: string;
}

export class OpeningHoursService {
  static async getOpeningHours(facilityId: number): Promise<ApiResponse<OpeningHour[]>> {
    try {
      console.log('OpeningHoursService.getOpeningHours - Called with facility ID:', facilityId);
      
      const { data, error } = await supabase.functions.invoke('opening-hours', {
        method: 'GET',
        body: { facilityId }
      });

      if (error) {
        console.error('OpeningHoursService.getOpeningHours - Error:', error);
        return {
          success: false,
          error: { message: error.message || 'Failed to fetch opening hours' }
        };
      }

      console.log('OpeningHoursService.getOpeningHours - Success:', data);
      return {
        success: true,
        data: data || []
      };
    } catch (error: any) {
      console.error('OpeningHoursService.getOpeningHours - Exception:', error);
      return {
        success: false,
        error: { message: error.message || 'Failed to fetch opening hours' }
      };
    }
  }

  static async saveOpeningHours(facilityId: number, hours: OpeningHour[]): Promise<ApiResponse<OpeningHour[]>> {
    try {
      console.log('OpeningHoursService.saveOpeningHours - Called with facility ID and hours:', facilityId, hours);
      
      const { data, error } = await supabase.functions.invoke('opening-hours', {
        method: 'POST',
        body: { facilityId, hours }
      });

      if (error) {
        console.error('OpeningHoursService.saveOpeningHours - Error:', error);
        return {
          success: false,
          error: { message: error.message || 'Failed to save opening hours' }
        };
      }

      console.log('OpeningHoursService.saveOpeningHours - Success:', data);
      return {
        success: true,
        data: data || []
      };
    } catch (error: any) {
      console.error('OpeningHoursService.saveOpeningHours - Exception:', error);
      return {
        success: false,
        error: { message: error.message || 'Failed to save opening hours' }
      };
    }
  }
}
