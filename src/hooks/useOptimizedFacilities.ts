
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
    staleTime: 0, // No cache - always fetch fresh data
    gcTime: 30 * 1000, // Keep in memory for 30 seconds only
  });

  // Transform the data based on current language (memoized)
  const facilities = useMemo(() => {
    if (!response?.success || !response.data.data) return [];
    const transformed = response.data.data.map(facility => getLocalizedFacility(facility));
    
    // Debug logging to see actual facility types and areas
    console.log("useOptimizedFacilities - Sample facility types:", 
      transformed.slice(0, 3).map(f => ({ id: f.id, type: f.type, area: f.area }))
    );
    console.log("useOptimizedFacilities - Applied filters:", filters);
    
    return transformed;
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
