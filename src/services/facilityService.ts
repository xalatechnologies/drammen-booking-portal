
// Re-export from the main service to maintain compatibility
export { facilityRepository } from '@/dal/repositories/FacilityRepository';

// Also export individual methods for convenience
import { facilityRepository } from '@/dal/repositories/FacilityRepository';

export const FacilityService = {
  getFacilities: facilityRepository.getAll.bind(facilityRepository),
  getFacilityById: facilityRepository.getById.bind(facilityRepository),
  createFacility: facilityRepository.createAsync.bind(facilityRepository),
  updateFacility: facilityRepository.updateAsync.bind(facilityRepository),
  deleteFacility: facilityRepository.deleteAsync.bind(facilityRepository),
  getFacilitiesByType: facilityRepository.getFacilitiesByType.bind(facilityRepository),
  getFacilitiesByArea: facilityRepository.getFacilitiesByArea.bind(facilityRepository),
  getZonesByFacilityId: facilityRepository.getFacilityZones.bind(facilityRepository),
  getZoneById: async (zoneId: string) => {
    // This is a placeholder - we'll implement zone-specific queries later
    console.log('FacilityService.getZoneById called with:', zoneId);
    return { success: false, error: { message: 'Zone queries not yet implemented' } };
  }
};
