
import { useQuery } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { FacilityService } from "@/services/facilityService";
import { FacilityFilters, FacilitySortOptions } from "@/types/facility";
import { PaginationParams } from "@/types/api";

interface UseFacilitiesParams {
  pagination: PaginationParams;
  filters?: FacilityFilters;
  sort?: FacilitySortOptions;
}

export function useFacilities({ pagination, filters, sort }: UseFacilitiesParams) {
  const queryKey = useMemo(() => [
    'facilities',
    pagination,
    filters,
    sort
  ], [pagination, filters, sort]);

  console.log('useFacilities - Query params:', { pagination, filters, sort });

  const {
    data: response,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey,
    queryFn: async () => {
      console.log('useFacilities - Calling FacilityService.getFacilities with:', { pagination, filters, sort });
      const result = await FacilityService.getFacilities(pagination, filters, sort);
      console.log('useFacilities - FacilityService response:', result);
      return result;
    },
    staleTime: 0, // No cache - always fetch fresh data
    gcTime: 30 * 1000, // Keep in memory for 30 seconds only
  });

  const facilities = response?.success ? response.data?.data || [] : [];
  const paginationInfo = response?.success ? response.data?.pagination : null;

  console.log('useFacilities - Final facilities:', facilities);
  console.log('useFacilities - Pagination info:', paginationInfo);

  return {
    facilities,
    pagination: paginationInfo,
    isLoading,
    error: response?.success === false ? response.error : error,
    refetch,
  };
}

export function useFacilitiesPagination(initialPage = 1, initialLimit = 6) {
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);

  const pagination: PaginationParams = { page, limit };

  const goToPage = (newPage: number) => {
    console.log('useFacilitiesPagination - Going to page:', newPage);
    setPage(newPage);
  };

  const changeLimit = (newLimit: number) => {
    console.log('useFacilitiesPagination - Changing limit to:', newLimit);
    setLimit(newLimit);
    setPage(1); // Reset to first page when changing limit
  };

  const nextPage = () => setPage(prev => prev + 1);
  const prevPage = () => setPage(prev => Math.max(1, prev - 1));

  return {
    pagination,
    page,
    limit,
    goToPage,
    changeLimit,
    nextPage,
    prevPage,
  };
}
