import { BaseEdgeFunctionRepository } from '../BaseEdgeFunctionRepository';
import { Zone } from '@/types/facility';
import { RepositoryResponse } from '@/types/api';

/**
 * Repository for managing facility zones using Edge Functions
 * Extends BaseEdgeFunctionRepository for standardized operations
 */
export class ZoneEdgeFunctionRepository extends BaseEdgeFunctionRepository<Zone> {
  protected functionName = 'zones';
  
  /**
   * Get zones for a specific facility
   * @param facilityId Facility ID
   * @returns Repository response with array of zones
   */
  async getZonesByFacilityId(facilityId: number): Promise<RepositoryResponse<Zone[]>> {
    console.log('ZoneEdgeFunctionRepository.getZonesByFacilityId - Called with facility ID:', facilityId);
    
    const response = await this.customCall<Zone[]>('GET', { facilityId });
    
    if (response.error) {
      return response;
    }
    
    // Process the data to ensure all fields are properly formatted
    const processedData = Array.isArray(response.data) ? response.data.map(zone => {
      // Ensure arrays are properly handled
      let equipment = zone.equipment;
      let amenities = zone.amenities;
      let accessibilityFeatures = zone.accessibility_features;
      
      // Parse JSON strings if needed
      try {
        if (typeof equipment === 'string') equipment = JSON.parse(equipment || '[]');
        if (typeof amenities === 'string') amenities = JSON.parse(amenities || '[]');
        if (typeof accessibilityFeatures === 'string') accessibilityFeatures = JSON.parse(accessibilityFeatures || '[]');
      } catch (e) {
        console.warn('ZoneEdgeFunctionRepository - Error parsing JSON arrays:', e);
      }
      
      return {
        ...zone,
        equipment: Array.isArray(equipment) ? equipment : [],
        amenities: Array.isArray(amenities) ? amenities : [],
        accessibility_features: Array.isArray(accessibilityFeatures) ? accessibilityFeatures : []
      };
    }) : [];
    
    console.log('ZoneEdgeFunctionRepository.getZonesByFacilityId - Success, processed zones:', processedData.length);
    return { data: processedData };
  }
  
  /**
   * Override sanitizeData to handle array fields properly
   * @param data Zone data to sanitize
   * @returns Sanitized zone data
   */
  protected sanitizeData(data: Record<string, any>): Record<string, any> {
    return {
      ...data,
      equipment: Array.isArray(data.equipment) ? data.equipment : [],
      amenities: Array.isArray(data.amenities) ? data.amenities : [],
      accessibility_features: Array.isArray(data.accessibility_features) ? data.accessibility_features : []
    };
  }
}

// Export singleton instance for use throughout the application
export const zoneEdgeFunctionRepository = new ZoneEdgeFunctionRepository();
