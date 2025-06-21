
import { useQuery } from "@tanstack/react-query";
import { useMemo, useEffect } from "react";
import { FacilityService } from "@/services/facilityService";
import { FacilityFilters, FacilitySortOptions } from "@/types/facility";
import { PaginationParams } from "@/types/api";
import { useFacilityStore } from "@/stores/useFacilityStore";

interface UseFacilitiesParams {
  pagination: PaginationParams;
  filters?: FacilityFilters;
  sort?: FacilitySortOptions;
}

export function useFacilities({ pagination, filters, sort }: UseFacilitiesParams) {
  const { 
    setFacilities, 
    setLoading, 
    setError, 
    facilities: storedFacilities,
    totalCount 
  } = useFacilityStore();

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
      setLoading(true);
      console.log('useFacilities - Calling FacilityService.getFacilities with:', { pagination, filters, sort });
      const result = await FacilityService.getFacilities(pagination, filters, sort);
      console.log('useFacilities - FacilityService response:', result);
      return result;
    },
    staleTime: 0, // No cache - always fetch fresh data
    gcTime: 30 * 1000, // Keep in memory for 30 seconds only
  });

  // Update store when data changes
  useEffect(() => {
    if (response?.success && response.data?.data) {
      setFacilities(response.data.data, response.data.pagination?.total || 0);
    } else if (response?.success === false) {
      setError(response.error?.message || 'Failed to fetch facilities');
    }
  }, [response, setFacilities, setError]);

  // Update loading state
  useEffect(() => {
    setLoading(isLoading);
  }, [isLoading, setLoading]);

  const facilities = response?.success ? response.data?.data || [] : storedFacilities;
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
  const { pagination, setPagination } = useFacilityStore();

  const goToPage = (newPage: number) => {
    console.log('useFacilitiesPagination - Going to page:', newPage);
    setPagination({ page: newPage });
  };

  const changeLimit = (newLimit: number) => {
    console.log('useFacilitiesPagination - Changing limit to:', newLimit);
    setPagination({ limit: newLimit, page: 1 });
  };

  const nextPage = () => setPagination({ page: pagination.page + 1 });
  const prevPage = () => setPagination({ page: Math.max(1, pagination.page - 1) });

  return {
    pagination,
    page: pagination.page,
    limit: pagination.limit,
    goToPage,
    changeLimit,
    nextPage,
    prevPage,
  };
}
