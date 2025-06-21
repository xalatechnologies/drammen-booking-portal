
import { zoneRepository } from '@/dal/repositories/ZoneRepository';

export const ZoneService = {
  getZones: async (pagination?: any, filters?: any) => {
    console.log('ZoneService.getZones - Called with:', { pagination, filters });
    return await zoneRepository.getAll(pagination, filters);
  },
  
  getZoneById: async (id: string) => {
    console.log('ZoneService.getZoneById - Called with ID:', id);
    return await zoneRepository.getById(id);
  },
  
  createZone: async (zoneData: any) => {
    console.log('ZoneService.createZone - Called with:', zoneData);
    return await zoneRepository.createAsync(zoneData);
  },
  
  updateZone: async (id: string, zoneData: any) => {
    console.log('ZoneService.updateZone - Called with:', { id, zoneData });
    return await zoneRepository.updateAsync(id, zoneData);
  },
  
  deleteZone: async (id: string) => {
    console.log('ZoneService.deleteZone - Called with ID:', id);
    return await zoneRepository.deleteAsync(id);
  }
};
