
import { useQuery } from "@tanstack/react-query";
import { FacilityService } from "@/services/facilityService";

export function useFacility(id: number | string) {
  const facilityId = typeof id === 'string' ? parseInt(id, 10) : id;

  const {
    data: response,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['facility', facilityId],
    queryFn: () => FacilityService.getFacilityById(facilityId),
    enabled: !isNaN(facilityId) && facilityId > 0,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  return {
    facility: response?.success ? response.data : null,
    isLoading,
    error: response?.success === false ? response.error : error,
    notFound: response?.success === false && response.error?.code === 'NOT_FOUND',
    refetch,
  };
}
