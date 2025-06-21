
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { FacilityService } from "@/services/facilityService";
import { useFacilityStore } from "@/stores/useFacilityStore";

export function useFacility(id: number | string) {
  const facilityId = typeof id === 'string' ? parseInt(id, 10) : id;
  const { setCurrentFacility, currentFacility, setLoading, setError } = useFacilityStore();

  console.log('useFacility - Fetching facility with ID:', facilityId);

  const {
    data: response,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['facility', facilityId],
    queryFn: async () => {
      setLoading(true);
      console.log('useFacility - Calling FacilityService.getFacilityById with ID:', facilityId);
      const result = await FacilityService.getFacilityById(facilityId.toString());
      console.log('useFacility - FacilityService response:', result);
      return result;
    },
    enabled: !isNaN(facilityId) && facilityId > 0,
    staleTime: 0, // No cache - always fetch fresh data
    gcTime: 30 * 1000, // Keep in memory for 30 seconds only
  });

  // Update store when data changes
  useEffect(() => {
    if (response?.success && response.data) {
      setCurrentFacility(response.data);
    } else if (response?.success === false) {
      setError(response.error?.message || 'Failed to fetch facility');
      setCurrentFacility(null);
    }
  }, [response, setCurrentFacility, setError]);

  // Update loading state
  useEffect(() => {
    setLoading(isLoading);
  }, [isLoading, setLoading]);

  const facility = response?.success ? response.data : currentFacility;
  console.log('useFacility - Final facility data:', facility);

  return {
    facility,
    isLoading,
    error: response?.success === false ? response.error : error,
    notFound: response?.success === false && response.error?.code === 'NOT_FOUND',
    refetch,
  };
}
