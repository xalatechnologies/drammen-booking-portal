
import { useQuery } from "@tanstack/react-query";
import { OptimizedLocalizedFacilityService } from "@/services/OptimizedLocalizedFacilityService";
import { useLocalization } from "@/contexts/LocalizationContext";
import { useMemo } from "react";

export function useOptimizedFacility(id: number | string) {
  const facilityId = typeof id === 'string' ? parseInt(id, 10) : id;
  const { getLocalizedFacility } = useLocalization();

  const {
    data: response,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['optimized-facility', facilityId],
    queryFn: () => OptimizedLocalizedFacilityService.getRawFacilityById(facilityId),
    enabled: !isNaN(facilityId) && facilityId > 0,
    staleTime: 0, // No cache - always fetch fresh data
    gcTime: 30 * 1000, // Keep in memory for 30 seconds only
  });

  // Transform the facility based on current language (memoized)
  const facility = useMemo(() => {
    if (!response?.data) return null;
    return getLocalizedFacility(response.data);
  }, [response, getLocalizedFacility]);

  return {
    facility,
    isLoading,
    error: response?.error || error,
    notFound: response?.error?.includes('NOT_FOUND'),
    refetch,
  };
}
