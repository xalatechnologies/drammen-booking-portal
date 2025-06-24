
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useFacilityStore } from "@/stores/useFacilityStore";
import { useLanguage } from "@/contexts/LanguageContext";

export function useFacility(id: number | string) {
  const facilityId = typeof id === 'string' ? id : id.toString();
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

      // Safely extract localized strings
      const getName = (nameObj: any) => {
        if (typeof nameObj === 'string') return nameObj;
        if (typeof nameObj === 'object' && nameObj) {
          return nameObj[language] || nameObj['NO'] || nameObj['EN'] || 'Unknown';
        }
        return 'Unknown';
      };

      const getDescription = (descObj: any) => {
        if (typeof descObj === 'string') return descObj;
        if (typeof descObj === 'object' && descObj) {
          return descObj[language] || descObj['NO'] || descObj['EN'] || '';
        }
        return '';
      };

      // Transform data to match expected Facility interface
      const facility = {
        id: parseInt(facilityId), // Convert back to number for the interface
        name: getName(data.name),
        description: getDescription(data.description),
        address: data.address,
        address_street: data.address || '',
        address_city: 'Unknown City',
        address_postal_code: '0000',
        address_country: 'NO',
        code: data.code,
        latitude: data.latitude,
        longitude: data.longitude,
        metadata: data.metadata || {},
        created_at: data.created_at,
        updated_at: data.updated_at,
        // Required fields from Facility interface
        type: 'facility',
        status: 'active' as const,
        image_url: null,
        capacity: data.capacity || 30,
        area: 'unknown',
        next_available: null,
        rating: null,
        review_count: null,
        price_per_hour: 450,
        has_auto_approval: false,
        amenities: data.facilities || [],
        time_slot_duration: 60,
        accessibility_features: [],
        equipment: data.facilities || [],
        allowed_booking_types: ['engangs'] as const,
        season_from: null,
        season_to: null,
        contact_name: null,
        contact_email: data.contact_email,
        contact_phone: data.contact_phone,
        booking_lead_time_hours: 24,
        max_advance_booking_days: 90,
        cancellation_deadline_hours: 48,
        is_featured: false,
        area_sqm: null,
        // Computed fields for backwards compatibility
        image: null,
        pricePerHour: 450,
        accessibility: [],
        suitableFor: [],
        hasAutoApproval: false,
        nextAvailable: 'Available now',
        openingHours: [],
        zones: [],
        timeSlotDuration: 1 as const,
        season: {
          from: '',
          to: ''
        },
        images: [],
        availableTimes: []
      };

      return {
        success: true,
        data: facility
      };
    },
    enabled: !!facilityId,
    staleTime: 0,
    gcTime: 30 * 1000,
  });

  // Update store when data changes
  useEffect(() => {
    if (response?.success && response.data) {
      setCurrentFacility(response.data);
    } else if (response && !response.success) {
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
    error: error?.message || null,
    notFound: error?.message?.includes('not found'),
    refetch,
  };
}
