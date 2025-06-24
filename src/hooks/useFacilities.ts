
import { useQuery } from "@tanstack/react-query";
import { FacilityService } from "@/services/facilityService";
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
  // Get current language to include in query key
  const { language } = useLanguage();

  const {
    data: response,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['facilities', language, pagination, filters, sort],
    queryFn: () => FacilityService.getFacilities(pagination, filters, sort),
    staleTime: 0, // No cache - always fetch fresh data
    gcTime: 30 * 1000, // Keep in memory for 30 seconds only
  });

  // Handle response properly - check if it's a direct array or wrapped response
  const facilities = response?.success ? response.data?.data || [] : [];
  const paginationInfo = response?.success ? {
    page: response.data?.pagination?.page || pagination.page,
    limit: response.data?.pagination?.limit || pagination.limit,
    total: response.data?.pagination?.total || 0,
    totalPages: response.data?.pagination?.totalPages || 0,
    hasNext: response.data?.pagination?.hasNext || false,
    hasPrev: response.data?.pagination?.hasPrev || false
  } : null;

  return {
    facilities: facilities || [],
    pagination: paginationInfo,
    isLoading,
    error: response?.success === false ? response.error : error,
    refetch,
  };
}

// Export pagination helper function with proper navigation methods
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
