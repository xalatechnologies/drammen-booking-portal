
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import { CoreFacility, FacilityView } from '@/types/translation';
import { facilityTranslationService } from '@/services/FacilityTranslationService';
import { transformDatabaseFacility } from '@/utils/facilityTransformer';

export const useTranslatedFacilities = () => {
  const { language } = useLanguage();

  return useQuery({
    queryKey: ['translated-facilities', language],
    queryFn: async (): Promise<FacilityView[]> => {
      // Get facilities from database
      const { data: facilities, error } = await supabase
        .from('facilities')
        .select('*')
        .eq('status', 'active');

      if (error) throw error;

      // Transform and translate facilities
      const facilityViews = await Promise.all(
        (facilities || []).map(async (facility) => {
          const coreFacility = transformDatabaseFacility(facility) as CoreFacility;
          return await facilityTranslationService.translateFacility(coreFacility, language);
        })
      );

      return facilityViews;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useTranslatedFacility = (id: number) => {
  const { language } = useLanguage();

  return useQuery({
    queryKey: ['translated-facility', id, language],
    queryFn: async (): Promise<FacilityView | null> => {
      if (!id) return null;

      // Get facility from database
      const { data: facility, error } = await supabase
        .from('facilities')
        .select('*')
        .eq('id', id)
        .single();

      if (error || !facility) return null;

      // Transform and translate facility
      const coreFacility = transformDatabaseFacility(facility) as CoreFacility;
      return await facilityTranslationService.translateFacility(coreFacility, language);
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
