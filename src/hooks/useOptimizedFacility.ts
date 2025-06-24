
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";

export function useOptimizedFacility(facilityId: string) {
  const { language } = useLanguage();

  return useQuery({
    queryKey: ['optimized-facility', facilityId, language],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('app_locations')
        .select('*')
        .eq('id', facilityId)
        .maybeSingle();

      if (error) throw new Error(error.message);
      if (!data) return null;

      // Transform and optimize data
      return {
        id: data.id,
        name: typeof data.name === 'object' 
          ? data.name[language] || data.name['NO'] || data.name['EN'] || data.code
          : data.name || data.code,
        code: data.code,
        address: data.address,
        capacity: data.capacity,
        latitude: data.latitude,
        longitude: data.longitude,
        description: typeof data.description === 'object'
          ? data.description[language] || data.description['NO'] || data.description['EN'] || ''
          : data.description || '',
        facilities: data.facilities || [],
        metadata: data.metadata || {},
        created_at: data.created_at
      };
    },
    enabled: !!facilityId,
    staleTime: 30000,
  });
}
