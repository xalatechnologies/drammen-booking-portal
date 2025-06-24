
import { useQuery } from "@tanstack/react-query";
import { supabase } from '@/integrations/supabase/client';
import { transformFacilityForUI } from '@/utils/facilityTransforms';

export function useFacility(id: number | string) {
  const facilityId = typeof id === 'string' ? parseInt(id, 10) : id;

  console.log('useFacility - Fetching facility with ID:', facilityId);

  const {
    data: facility,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['facility', facilityId],
    queryFn: async () => {
      console.log('useFacility - Calling Supabase with ID:', facilityId);
      
      const { data, error } = await supabase
        .from('facilities')
        .select(`
          *,
          facility_opening_hours(*),
          facility_images(*)
        `)
        .eq('id', facilityId)
        .single();
      
      if (error) {
        console.error('useFacility - Supabase error:', error);
        throw error;
      }
      
      console.log('useFacility - Raw facility data:', data);
      const transformed = transformFacilityForUI(data);
      console.log('useFacility - Transformed facility data:', transformed);
      
      return transformed;
    },
    enabled: !isNaN(facilityId) && facilityId > 0,
    staleTime: 0,
    gcTime: 30 * 1000,
  });

  return {
    facility,
    isLoading,
    error,
    notFound: error?.message?.includes('No rows'),
    refetch,
  };
}
