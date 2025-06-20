
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

  const {
    data: response,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey,
    queryFn: () => FacilityService.getFacilities(pagination, filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return {
    facilities: response?.success ? response.data?.data || [] : [],
    pagination: response?.success ? response.data?.pagination : null,
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
    setPage(newPage);
  };

  const changeLimit = (newLimit: number) => {
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
