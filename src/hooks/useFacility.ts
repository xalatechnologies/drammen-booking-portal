
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useFacilityStore } from "@/stores/useFacilityStore";
import { useLanguage } from "@/contexts/LanguageContext";

export function useFacility(id: number | string) {
  const facilityId = typeof id === 'string' ? parseInt(id, 10) : id;
  const { setCurrentFacility, currentFacility, setLoading, setError } = useFacilityStore();
  const { language } = useLanguage();

  console.log('useFacility - Fetching facility with ID:', facilityId);

  const {
    data: response,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['facility', facilityId, language],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('app_locations')
        .select('*')
        .eq('id', facilityId)
        .maybeSingle();

      if (error) throw new Error(error.message);
      if (!data) throw new Error('Facility not found');

      // Transform data to match expected Facility interface
      const facility = {
        id: data.id,
        name: typeof data.name === 'object' ? data.name[language] || data.name.NO || data.name.EN || 'Unknown' : data.name,
        description: typeof data.description === 'object' ? data.description[language] || data.description.NO || data.description.EN || '' : data.description,
        address: data.address,
        code: data.code,
        latitude: data.latitude,
        longitude: data.longitude,
        metadata: data.metadata || {},
        created_at: data.created_at,
        updated_at: data.updated_at,
        // Add default values for missing fields
        type: 'facility',
        area: 'unknown',
        capacity: 1,
        pricePerHour: 0,
        images: [],
        amenities: [],
        isActive: true
      };

      return {
        success: true,
        data: facility
      };
    },
    enabled: !isNaN(facilityId) && facilityId > 0,
    staleTime: 0,
    gcTime: 30 * 1000,
  });

  // Update store when data changes
  useEffect(() => {
    if (response?.success && response.data) {
      setCurrentFacility(response.data);
    } else if (response?.success === false) {
      setError('Failed to fetch facility');
      setCurrentFacility(null);
    }
  }, [response, setCurrentFacility, setError]);

  // Update loading state
  useEffect(() => {
    setLoading(isLoading);
  }, [isLoading, setLoading]);

  const facility = response?.success ? response.data : currentFacility;

  return {
    facility,
    isLoading,
    error: response?.success === false ? response.error : error,
    notFound: response?.success === false && error?.message?.includes('not found'),
    refetch,
  };
}
