
// Re-export from the main service to maintain compatibility
export { facilityRepository } from '@/dal/repositories/FacilityRepository';

// Also export individual methods for convenience
import { facilityRepository } from '@/dal/repositories/FacilityRepository';

export const FacilityService = {
  getFacilities: async (pagination, filters, sort) => {
    console.log('FacilityService.getFacilities - Called with:', { pagination, filters, sort });
    const result = await facilityRepository.getAll(pagination, filters);
    console.log('FacilityService.getFacilities - Repository result:', result);
    return result;
  },
  getFacilityById: async (id) => {
    console.log('FacilityService.getFacilityById - Called with ID:', id);
    const result = await facilityRepository.getById(id);
    console.log('FacilityService.getFacilityById - Repository result:', result);
    return result;
  },
  createFacility: facilityRepository.createAsync.bind(facilityRepository),
  updateFacility: facilityRepository.updateAsync.bind(facilityRepository),
  deleteFacility: facilityRepository.deleteAsync.bind(facilityRepository),
  getFacilitiesByType: facilityRepository.getFacilitiesByType.bind(facilityRepository),
  getFacilitiesByArea: facilityRepository.getFacilitiesByArea.bind(facilityRepository),
  getZonesByFacilityId: async (facilityId) => {
    console.log('FacilityService.getZonesByFacilityId - Called with facility ID:', facilityId);
    const result = await facilityRepository.getFacilityZones(facilityId);
    console.log('FacilityService.getZonesByFacilityId - Repository result:', result);
    return result;
  },
  getZoneById: async (zoneId) => {
    console.log('FacilityService.getZoneById - Called with zone ID:', zoneId);
    // This is a placeholder - we'll implement zone-specific queries later
    console.log('FacilityService.getZoneById - Zone queries not yet implemented');
    return { success: false, error: { message: 'Zone queries not yet implemented' } };
  }
};
