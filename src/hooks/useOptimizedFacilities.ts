
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { FacilityFilters } from "@/types/facility";
import { PaginationParams } from "@/types/api";

interface UseOptimizedFacilitiesParams {
  pagination?: PaginationParams;
  filters?: FacilityFilters;
}

export function useOptimizedFacilities(params?: UseOptimizedFacilitiesParams) {
  const { language } = useLanguage();
  const { pagination, filters } = params || {};

  return useQuery({
    queryKey: ['optimized-facilities', language, pagination, filters],
    queryFn: async () => {
      let query = supabase
        .from('app_locations')
        .select('*')
        .order('created_at', { ascending: false });

      // Apply filters
      if (filters?.searchTerm) {
        query = query.or(`name->>NO.ilike.%${filters.searchTerm}%,name->>EN.ilike.%${filters.searchTerm}%,code.ilike.%${filters.searchTerm}%`);
      }

      if (filters?.location) {
        query = query.ilike('address', `%${filters.location}%`);
      }

      if (filters?.facilityType) {
        query = query.contains('facilities', [filters.facilityType]);
      }

      // Apply pagination
      if (pagination) {
        const from = (pagination.page - 1) * pagination.limit;
        const to = from + pagination.limit - 1;
        query = query.range(from, to);
      }

      const { data, error } = await query;

      if (error) throw new Error(error.message);

      // Transform and optimize data to match Facility interface
      const facilities = (data || []).map((location: any) => ({
        id: location.id,
        name: typeof location.name === 'object' 
          ? location.name[language] || location.name['NO'] || location.name['EN'] || location.code
          : location.name || location.code,
        code: location.code,
        address_street: location.address || '',
        address_city: '',
        address_postal_code: '',
        address_country: 'Norway',
        type: location.location_type || 'facility',
        status: 'active' as const,
        image_url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&auto=format&fit=crop',
        capacity: location.capacity || 0,
        area: location.code || 'General',
        description: typeof location.description === 'object'
          ? location.description[language] || location.description['NO'] || location.description['EN'] || ''
          : location.description || '',
        next_available: 'Available now',
        rating: null,
        review_count: null,
        price_per_hour: 450,
        has_auto_approval: true,
        amenities: location.facilities || [],
        time_slot_duration: 1,
        latitude: location.latitude,
        longitude: location.longitude,
        accessibility_features: [],
        equipment: [],
        allowed_booking_types: ['engangs', 'fastlan'] as const,
        season_from: null,
        season_to: null,
        contact_name: null,
        contact_email: location.contact_email,
        contact_phone: location.contact_phone,
        booking_lead_time_hours: 24,
        max_advance_booking_days: 365,
        cancellation_deadline_hours: 24,
        is_featured: false,
        created_at: location.created_at,
        updated_at: location.updated_at || location.created_at,
        area_sqm: null,
        // Computed fields for backwards compatibility
        address: location.address || '',
        image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&auto=format&fit=crop',
        pricePerHour: 450,
        accessibility: [],
        suitableFor: ['General Use'],
        hasAutoApproval: true,
        nextAvailable: 'Available now',
        openingHours: [],
        zones: [],
        timeSlotDuration: 1 as 1 | 2,
        season: {
          from: '',
          to: ''
        }
      }));

      return facilities;
    },
    staleTime: 30000,
  });
}
