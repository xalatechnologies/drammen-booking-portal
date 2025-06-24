
import { useQuery } from "@tanstack/react-query";
import { useFacilities } from "./useFacilities";
import { FacilityFilters, FacilitySortOptions } from "@/types/facility";
import { PaginationParams } from "@/types/api";

interface UseOptimizedFacilitiesParams {
  pagination: PaginationParams;
  filters?: FacilityFilters;
  sort?: FacilitySortOptions;
}

export function useOptimizedFacilities({
  pagination,
  filters,
  sort
}: UseOptimizedFacilitiesParams) {
  // Use the existing useFacilities hook as a fallback
  const { data: allFacilities = [], isLoading, error } = useFacilities();

  const {
    data: response,
    isLoading: isPaginationLoading,
    error: paginationError,
    refetch
  } = useQuery({
    queryKey: ['optimizedFacilities', pagination, filters, sort],
    queryFn: async () => {
      // Simple client-side pagination and filtering for now
      let filteredFacilities = allFacilities;

      // Apply filters
      if (filters?.facilityType && filters.facilityType !== 'all') {
        filteredFacilities = filteredFacilities.filter(f => f.type === filters.facilityType);
      }

      if (filters?.searchTerm) {
        const searchTerm = filters.searchTerm.toLowerCase();
        filteredFacilities = filteredFacilities.filter(f => 
          f.name.toLowerCase().includes(searchTerm) ||
          f.description?.toLowerCase().includes(searchTerm)
        );
      }

      // Apply sorting
      if (sort?.field) {
        filteredFacilities.sort((a, b) => {
          const aVal = a[sort.field as keyof typeof a];
          const bVal = b[sort.field as keyof typeof b];
          const multiplier = sort.direction === 'desc' ? -1 : 1;
          
          if (typeof aVal === 'string' && typeof bVal === 'string') {
            return aVal.localeCompare(bVal) * multiplier;
          }
          if (typeof aVal === 'number' && typeof bVal === 'number') {
            return (aVal - bVal) * multiplier;
          }
          return 0;
        });
      }

      // Apply pagination
      const total = filteredFacilities.length;
      const start = (pagination.page - 1) * pagination.limit;
      const paginatedFacilities = filteredFacilities.slice(start, start + pagination.limit);

      return {
        data: paginatedFacilities,
        pagination: {
          page: pagination.page,
          limit: pagination.limit,
          total,
          totalPages: Math.ceil(total / pagination.limit),
          hasNext: pagination.page < Math.ceil(total / pagination.limit),
          hasPrev: pagination.page > 1
        }
      };
    },
    enabled: allFacilities.length > 0,
    staleTime: 5 * 60 * 1000
  });

  const finalLoading = isLoading || isPaginationLoading;
  const finalError = error || paginationError;

  return {
    facilities: response?.data || [],
    pagination: response?.pagination,
    isLoading: finalLoading,
    error: finalError,
    refetch,
  };
}
