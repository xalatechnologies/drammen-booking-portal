
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import { Facility } from '@/types/facility';
import { useTranslationStore } from '@/stores/useTranslationStore';
import { FacilityDataUtils } from '@/utils/facilityDataUtils';

export const useTranslatedFacilities = () => {
  const { language } = useLanguage();
  const { isInitialized, initializeTranslations } = useTranslationStore();

  return useQuery({
    queryKey: ['translated-facilities', language],
    queryFn: async (): Promise<Facility[]> => {
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

      // Transform facilities using utility functions
      const processedFacilities = (facilities || []).map((facility) => {
        console.log('useTranslatedFacilities - Processing facility:', facility.name);
        console.log('useTranslatedFacilities - Address fields:', {
          street: facility.address_street,
          city: facility.address_city,
          postal: facility.address_postal_code
        });
        console.log('useTranslatedFacilities - Images from DB:', facility.facility_images);

        // Use utility functions for consistent transformations
        const address = FacilityDataUtils.computeAddress(facility);
        const image = FacilityDataUtils.getImageUrl(facility.facility_images);
        const openingHours = FacilityDataUtils.transformOpeningHours(facility.facility_opening_hours);
        const zones = FacilityDataUtils.transformZones(facility.zones);
        const season = FacilityDataUtils.formatSeason(facility.season_from, facility.season_to);
        const images = FacilityDataUtils.transformImages(facility.id, facility.facility_images);
        const featuredImage = images.find(img => img.is_featured);

        console.log('useTranslatedFacilities - Computed address:', address);
        console.log('useTranslatedFacilities - Computed image:', image);

        // Return facility with proper type mapping
        const processedFacility: Facility = {
          // Direct database field mapping
          id: facility.id,
          name: facility.name || 'Unnamed Facility',
          address_street: facility.address_street || '',
          address_city: facility.address_city || '',
          address_postal_code: facility.address_postal_code || '',
          address_country: facility.address_country || 'Norway',
          type: facility.type || '',
          area: facility.area || '',
          status: facility.status || 'active',
          capacity: facility.capacity || 0,
          description: facility.description || '',
          next_available: facility.next_available,
          rating: facility.rating,
          review_count: facility.review_count || 0,
          price_per_hour: facility.price_per_hour || 450,
          has_auto_approval: facility.has_auto_approval || false,
          amenities: facility.amenities || [],
          equipment: facility.equipment || [],
          time_slot_duration: facility.time_slot_duration || 1,
          latitude: facility.latitude,
          longitude: facility.longitude,
          accessibility_features: facility.accessibility_features || [],
          allowed_booking_types: facility.allowed_booking_types || ['engangs'],
          season_from: facility.season_from,
          season_to: facility.season_to,
          contact_name: facility.contact_name,
          contact_email: facility.contact_email,
          contact_phone: facility.contact_phone,
          booking_lead_time_hours: facility.booking_lead_time_hours || 2,
          max_advance_booking_days: facility.max_advance_booking_days || 365,
          cancellation_deadline_hours: facility.cancellation_deadline_hours || 24,
          is_featured: facility.is_featured || false,
          created_at: facility.created_at,
          updated_at: facility.updated_at,
          area_sqm: facility.area_sqm,
          image_url: image,

          // Computed fields using utilities
          address,
          image,
          pricePerHour: facility.price_per_hour || 450,
          accessibility: facility.accessibility_features || [],
          suitableFor: [],
          hasAutoApproval: facility.has_auto_approval || false,
          nextAvailable: facility.next_available || 'Available now',
          openingHours,
          zones,
          featuredImage,
          images,
          timeSlotDuration: (facility.time_slot_duration || 1) as 1 | 2,
          season,
          availableTimes: []
        };

        console.log('useTranslatedFacilities - Final processed facility:', {
          id: processedFacility.id,
          name: processedFacility.name,
          address: processedFacility.address,
          image: processedFacility.image
        });
        return processedFacility;
      });

      return processedFacilities;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useTranslatedFacility = (id: number) => {
  const { language } = useLanguage();
  const { isInitialized, initializeTranslations } = useTranslationStore();

  return useQuery({
    queryKey: ['translated-facility', id, language],
    queryFn: async (): Promise<Facility | null> => {
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

      // Use utility functions for transformations
      const address = FacilityDataUtils.computeAddress(facility);
      const image = FacilityDataUtils.getImageUrl(facility.facility_images);
      const openingHours = FacilityDataUtils.transformOpeningHours(facility.facility_opening_hours);
      const zones = FacilityDataUtils.transformZones(facility.zones);
      const season = FacilityDataUtils.formatSeason(facility.season_from, facility.season_to);
      const images = FacilityDataUtils.transformImages(facility.id, facility.facility_images);
      const featuredImage = images.find(img => img.is_featured);

      const processedFacility: Facility = {
        // Direct database field mapping
        id: facility.id,
        name: facility.name || 'Unnamed Facility',
        address_street: facility.address_street || '',
        address_city: facility.address_city || '',
        address_postal_code: facility.address_postal_code || '',
        address_country: facility.address_country || 'Norway',
        type: facility.type || '',
        area: facility.area || '',
        status: facility.status || 'active',
        capacity: facility.capacity || 0,
        description: facility.description || '',
        next_available: facility.next_available,
        rating: facility.rating,
        review_count: facility.review_count || 0,
        price_per_hour: facility.price_per_hour || 450,
        has_auto_approval: facility.has_auto_approval || false,
        amenities: facility.amenities || [],
        equipment: facility.equipment || [],
        time_slot_duration: facility.time_slot_duration || 1,
        latitude: facility.latitude,
        longitude: facility.longitude,
        accessibility_features: facility.accessibility_features || [],
        allowed_booking_types: facility.allowed_booking_types || ['engangs'],
        season_from: facility.season_from,
        season_to: facility.season_to,
        contact_name: facility.contact_name,
        contact_email: facility.contact_email,
        contact_phone: facility.contact_phone,
        booking_lead_time_hours: facility.booking_lead_time_hours || 2,
        max_advance_booking_days: facility.max_advance_booking_days || 365,
        cancellation_deadline_hours: facility.cancellation_deadline_hours || 24,
        is_featured: facility.is_featured || false,
        created_at: facility.created_at,
        updated_at: facility.updated_at,
        area_sqm: facility.area_sqm,
        image_url: image,

        // Computed fields using utilities
        address,
        image,
        pricePerHour: facility.price_per_hour || 450,
        accessibility: facility.accessibility_features || [],
        suitableFor: [],
        hasAutoApproval: facility.has_auto_approval || false,
        nextAvailable: facility.next_available || 'Available now',
        openingHours,
        zones,
        featuredImage,
        images,
        timeSlotDuration: (facility.time_slot_duration || 1) as 1 | 2,
        season,
        availableTimes: []
      };

      return processedFacility;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
