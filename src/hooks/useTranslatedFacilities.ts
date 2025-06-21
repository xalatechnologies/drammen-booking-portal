import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import { FacilityView } from '@/types/translation';
import { facilityTranslationService } from '@/services/FacilityTranslationService';
import { useTranslationStore } from '@/stores/useTranslationStore';
import { Facility } from '@/types/facility';

// Convert Facility to FacilityView (they should be compatible now)
const facilityToFacilityView = (facility: Facility): FacilityView => {
  return {
    ...facility,
    // Ensure all required FacilityView fields are present
    name: facility.name,
    description: facility.description || '',
    suitableFor: facility.suitableFor || [],
    equipment: facility.equipment || [],
    amenities: facility.amenities || [],
    timeSlotDuration: facility.timeSlotDuration,
    season: facility.season
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

      // Get facilities from database with all fields and relations
      const { data: facilities, error } = await supabase
        .from('facilities')
        .select(`
          *,
          facility_opening_hours(day_of_week, open_time, close_time, is_open),
          zones(id, name, type, capacity, bookable_independently),
          facility_images(id, image_url, alt_text, is_featured, display_order),
          facility_translations(language_code, name, description, short_description, rules, directions)
        `)
        .eq('status', 'active');

      if (error) throw error;

      console.log('useTranslatedFacilities - Raw facilities from DB:', facilities);

      // Convert to FacilityView format with all the database data preserved
      const facilityViews = (facilities || []).map((facility) => {
        // Create address from database fields
        const addressParts = [
          facility.address_street,
          facility.address_city,
          facility.address_postal_code
        ].filter(part => part && part.trim() !== '');
        
        const address = addressParts.length > 0 ? addressParts.join(', ') : '';

        // Get image from facility_images or fallback
        let image = 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&auto=format&fit=crop';
        
        if (facility.facility_images && Array.isArray(facility.facility_images) && facility.facility_images.length > 0) {
          const featuredImage = facility.facility_images.find(img => img.is_featured);
          const imageToUse = featuredImage || facility.facility_images[0];
          if (imageToUse?.image_url) {
            image = imageToUse.image_url;
          }
        }

        const facilityView: FacilityView = {
          // Keep all database fields exactly as they are
          ...facility,
          // Add computed fields
          address,
          image,
          image_url: image,
          pricePerHour: facility.price_per_hour || 450,
          accessibility: facility.accessibility_features || [],
          suitableFor: [],
          hasAutoApproval: facility.has_auto_approval || false,
          nextAvailable: facility.next_available || 'Available now',
          openingHours: facility.facility_opening_hours || [],
          zones: facility.zones || [],
          timeSlotDuration: (facility.time_slot_duration || 1) as 1 | 2,
          season: {
            from: facility.season_from || '2024-01-01',
            to: facility.season_to || '2024-12-31'
          },
          availableTimes: [],
          // Translation fields (will be populated by translation service if needed)
          name: facility.name,
          description: facility.description || '',
          equipment: facility.equipment || [],
          amenities: facility.amenities || []
        };

        console.log('useTranslatedFacilities - Converted facility:', facilityView);
        return facilityView;
      });

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
        .select(`
          *,
          facility_opening_hours(day_of_week, open_time, close_time, is_open),
          zones(id, name, type, capacity, bookable_independently),
          facility_images(id, image_url, alt_text, is_featured, display_order),
          facility_translations(language_code, name, description, short_description, rules, directions)
        `)
        .eq('id', id)
        .single();

      if (error || !facility) return null;

      // Create address from database fields
      const addressParts = [
        facility.address_street,
        facility.address_city,
        facility.address_postal_code
      ].filter(part => part && part.trim() !== '');
      
      const address = addressParts.length > 0 ? addressParts.join(', ') : '';

      // Get image from facility_images or fallback
      let image = 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&auto=format&fit=crop';
      
      if (facility.facility_images && Array.isArray(facility.facility_images) && facility.facility_images.length > 0) {
        const featuredImage = facility.facility_images.find(img => img.is_featured);
        const imageToUse = featuredImage || facility.facility_images[0];
        if (imageToUse?.image_url) {
          image = imageToUse.image_url;
        }
      }

      const facilityView: FacilityView = {
        // Keep all database fields exactly as they are
        ...facility,
        // Add computed fields
        address,
        image,
        image_url: image,
        pricePerHour: facility.price_per_hour || 450,
        accessibility: facility.accessibility_features || [],
        suitableFor: [],
        hasAutoApproval: facility.has_auto_approval || false,
        nextAvailable: facility.next_available || 'Available now',
        openingHours: facility.facility_opening_hours || [],
        zones: facility.zones || [],
        timeSlotDuration: (facility.time_slot_duration || 1) as 1 | 2,
        season: {
          from: facility.season_from || '2024-01-01',
          to: facility.season_to || '2024-12-31'
        },
        availableTimes: [],
        // Translation fields
        name: facility.name,
        description: facility.description || '',
        equipment: facility.equipment || [],
        amenities: facility.amenities || []
      };

      return facilityView;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
