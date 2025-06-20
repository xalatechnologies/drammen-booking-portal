
import { useQuery } from "@tanstack/react-query";
import { FacilityService } from "@/services/facilityService";

export function useFacility(id: number | string) {
  const facilityId = typeof id === 'string' ? parseInt(id, 10) : id;

  console.log('useFacility - Fetching facility with ID:', facilityId);

  const {
    data: response,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['facility', facilityId],
    queryFn: async () => {
      console.log('useFacility - Calling FacilityService.getFacilityById with ID:', facilityId);
      const result = await FacilityService.getFacilityById(facilityId.toString());
      console.log('useFacility - FacilityService response:', result);
      return result;
    },
    enabled: !isNaN(facilityId) && facilityId > 0,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  const facility = response?.success ? response.data : null;
  console.log('useFacility - Final facility data:', facility);

  return {
    facility,
    isLoading,
    error: response?.success === false ? response.error : error,
    notFound: response?.success === false && response.error?.code === 'NOT_FOUND',
    refetch,
  };
}
