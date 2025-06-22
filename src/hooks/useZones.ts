
import { useQuery } from '@tanstack/react-query';
import { Zone } from '@/types/zone';
import { FacilityService } from '@/services/FacilityService';

export const useZones = (facilityId?: string) => {
  console.log('useZones - Fetching zones for facility ID:', facilityId);

  return useQuery({
    queryKey: ['zones', facilityId],
    queryFn: async () => {
      if (!facilityId) {
        console.log('useZones - No facility ID provided, returning empty array');
        return [];
      }
      
      console.log('useZones - Calling FacilityService.getZonesByFacilityId with:', facilityId);
      const response = await FacilityService.getZonesByFacilityId(facilityId);
      console.log('useZones - FacilityService response:', response);
      
      if (!response.success) {
        console.warn('useZones - Failed to fetch zones:', response.error);
        throw new Error(response.error?.message || 'Failed to fetch zones');
      }
      
      const zones = response.data || [];
      console.log('useZones - Final zones data:', zones);
      return zones;
    },
    enabled: !!facilityId,
    staleTime: 0, // No cache - always fetch fresh data
    gcTime: 30 * 1000, // Keep in memory for 30 seconds only
  });
};

export const useZone = (zoneId?: string) => {
  console.log('useZone - Fetching zone with ID:', zoneId);

  return useQuery({
    queryKey: ['zone', zoneId],
    queryFn: async () => {
      if (!zoneId) {
        console.log('useZone - No zone ID provided, returning null');
        return null;
      }
      
      console.log('useZone - Calling FacilityService.getZoneById with:', zoneId);
      const response = await FacilityService.getZoneById(zoneId);
      console.log('useZone - FacilityService response:', response);
      
      if (!response.success) {
        console.warn('useZone - Failed to fetch zone:', response.error);
        throw new Error(response.error?.message || 'Failed to fetch zone');
      }
      
      const zone = response.success && 'data' in response ? response.data || null : null;
      console.log('useZone - Final zone data:', zone);
      return zone;
    },
    enabled: !!zoneId,
    staleTime: 0, // No cache - always fetch fresh data
    gcTime: 30 * 1000, // Keep in memory for 30 seconds only
  });
};
