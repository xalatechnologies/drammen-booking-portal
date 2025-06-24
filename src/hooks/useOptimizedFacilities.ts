
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { FacilityFilters } from "@/types/facility";
import { PaginationParams } from "@/types/api";

interface UseOptimizedFacilitiesParams {
  pagination?: PaginationParams;
  filters?: FacilityFilters;
}

export function useOptimizedFacilities(params?: UseOptimizedFacilitiesParams) {
  const { language } = useLanguage();
  const { pagination, filters } = params || {};

  return useQuery({
    queryKey: ['optimized-facilities', language, pagination, filters],
    queryFn: async () => {
      let query = supabase
        .from('app_locations')
        .select('*')
        .order('created_at', { ascending: false });

      // Apply filters
      if (filters?.searchTerm) {
        query = query.or(`name->>NO.ilike.%${filters.searchTerm}%,name->>EN.ilike.%${filters.searchTerm}%,code.ilike.%${filters.searchTerm}%`);
      }

      if (filters?.location) {
        query = query.ilike('address', `%${filters.location}%`);
      }

      if (filters?.facilityType) {
        query = query.contains('facilities', [filters.facilityType]);
      }

      // Apply pagination
      if (pagination) {
        const from = (pagination.page - 1) * pagination.limit;
        const to = from + pagination.limit - 1;
        query = query.range(from, to);
      }

      const { data, error } = await query;

      if (error) throw new Error(error.message);

      // Transform and optimize data
      const facilities = (data || []).map((location: any) => ({
        id: location.id,
        name: typeof location.name === 'object' 
          ? location.name[language] || location.name['NO'] || location.name['EN'] || location.code
          : location.name || location.code,
        code: location.code,
        address: location.address,
        capacity: location.capacity,
        latitude: location.latitude,
        longitude: location.longitude,
        created_at: location.created_at
      }));

      return { facilities, isLoading: false, error: null };
    },
    staleTime: 30000, // Cache for 30 seconds for optimization
  });
}
