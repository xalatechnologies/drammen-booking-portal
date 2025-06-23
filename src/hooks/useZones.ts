
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { zoneUtils } from '@/utils/supabase';

export function useZones(facilityId: number) {
  return useQuery({
    queryKey: ['zones', facilityId],
    queryFn: () => zoneUtils.getZonesByFacilityId(facilityId),
    enabled: !!facilityId,
  });
}
