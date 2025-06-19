
import { useQuery } from "@tanstack/react-query";
import { LocalizedFacilityService } from "@/services/LocalizedFacilityService";
import { FacilityFilters, FacilitySortOptions } from "@/types/facility";
import { PaginationParams } from "@/types/api";
import { useLocalization } from "@/contexts/LocalizationContext";
import { useMemo } from "react";

interface UseFacilitiesParams {
  pagination: PaginationParams;
  filters?: FacilityFilters;
  sort?: FacilitySortOptions;
}

export function useOptimizedFacilities({
  pagination,
  filters,
  sort
}: UseFacilitiesParams) {
  const { getLocalizedFacility, language } = useLocalization();

  // Fetch the raw localized data (language-agnostic query key)
  const {
    data: response,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['facilities', pagination, filters, sort],
    queryFn: () => LocalizedFacilityService.getRawFacilities(pagination, filters, sort),
    staleTime: 10 * 60 * 1000, // 10 minutes - longer cache since we handle language client-side
  });

  // Transform the data based on current language (memoized)
  const facilities = useMemo(() => {
    if (!response?.success || !response.data.data) return [];
    return response.data.data.map(facility => getLocalizedFacility(facility));
  }, [response, getLocalizedFacility]);

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
