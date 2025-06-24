
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface UnifiedFacility {
  id: string;
  name: string;
  type: string;
  area: string;
  description?: string;
  capacity: number;
  price_per_hour: number;
  address_street?: string;
  address_city?: string;
  address_postal_code?: string;
  equipment?: string[];
  amenities?: string[];
  accessibility_features?: string[];
  is_featured: boolean;
  status: string;
  facility_images?: Array<{
    id: string;
    image_url: string;
    alt_text?: string;
    is_featured: boolean;
  }>;
  // Additional fields for admin compatibility
  location_type?: string;
  is_published?: boolean;
  rating?: number;
  review_count?: number;
}

const getLocalizedText = (value: any, fallback: string = ''): string => {
  if (typeof value === 'string') {
    return value;
  }
  if (typeof value === 'object' && value !== null) {
    return value.no || value.nb || value.en || value.NO || value.EN || fallback;
  }
  return fallback;
};

const computeAddress = (location: any): string => {
  const addressParts = [];
  
  if (location.address_street && location.address_street.trim() !== '') {
    addressParts.push(location.address_street.trim());
  }
  
  if (location.address_postal_code && location.address_postal_code.trim() !== '') {
    addressParts.push(location.address_postal_code.trim());
  }
  
  if (location.address_city && location.address_city.trim() !== '') {
    addressParts.push(location.address_city.trim());
  }
  
  if (addressParts.length > 0) {
    return addressParts.join(', ');
  }
  
  return location.address || '';
};

export const useUnifiedFacilities = (includeUnpublished: boolean = false) => {
  return useQuery({
    queryKey: ['unified-facilities', includeUnpublished],
    queryFn: async (): Promise<UnifiedFacility[]> => {
      try {
        console.log('useUnifiedFacilities - Starting query, includeUnpublished:', includeUnpublished);
        
        // Build query based on whether we want unpublished facilities (admin view)
        let query = supabase
          .from('app_locations')
          .select('*')
          .order('name');

        if (!includeUnpublished) {
          query = query.eq('is_published', true);
        }

        const { data: locations, error: locationsError } = await query;

        if (locationsError) {
          console.error('useUnifiedFacilities - Locations error:', locationsError);
          return [];
        }

        console.log('useUnifiedFacilities - Found locations:', locations?.length || 0);

        // Get all images
        const { data: images, error: imagesError } = await supabase
          .from('app_location_images')
          .select('*')
          .order('display_order');

        if (imagesError) {
          console.warn('useUnifiedFacilities - Images error (non-critical):', imagesError);
        }

        console.log('useUnifiedFacilities - Found images:', images?.length || 0);

        // Group images by location_id
        const imagesByLocation = (images || []).reduce((acc, img) => {
          if (!acc[img.location_id]) {
            acc[img.location_id] = [];
          }
          acc[img.location_id].push({
            id: img.id,
            image_url: img.image_url,
            alt_text: img.alt_text,
            is_featured: img.is_featured
          });
          return acc;
        }, {} as Record<string, any[]>);

        const facilities = (locations || []).map((location: any) => {
          const facilityName = getLocalizedText(location.name, 'Unnamed Facility');
          const facilityDescription = getLocalizedText(location.description, '');
          const facilityAddress = computeAddress(location);
          const facilityImages = imagesByLocation[location.id] || [];

          return {
            id: location.id,
            name: facilityName,
            type: location.location_type || 'facility',
            area: facilityAddress,
            description: facilityDescription,
            capacity: location.capacity || 0,
            price_per_hour: location.price_per_hour || 450,
            address_street: location.address_street || '',
            address_city: location.address_city || '',
            address_postal_code: location.address_postal_code || '',
            equipment: location.equipment || [],
            amenities: location.amenities || [],
            accessibility_features: location.accessibility_features || [],
            is_featured: location.is_featured || false,
            status: location.status || 'active',
            facility_images: facilityImages,
            // Additional fields for admin compatibility
            location_type: location.location_type || 'facility',
            is_published: location.is_published || false,
            rating: location.rating || 0,
            review_count: location.review_count || 0
          };
        });

        console.log('useUnifiedFacilities - Processed facilities:', facilities.length);
        return facilities;
      } catch (error) {
        console.error('useUnifiedFacilities - Catch error:', error);
        return [];
      }
    },
    staleTime: 5 * 60 * 1000,
    retry: false
  });
};

export const useUnifiedFacility = (id: string) => {
  return useQuery({
    queryKey: ['unified-facility', id],
    queryFn: async (): Promise<UnifiedFacility | null> => {
      if (!id) return null;
      
      try {
        console.log('useUnifiedFacility - Fetching facility:', id);
        
        const { data: location, error: locationError } = await supabase
          .from('app_locations')
          .select('*')
          .eq('id', id)
          .single();

        if (locationError) {
          console.error('useUnifiedFacility - Location error:', locationError);
          return null;
        }

        // Get images for this facility
        const { data: images } = await supabase
          .from('app_location_images')
          .select('*')
          .eq('location_id', id)
          .order('display_order');

        const facility = {
          id: location.id,
          name: getLocalizedText(location.name, 'Unknown Facility'),
          type: location.location_type || 'facility',
          area: computeAddress(location),
          description: getLocalizedText(location.description, ''),
          capacity: location.capacity || 0,
          price_per_hour: location.price_per_hour || 450,
          address_street: location.address_street || '',
          address_city: location.address_city || '',
          address_postal_code: location.address_postal_code || '',
          equipment: location.equipment || [],
          amenities: location.amenities || [],
          accessibility_features: location.accessibility_features || [],
          is_featured: location.is_featured || false,
          status: location.status || 'active',
          facility_images: (images || []).map(img => ({
            id: img.id,
            image_url: img.image_url,
            alt_text: img.alt_text,
            is_featured: img.is_featured
          })),
          location_type: location.location_type || 'facility',
          is_published: location.is_published || false,
          rating: location.rating || 0,
          review_count: location.review_count || 0
        };

        console.log('useUnifiedFacility - Processed facility:', facility);
        return facility;
      } catch (error) {
        console.error('useUnifiedFacility - Catch error:', error);
        return null;
      }
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    retry: false
  });
};
