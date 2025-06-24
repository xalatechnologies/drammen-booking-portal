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
      const facilities = (data || []).map((location: any) => ({
        id: location.id,
        name: typeof location.name === 'object' ? location.name[language] || location.name.NO || location.name.EN || 'Unknown' : location.name,
        description: typeof location.description === 'object' ? location.description[language] || location.description.NO || location.description.EN || '' : location.description,
        address: location.address,
        code: location.code,
        latitude: location.latitude,
        longitude: location.longitude,
        metadata: location.metadata || {},
        created_at: location.created_at,
        updated_at: location.updated_at,
        // Add default values for missing fields
        type: 'facility',
        area: 'unknown',
        capacity: 1,
        pricePerHour: 0,
        images: [],
        amenities: [],
        isActive: true
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
    error: response?.success === false ? response.error : error,
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
