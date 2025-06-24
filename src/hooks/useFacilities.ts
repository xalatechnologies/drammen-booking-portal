
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { FacilityFilters, FacilitySortOptions } from "@/types/facility";
import { PaginationParams } from "@/types/api";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState, useCallback } from "react";

interface UseFacilitiesParams {
  pagination: PaginationParams;
  filters?: FacilityFilters;
  sort?: FacilitySortOptions;
}

export function useFacilities({
  pagination,
  filters,
  sort
}: UseFacilitiesParams) {
  const { language } = useLanguage();

  const {
    data: response,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['facilities', language, pagination, filters, sort],
    queryFn: async () => {
      let query = supabase
        .from('app_locations')
        .select('*')
        .order('created_at', { ascending: false });

      // Apply pagination
      const from = (pagination.page - 1) * pagination.limit;
      const to = from + pagination.limit - 1;
      query = query.range(from, to);

      const { data, error, count } = await query;
      
      if (error) throw new Error(error.message);

      // Transform data to match expected Facility interface
      const facilities = (data || []).map((location: any, index: number) => ({
        id: index + 1, // Generate numeric ID for interface compatibility
        name: typeof location.name === 'object' ? location.name[language] || location.name.NO || location.name.EN || 'Unknown' : location.name,
        description: typeof location.description === 'object' ? location.description[language] || location.description.NO || location.description.EN || '' : location.description,
        address: location.address,
        address_street: location.address || '',
        address_city: 'Unknown City',
        address_postal_code: '0000',
        address_country: 'NO',
        code: location.code,
        latitude: location.latitude,
        longitude: location.longitude,
        metadata: location.metadata || {},
        created_at: location.created_at,
        updated_at: location.updated_at,
        // Required fields from Facility interface
        type: 'facility',
        status: 'active' as const,
        image_url: null,
        capacity: location.capacity || 30,
        area: 'unknown',
        next_available: null,
        rating: null,
        review_count: null,
        price_per_hour: 450,
        has_auto_approval: false,
        amenities: location.facilities || [],
        time_slot_duration: 60,
        accessibility_features: [],
        equipment: location.facilities || [],
        allowed_booking_types: ['engangs'] as ('engangs' | 'fastlan' | 'rammetid' | 'strotimer')[],
        season_from: null,
        season_to: null,
        contact_name: null,
        contact_email: location.contact_email,
        contact_phone: location.contact_phone,
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
      }));

      return {
        success: true,
        data: {
          data: facilities,
          pagination: {
            page: pagination.page,
            limit: pagination.limit,
            total: count || 0,
            totalPages: Math.ceil((count || 0) / pagination.limit),
            hasNext: to < (count || 0) - 1,
            hasPrev: pagination.page > 1
          }
        }
      };
    },
    staleTime: 0,
    gcTime: 30 * 1000,
  });

  const facilities = response?.success ? response.data?.data || [] : [];
  const paginationInfo = response?.success ? response.data?.pagination : null;

  return {
    facilities,
    pagination: paginationInfo,
    isLoading,
    error: error?.message || null,
    refetch,
  };
}

export function useFacilitiesPagination(initialPage: number, initialLimit: number) {
  const [page, setPage] = useState(initialPage);
  const [limit] = useState(initialLimit);

  const nextPage = useCallback(() => {
    setPage(prev => prev + 1);
  }, []);

  const goToPage = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  return {
    pagination: { page, limit },
    nextPage,
    goToPage
  };
}
