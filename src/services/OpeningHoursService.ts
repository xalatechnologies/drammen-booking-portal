
import { supabase } from '@/integrations/supabase/client';
import { ApiResponse } from '@/types/api';

interface OpeningHours {
  id?: string;
  facility_id?: number;
  zone_id?: string;
  day_of_week: number;
  open_time: string;
  close_time: string;
  is_open: boolean;
  valid_from?: string;
  valid_to?: string;
}

export class OpeningHoursService {
  private static readonly EDGE_FUNCTION_URL = 'https://szpdoihoxzlivothoyva.supabase.co/functions/v1/opening-hours';

  static async getFacilityOpeningHours(facilityId: number): Promise<ApiResponse<OpeningHours[]>> {
    try {
      console.log('OpeningHoursService.getFacilityOpeningHours - Called with facility ID:', facilityId);

      const { data: { session } } = await supabase.auth.getSession();
      
      const response = await fetch(`${this.EDGE_FUNCTION_URL}?facilityId=${facilityId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': session ? `Bearer ${session.access_token}` : `Bearer ${process.env.SUPABASE_ANON_KEY}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('OpeningHoursService.getFacilityOpeningHours - Response:', result);
      return result;
    } catch (error) {
      console.error('OpeningHoursService.getFacilityOpeningHours - Error:', error);
      return {
        success: false,
        error: {
          message: 'Failed to fetch facility opening hours',
          details: error
        }
      };
    }
  }

  static async getZoneOpeningHours(zoneId: string): Promise<ApiResponse<OpeningHours[]>> {
    try {
      console.log('OpeningHoursService.getZoneOpeningHours - Called with zone ID:', zoneId);

      const { data: { session } } = await supabase.auth.getSession();
      
      const response = await fetch(`${this.EDGE_FUNCTION_URL}?zoneId=${zoneId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': session ? `Bearer ${session.access_token}` : `Bearer ${process.env.SUPABASE_ANON_KEY}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('OpeningHoursService.getZoneOpeningHours - Response:', result);
      return result;
    } catch (error) {
      console.error('OpeningHoursService.getZoneOpeningHours - Error:', error);
      return {
        success: false,
        error: {
          message: 'Failed to fetch zone opening hours',
          details: error
        }
      };
    }
  }

  static async updateOpeningHours(hoursData: {
    facility_id?: number;
    zone_id?: string;
    opening_hours: OpeningHours[];
  }): Promise<ApiResponse<OpeningHours[]>> {
    try {
      console.log('OpeningHoursService.updateOpeningHours - Called with:', hoursData);

      const { data: { session } } = await supabase.auth.getSession();
      
      const response = await fetch(this.EDGE_FUNCTION_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': session ? `Bearer ${session.access_token}` : `Bearer ${process.env.SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify(hoursData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('OpeningHoursService.updateOpeningHours - Response:', result);
      return result;
    } catch (error) {
      console.error('OpeningHoursService.updateOpeningHours - Error:', error);
      return {
        success: false,
        error: {
          message: 'Failed to update opening hours',
          details: error
        }
      };
    }
  }
}
