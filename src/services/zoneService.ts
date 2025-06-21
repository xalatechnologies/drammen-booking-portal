
import { zoneRepository } from '@/dal/repositories/ZoneRepository';
import { PaginationParams } from '@/types/api';

export const ZoneService = {
  getZones: async (pagination?: PaginationParams, filters?: any) => {
    console.log('ZoneService.getZones - Called with:', { pagination, filters });
    const result = await zoneRepository.getAll(pagination, filters);
    console.log('ZoneService.getZones - Repository result:', result);
    return result;
  },
  
  getZoneById: async (id: string) => {
    console.log('ZoneService.getZoneById - Called with ID:', id);
    const result = await zoneRepository.getById(id);
    console.log('ZoneService.getZoneById - Repository result:', result);
    return result;
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
  },
  
  getZonesByFacility: async (facilityId: string) => {
    console.log('ZoneService.getZonesByFacility - Called with facility ID:', facilityId);
    return await zoneRepository.getZonesByFacility(facilityId);
  },
  
  checkZoneConflicts: async (zoneId: string, startDate: Date, endDate: Date) => {
    console.log('ZoneService.checkZoneConflicts - Called with:', { zoneId, startDate, endDate });
    return await zoneRepository.checkZoneConflicts(zoneId, startDate, endDate);
  }
};
