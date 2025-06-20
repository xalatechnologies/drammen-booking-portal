
import { Zone } from '@/types/zone';
import { mockZones, getZonesByFacilityId } from '@/data/mockZones';

export class ZoneRepository {
  private zones: Zone[] = [];

  constructor() {
    this.zones = [...mockZones];
  }

  async getZonesByFacilityId(facilityId: string) {
    try {
      const zones = getZonesByFacilityId(facilityId);
      return { success: true, data: zones };
    } catch (error) {
      return { success: false, error: { message: 'Failed to fetch zones', details: error } };
    }
  }

  async getZoneById(zoneId: string) {
    try {
      const zone = this.zones.find(z => z.id === zoneId);
      if (!zone) {
        return { success: false, error: { message: 'Zone not found', code: 'NOT_FOUND' } };
      }
      return { success: true, data: zone };
    } catch (error) {
      return { success: false, error: { message: 'Failed to fetch zone', details: error } };
    }
  }

  async getMainZones() {
    try {
      const mainZones = this.zones.filter(zone => zone.isMainZone);
      return { success: true, data: mainZones };
    } catch (error) {
      return { success: false, error: { message: 'Failed to fetch main zones', details: error } };
    }
  }
}

// Export singleton instance
export const zoneRepository = new ZoneRepository();
