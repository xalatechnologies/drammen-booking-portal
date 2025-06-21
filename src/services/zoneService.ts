
import { zoneRepository } from '@/dal/repositories/ZoneRepository';
import { Zone } from '@/types/zone';
import { ApiResponse } from '@/types/api';

export class ZoneService {
  static async getZones(): Promise<ApiResponse<Zone[]>> {
    const result = await zoneRepository.findAll();
    
    if (result.error) {
      return {
        success: false,
        error: { message: result.error }
      };
    }
    
    return {
      success: true,
      data: result.data || []
    };
  }

  static async getZoneById(id: string): Promise<ApiResponse<Zone>> {
    const result = await zoneRepository.findById(id);
    
    if (result.error) {
      return {
        success: false,
        error: { message: result.error }
      };
    }
    
    return {
      success: true,
      data: result.data!
    };
  }

  static async createZone(zoneData: Omit<Zone, 'id' | 'created_at' | 'updated_at'>): Promise<ApiResponse<Zone>> {
    const result = await zoneRepository.create({
      ...zoneData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });
    
    if (result.error) {
      return {
        success: false,
        error: { message: result.error }
      };
    }
    
    return {
      success: true,
      data: result.data!
    };
  }

  static async updateZone(id: string, zoneData: Partial<Zone>): Promise<ApiResponse<Zone>> {
    const result = await zoneRepository.update(id, {
      ...zoneData,
      updated_at: new Date().toISOString()
    });
    
    if (result.error) {
      return {
        success: false,
        error: { message: result.error }
      };
    }
    
    return {
      success: true,
      data: result.data!
    };
  }

  static async deleteZone(id: string): Promise<ApiResponse<boolean>> {
    const result = await zoneRepository.delete(id);
    
    if (result.error) {
      return {
        success: false,
        error: { message: result.error }
      };
    }
    
    return {
      success: true,
      data: result.data!
    };
  }

  static async getZonesByFacility(facilityId: number): Promise<ApiResponse<Zone[]>> {
    const result = await zoneRepository.findAll();
    
    if (result.error) {
      return {
        success: false,
        error: { message: result.error }
      };
    }

    const zones = (result.data || []).filter(zone => zone.facility_id === facilityId);
    
    return {
      success: true,
      data: zones
    };
  }
}
