
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import { CoreFacility, FacilityView } from '@/types/translation';
import { facilityTranslationService } from '@/services/FacilityTranslationService';
import { useTranslationStore } from '@/stores/useTranslationStore';

// Simple transformer function to replace the deleted file
const transformDatabaseFacility = (facility: any): CoreFacility => {
  return {
    ...facility,
    address: `${facility.address_street || ''}, ${facility.address_city || ''}`.replace(/^,\s*/, '').replace(/,\s*$/, ''),
    image: facility.image_url || "/lovable-uploads/13aee1f6-e9d9-474b-9ed7-c656d703d19b.png",
    pricePerHour: facility.price_per_hour || 450,
    accessibility: facility.accessibility_features || [],
    suitableFor: [],
    hasAutoApproval: facility.has_auto_approval || false,
    nextAvailable: facility.next_available || "Not available",
    openingHours: [],
    zones: [],
    availableTimes: []
  };
};

export const useTranslatedFacilities = () => {
  const { language } = useLanguage();
  const { isInitialized, initializeTranslations } = useTranslationStore();

  return useQuery({
    queryKey: ['translated-facilities', language],
    queryFn: async (): Promise<FacilityView[]> => {
      // Ensure translation service is initialized
      if (!isInitialized) {
        await initializeTranslations();
      }

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
  const { isInitialized, initializeTranslations } = useTranslationStore();

  return useQuery({
    queryKey: ['translated-facility', id, language],
    queryFn: async (): Promise<FacilityView | null> => {
      if (!id) return null;

      // Ensure translation service is initialized
      if (!isInitialized) {
        await initializeTranslations();
      }

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
