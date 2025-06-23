import { ApiResponse } from '@/types/api';
import { Zone } from '@/types/facility';
import { zoneEdgeFunctionRepository } from '@/dal/repositories/ZoneEdgeFunctionRepository';

/**
 * Service for managing facility zones
 * Uses ZoneEdgeFunctionRepository for data access
 */
class ZoneServiceClass {
  /**
   * Get zones for a specific facility
   * @param facilityId Facility ID
   * @returns ApiResponse with array of zones
   */
  async getZonesByFacilityId(facilityId: number): Promise<ApiResponse<Zone[]>> {
    console.log('ZoneService.getZonesByFacilityId - Called with facility ID:', facilityId);
    
    const response = await zoneEdgeFunctionRepository.getZonesByFacilityId(facilityId);
    
    if (response.error) {
      return {
        success: false,
        error: { message: response.error }
      };
    }
    
    console.log('ZoneService.getZonesByFacilityId - Success, zones:', response.data?.length || 0);
    return { success: true, data: response.data || [] };
  }
  
  /**
   * Create a new zone
   * @param zoneData Zone data
   * @returns ApiResponse with created zone
   */
  async createZone(zoneData: Partial<Zone>): Promise<ApiResponse<Zone>> {
    console.log('ZoneService.createZone - Called with data:', zoneData);
    
    // Use the custom call method to avoid type constraints of the create method
    const response = await zoneEdgeFunctionRepository.customCall<Zone>('POST', zoneData);
    
    if (response.error) {
      return {
        success: false,
        error: { message: response.error }
      };
    }
    
    console.log('ZoneService.createZone - Success:', response.data);
    return { success: true, data: response.data as Zone };
  }
  
  /**
   * Update an existing zone
   * @param zoneId Zone ID
   * @param zoneData Updated zone data
   * @returns ApiResponse with updated zone
   */
  async updateZone(zoneId: string, zoneData: Partial<Zone>): Promise<ApiResponse<Zone>> {
    console.log('ZoneService.updateZone - Called with ID:', zoneId, 'and data:', zoneData);
    
    const response = await zoneEdgeFunctionRepository.update(zoneId, zoneData);
    
    if (response.error) {
      return {
        success: false,
        error: { message: response.error }
      };
    }
    
    console.log('ZoneService.updateZone - Success:', response.data);
    return { success: true, data: response.data as Zone };
  }
  
  /**
   * Delete a zone
   * @param zoneId Zone ID
   * @returns ApiResponse with success status
   */
  async deleteZone(zoneId: string): Promise<ApiResponse<void>> {
    console.log('ZoneService.deleteZone - Called with ID:', zoneId);
    
    const response = await zoneEdgeFunctionRepository.delete(zoneId);
    
    if (response.error) {
      return {
        success: false,
        error: { message: response.error }
      };
    }
    
    console.log('ZoneService.deleteZone - Success');
    return { success: true };
  }
}

// Export singleton instance for use throughout the application
export const ZoneService = new ZoneServiceClass();
