
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useSimpleQuery<T = any>(
  tableName: string,
  facilityId?: string
) {
  return useQuery({
    queryKey: [tableName, facilityId],
    queryFn: async () => {
      let query = supabase.from(tableName).select('*');
      
      if (facilityId && tableName === 'app_bookings') {
        query = query.eq('location_id', facilityId);
      }
      
      if (facilityId && tableName === 'app_availability_rules') {
        query = query.eq('location_id', facilityId);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      return { data, error: null };
    },
    enabled: true,
    staleTime: 0,
  });
}
