
import { facilityBlackoutRepository } from '@/dal/repositories/FacilityBlackoutRepository';
import { PaginationParams } from '@/types/api';

export const FacilityBlackoutService = {
  getBlackouts: async (pagination?: PaginationParams, filters?: any) => {
    console.log('FacilityBlackoutService.getBlackouts - Called with:', { pagination, filters });
    const result = await facilityBlackoutRepository.findAllWithFilters(pagination, filters);
    console.log('FacilityBlackoutService.getBlackouts - Repository result:', result);
    return result;
  },
  
  getBlackoutById: async (id: string) => {
    console.log('FacilityBlackoutService.getBlackoutById - Called with ID:', id);
    const result = await facilityBlackoutRepository.findById(id);
    console.log('FacilityBlackoutService.getBlackoutById - Repository result:', result);
    return result;
  },
  
  createBlackout: async (blackoutData: any) => {
    console.log('FacilityBlackoutService.createBlackout - Called with:', blackoutData);
    return await facilityBlackoutRepository.create(blackoutData);
  },
  
  updateBlackout: async (id: string, blackoutData: any) => {
    console.log('FacilityBlackoutService.updateBlackout - Called with:', { id, blackoutData });
    return await facilityBlackoutRepository.update(id, blackoutData);
  },
  
  deleteBlackout: async (id: string) => {
    console.log('FacilityBlackoutService.deleteBlackout - Called with ID:', id);
    return await facilityBlackoutRepository.delete(id);
  },
  
  getBlackoutsByFacility: async (facilityId: number) => {
    console.log('FacilityBlackoutService.getBlackoutsByFacility - Called with facility ID:', facilityId);
    return await facilityBlackoutRepository.getBlackoutsByFacility(facilityId.toString());
  }
};
