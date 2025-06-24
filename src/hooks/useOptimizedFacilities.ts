
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";

export function useOptimizedFacilities() {
  const { language } = useLanguage();

  return useQuery({
    queryKey: ['optimized-facilities', language],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('app_locations')
        .select('*')
        .order('created_at', { ascending: false });

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

      return facilities;
    },
    staleTime: 30000, // Cache for 30 seconds for optimization
  });
}
