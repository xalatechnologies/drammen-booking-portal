
import { supabase } from '@/integrations/supabase/client';
import { ApiResponse } from '@/types/api';
import { Zone } from '@/types/facility';

export class ZoneService {
  static async getZonesByFacilityId(facilityId: number): Promise<ApiResponse<Zone[]>> {
    try {
      console.log('ZoneService.getZonesByFacilityId - Called with facility ID:', facilityId);
      
      const { data, error } = await supabase.functions.invoke('zones', {
        method: 'GET',
        body: { facilityId }
      });

      if (error) {
        console.error('ZoneService.getZonesByFacilityId - Error:', error);
        return {
          success: false,
          error: { message: error.message || 'Failed to fetch zones' }
        };
      }

      console.log('ZoneService.getZonesByFacilityId - Success:', data);
      return {
        success: true,
        data: data || []
      };
    } catch (error: any) {
      console.error('ZoneService.getZonesByFacilityId - Exception:', error);
      return {
        success: false,
        error: { message: error.message || 'Failed to fetch zones' }
      };
    }
  }

  static async createZone(zoneData: Partial<Zone>): Promise<ApiResponse<Zone>> {
    try {
      console.log('ZoneService.createZone - Called with data:', zoneData);
      
      const { data, error } = await supabase.functions.invoke('zones', {
        method: 'POST',
        body: zoneData
      });

      if (error) {
        console.error('ZoneService.createZone - Error:', error);
        return {
          success: false,
          error: { message: error.message || 'Failed to create zone' }
        };
      }

      console.log('ZoneService.createZone - Success:', data);
      return {
        success: true,
        data: data
      };
    } catch (error: any) {
      console.error('ZoneService.createZone - Exception:', error);
      return {
        success: false,
        error: { message: error.message || 'Failed to create zone' }
      };
    }
  }

  static async updateZone(id: string, zoneData: Partial<Zone>): Promise<ApiResponse<Zone>> {
    try {
      console.log('ZoneService.updateZone - Called with ID and data:', id, zoneData);
      
      const { data, error } = await supabase.functions.invoke('zones', {
        method: 'PUT',
        body: { id, ...zoneData }
      });

      if (error) {
        console.error('ZoneService.updateZone - Error:', error);
        return {
          success: false,
          error: { message: error.message || 'Failed to update zone' }
        };
      }

      console.log('ZoneService.updateZone - Success:', data);
      return {
        success: true,
        data: data
      };
    } catch (error: any) {
      console.error('ZoneService.updateZone - Exception:', error);
      return {
        success: false,
        error: { message: error.message || 'Failed to update zone' }
      };
    }
  }

  static async deleteZone(id: string): Promise<ApiResponse<boolean>> {
    try {
      console.log('ZoneService.deleteZone - Called with ID:', id);
      
      const { error } = await supabase.functions.invoke('zones', {
        method: 'DELETE',
        body: { id }
      });

      if (error) {
        console.error('ZoneService.deleteZone - Error:', error);
        return {
          success: false,
          error: { message: error.message || 'Failed to delete zone' }
        };
      }

      console.log('ZoneService.deleteZone - Success');
      return {
        success: true,
        data: true
      };
    } catch (error: any) {
      console.error('ZoneService.deleteZone - Exception:', error);
      return {
        success: false,
        error: { message: error.message || 'Failed to delete zone' }
      };
    }
  }
}
