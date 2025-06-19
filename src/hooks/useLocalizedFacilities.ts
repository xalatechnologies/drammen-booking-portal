
import { useQuery } from "@tanstack/react-query";
import { LocalizedFacilityService } from "@/services/LocalizedFacilityService";
import { FacilityFilters, FacilitySortOptions } from "@/types/facility";
import { PaginationParams } from "@/types/api";
import { useLocalizedServices } from "./useLocalizedServices";

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

  const {
    data: response,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['localizedFacilities', pagination, filters, sort],
    queryFn: () => LocalizedFacilityService.getFacilities(pagination, filters, sort),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const facilities = response?.success ? response.data.items : [];
  const paginationInfo = response?.success ? {
    page: response.data.page,
    limit: response.data.limit,
    total: response.data.total,
    totalPages: response.data.totalPages,
    hasNext: response.data.hasNext,
    hasPrev: response.data.hasPrev
  } : null;

  return {
    facilities,
    pagination: paginationInfo,
    isLoading,
    error: response?.success === false ? response.error : error,
    refetch,
  };
}
