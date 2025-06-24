
import { facilityRepository } from '@/dal/repositories/FacilityRepository';

export const FacilityService = {
  getFacilities: async (pagination?: any, filters?: any, sort?: any) => {
    console.log('FacilityService.getFacilities - Called with:', { pagination, filters, sort });
    const result = await facilityRepository.getAll();
    console.log('FacilityService.getFacilities - Repository result:', result);
    
    // Transform to expected format
    return {
      success: !result.error,
      data: result.error ? null : {
        data: result.data,
        pagination: {
          page: 1,
          limit: 20,
          total: result.data?.length || 0,
          totalPages: 1,
          hasNext: false,
          hasPrev: false
        }
      },
      error: result.error ? { message: result.error } : undefined
    };
  },
  
  getFacilityById: async (id: string) => {
    console.log('FacilityService.getFacilityById - Called with ID:', id);
    const result = await facilityRepository.getById(id);
    console.log('FacilityService.getFacilityById - Repository result:', result);
    
    return {
      success: !result.error,
      data: result.data,
      error: result.error ? { message: result.error } : undefined
    };
  },
  
  createFacility: async (data: any) => {
    const result = await facilityRepository.create(data);
    return {
      success: !result.error,
      data: result.data,
      error: result.error ? { message: result.error } : undefined
    };
  },
  
  updateFacility: async (id: string, data: any) => {
    const result = await facilityRepository.update(id, data);
    return {
      success: !result.error,
      data: result.data,
      error: result.error ? { message: result.error } : undefined
    };
  },
  
  deleteFacility: async (id: string) => {
    const result = await facilityRepository.delete(id);
    return {
      success: result.success,
      error: result.error ? { message: result.error } : undefined
    };
  },
  
  getFacilitiesByType: facilityRepository.getFacilitiesByType.bind(facilityRepository),
  getFacilitiesByArea: facilityRepository.getFacilitiesByArea.bind(facilityRepository),
  
  getZonesByFacilityId: async (facilityId: string) => {
    console.log('FacilityService.getZonesByFacilityId - Called with facility ID:', facilityId);
    const result = await facilityRepository.getFacilityZones(facilityId);
    console.log('FacilityService.getZonesByFacilityId - Repository result:', result);
    return {
      success: !result.error,
      data: result.data || [],
      error: result.error ? { message: result.error } : undefined
    };
  },
  
  getZoneById: async (zoneId: string) => {
    console.log('FacilityService.getZoneById - Called with zone ID:', zoneId);
    return { success: false, error: { message: 'Zone queries not yet implemented' } };
  }
};
