import { useUnifiedFacilities, useUnifiedFacility } from './useUnifiedFacilities';
import { useQuery } from '@tanstack/react-query';

// Re-export types for backward compatibility
export type { UnifiedFacility as Facility } from './useUnifiedFacilities';

// Public facilities hook - only shows published facilities
export const useFacilities = () => {
  return useUnifiedFacilities(false); // includeUnpublished = false for public view
};

// Public single facility hook
export const useFacility = (id: string) => {
  return useUnifiedFacility(id);
};

// Keep existing pagination hook for backward compatibility
export const useFacilitiesPagination = (page: number = 1, limit: number = 12) => {
  const { data: facilities = [] } = useFacilities();
  
  return useQuery({
    queryKey: ['facilities-paginated', page, limit, facilities.length],
    queryFn: async () => {
      const total = facilities.length;
      const start = (page - 1) * limit;
      const paginatedFacilities = facilities.slice(start, start + limit);
      
      return {
        data: paginatedFacilities,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1
        }
      };
    },
    enabled: facilities.length > 0,
    staleTime: 5 * 60 * 1000
  });
};
