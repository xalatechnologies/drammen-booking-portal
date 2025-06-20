
// Re-export from the main service to maintain compatibility
export { SupabaseFacilityService as FacilityService } from '@/services/SupabaseFacilityService';

// Also export individual methods for convenience
import { SupabaseFacilityService } from '@/services/SupabaseFacilityService';

export const facilityService = {
  getFacilities: SupabaseFacilityService.getFacilities.bind(SupabaseFacilityService),
  getFacilityById: SupabaseFacilityService.getFacilityById.bind(SupabaseFacilityService),
  createFacility: SupabaseFacilityService.createFacility.bind(SupabaseFacilityService),
  updateFacility: SupabaseFacilityService.updateFacility.bind(SupabaseFacilityService),
  deleteFacility: SupabaseFacilityService.deleteFacility.bind(SupabaseFacilityService),
  getFacilityZones: SupabaseFacilityService.getFacilityZones.bind(SupabaseFacilityService),
  getZonesByFacilityId: SupabaseFacilityService.getZonesByFacilityId.bind(SupabaseFacilityService),
  getZoneById: SupabaseFacilityService.getZoneById.bind(SupabaseFacilityService),
};
