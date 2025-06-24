
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";

export function useLocalizedFacilities() {
  const { language } = useLanguage();

  return useQuery({
    queryKey: ['localized-facilities', language],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('app_locations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw new Error(error.message);

      // Transform data to include localized names
      const facilities = (data || []).map((location: any) => ({
        ...location,
        displayName: typeof location.name === 'object' 
          ? location.name[language] || location.name['NO'] || location.name['EN'] || location.code
          : location.name || location.code
      }));

      return facilities;
    },
    staleTime: 0,
  });
}
