
import { useQuery } from '@tanstack/react-query';
import { Zone } from '@/types/zone';
import { FacilityService } from '@/services/facilityService';

export const useZones = (facilityId?: string) => {
  return useQuery({
    queryKey: ['zones', facilityId],
    queryFn: async () => {
      if (!facilityId) return [];
      
      const response = await FacilityService.getZonesByFacilityId(facilityId);
      if (!response.success) {
        throw new Error(response.error?.message || 'Failed to fetch zones');
      }
      return response.data || [];
    },
    enabled: !!facilityId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useZone = (zoneId?: string) => {
  return useQuery({
    queryKey: ['zone', zoneId],
    queryFn: async () => {
      if (!zoneId) return null;
      
      const response = await FacilityService.getZoneById(zoneId);
      if (!response.success) {
        throw new Error(response.error?.message || 'Failed to fetch zone');
      }
      // Only access data if the response was successful
      return response.success && 'data' in response ? response.data || null : null;
    },
    enabled: !!zoneId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
