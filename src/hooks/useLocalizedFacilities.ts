
import { useQuery } from "@tanstack/react-query";
import { LocalizedFacilityService } from "@/services/LocalizedFacilityService";
import { FacilityFilters, FacilitySortOptions } from "@/types/facility";
import { PaginationParams } from "@/types/api";
import { useLocalizedServices } from "./useLocalizedServices";
import { useLanguage } from "@/contexts/LanguageContext";

interface UseFacilitiesParams {
  pagination: PaginationParams;
  filters?: FacilityFilters;
  sort?: FacilitySortOptions;
}

export function useLocalizedFacilities({
  pagination,
  filters,
  sort
}: UseFacilitiesParams) {
  // Ensure services are language-aware
  useLocalizedServices();
  
  // Get current language to include in query key
  const { language } = useLanguage();

  const {
    data: response,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['localizedFacilities', language, pagination, filters, sort],
    queryFn: () => LocalizedFacilityService.getFacilities(pagination, filters, sort),
    staleTime: 0, // No cache - always fetch fresh data
    gcTime: 30 * 1000, // Keep in memory for 30 seconds only
  });

  const facilities = response?.success ? response.data.data : [];
  const paginationInfo = response?.success ? {
    page: response.data.pagination.page,
    limit: response.data.pagination.limit,
    total: response.data.pagination.total,
    totalPages: response.data.pagination.totalPages,
    hasNext: response.data.pagination.hasNext,
    hasPrev: response.data.pagination.hasPrev
  } : null;

  return {
    facilities,
    pagination: paginationInfo,
    isLoading,
    error: response?.success === false ? response.error : error,
    refetch,
  };
}
