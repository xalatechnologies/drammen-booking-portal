
import { supabase } from '@/integrations/supabase/client';
import { ApiResponse } from '@/types/api';

export interface BlackoutPeriod {
  id?: string;
  facility_id: number;
  type: 'maintenance' | 'renovation' | 'event' | 'weather' | 'other';
  reason: string;
  start_date: string;
  end_date: string;
  created_by?: string;
  created_at?: string;
}

export class BlackoutService {
  static async getBlackoutPeriods(facilityId: number): Promise<ApiResponse<BlackoutPeriod[]>> {
    try {
      console.log('BlackoutService.getBlackoutPeriods - Called with facility ID:', facilityId);
      
      const { data, error } = await supabase.functions.invoke('facility-blackouts', {
        method: 'GET',
        body: { facilityId }
      });

      if (error) {
        console.error('BlackoutService.getBlackoutPeriods - Error:', error);
        return {
          success: false,
          error: { message: error.message || 'Failed to fetch blackout periods' }
        };
      }

      console.log('BlackoutService.getBlackoutPeriods - Success:', data);
      return {
        success: true,
        data: data || []
      };
    } catch (error: any) {
      console.error('BlackoutService.getBlackoutPeriods - Exception:', error);
      return {
        success: false,
        error: { message: error.message || 'Failed to fetch blackout periods' }
      };
    }
  }

  static async createBlackoutPeriod(blackoutData: Omit<BlackoutPeriod, 'id' | 'created_at'>): Promise<ApiResponse<BlackoutPeriod>> {
    try {
      console.log('BlackoutService.createBlackoutPeriod - Called with data:', blackoutData);
      
      const { data, error } = await supabase.functions.invoke('facility-blackouts', {
        method: 'POST',
        body: blackoutData
      });

      if (error) {
        console.error('BlackoutService.createBlackoutPeriod - Error:', error);
        return {
          success: false,
          error: { message: error.message || 'Failed to create blackout period' }
        };
      }

      console.log('BlackoutService.createBlackoutPeriod - Success:', data);
      return {
        success: true,
        data: data
      };
    } catch (error: any) {
      console.error('BlackoutService.createBlackoutPeriod - Exception:', error);
      return {
        success: false,
        error: { message: error.message || 'Failed to create blackout period' }
      };
    }
  }

  static async updateBlackoutPeriod(id: string, blackoutData: Partial<BlackoutPeriod>): Promise<ApiResponse<BlackoutPeriod>> {
    try {
      console.log('BlackoutService.updateBlackoutPeriod - Called with ID and data:', id, blackoutData);
      
      const { data, error } = await supabase.functions.invoke('facility-blackouts', {
        method: 'PUT',
        body: { id, ...blackoutData }
      });

      if (error) {
        console.error('BlackoutService.updateBlackoutPeriod - Error:', error);
        return {
          success: false,
          error: { message: error.message || 'Failed to update blackout period' }
        };
      }

      console.log('BlackoutService.updateBlackoutPeriod - Success:', data);
      return {
        success: true,
        data: data
      };
    } catch (error: any) {
      console.error('BlackoutService.updateBlackoutPeriod - Exception:', error);
      return {
        success: false,
        error: { message: error.message || 'Failed to update blackout period' }
      };
    }
  }

  static async deleteBlackoutPeriod(id: string): Promise<ApiResponse<boolean>> {
    try {
      console.log('BlackoutService.deleteBlackoutPeriod - Called with ID:', id);
      
      const { error } = await supabase.functions.invoke('facility-blackouts', {
        method: 'DELETE',
        body: { id }
      });

      if (error) {
        console.error('BlackoutService.deleteBlackoutPeriod - Error:', error);
        return {
          success: false,
          error: { message: error.message || 'Failed to delete blackout period' }
        };
      }

      console.log('BlackoutService.deleteBlackoutPeriod - Success');
      return {
        success: true,
        data: true
      };
    } catch (error: any) {
      console.error('BlackoutService.deleteBlackoutPeriod - Exception:', error);
      return {
        success: false,
        error: { message: error.message || 'Failed to delete blackout period' }
      };
    }
  }
}
