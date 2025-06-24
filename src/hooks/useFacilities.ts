
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Facility {
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
}

const getLocalizedText = (value: any, fallback: string = ''): string => {
  if (typeof value === 'string') {
    return value;
  }
  if (typeof value === 'object' && value !== null) {
    // Try different language codes - prioritize Norwegian
    return value.no || value.nb || value.en || value.NO || value.EN || fallback;
  }
  return fallback;
};

const computeAddress = (location: any): string => {
  const addressParts = [
    location.address_street,
    location.address_city,
    location.address_postal_code
  ].filter(part => part && part.trim() !== '');
  
  return addressParts.length > 0 
    ? addressParts.join(', ')
    : location.address || '';
};

export const useFacilities = () => {
  return useQuery({
    queryKey: ['facilities'],
    queryFn: async (): Promise<Facility[]> => {
      try {
        console.log('useFacilities - Starting query...');
        
        // Get the locations with better error handling
        const { data: locations, error: locationsError } = await supabase
          .from('app_locations')
          .select('*')
          .eq('is_published', true)
          .order('name');

        if (locationsError) {
          console.error('useFacilities - Locations error:', locationsError);
          return [];
        }

        console.log('useFacilities - Raw locations data:', locations);

        // Get images separately to avoid relationship conflicts
        const { data: images, error: imagesError } = await supabase
          .from('app_location_images')
          .select('*')
          .order('display_order');

        if (imagesError) {
          console.warn('useFacilities - Images error (non-critical):', imagesError);
        }

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
          console.log('useFacilities - Processing location:', {
            id: location.id,
            name: location.name,
            description: location.description,
            address_street: location.address_street,
            address_city: location.address_city
          });

          const facilityName = getLocalizedText(location.name, 'Unnamed Facility');
          const facilityDescription = getLocalizedText(location.description, '');
          const facilityAddress = computeAddress(location);

          console.log('useFacilities - Processed values:', {
            facilityName,
            facilityDescription,
            facilityAddress
          });

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
            facility_images: imagesByLocation[location.id] || []
          };
        });

        console.log('useFacilities - Final processed facilities:', facilities);
        return facilities;
      } catch (error) {
        console.error('useFacilities - Catch error:', error);
        return [];
      }
    },
    staleTime: 5 * 60 * 1000,
    retry: false
  });
};

export const useFacility = (id: string) => {
  return useQuery({
    queryKey: ['facility', id],
    queryFn: async (): Promise<Facility | null> => {
      if (!id) return null;
      
      try {
        console.log('useFacility - Fetching facility:', id);
        
        const { data: location, error: locationError } = await supabase
          .from('app_locations')
          .select('*')
          .eq('id', id)
          .eq('is_published', true)
          .single();

        if (locationError) {
          console.error('useFacility - Location error:', locationError);
          return null;
        }

        // Get images separately
        const { data: images } = await supabase
          .from('app_location_images')
          .select('*')
          .eq('location_id', id)
          .order('display_order');

        const facility = {
          id: location.id,
          name: getLocalizedText(location.name, 'Unknown Facility'),
          type: location.location_type || 'facility',
          area: location.address || '',
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
          }))
        };

        console.log('useFacility - Processed facility:', facility);
        return facility;
      } catch (error) {
        console.error('useFacility - Catch error:', error);
        return null;
      }
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    retry: false
  });
};

export const useFacilitiesPagination = (page: number = 1, limit: number = 12) => {
  const { data: facilities = [] } = useFacilities();
  
  return useQuery({
    queryKey: ['facilities-paginated', page, limit, facilities.length],
    queryFn: async () => {
      const total = facilities.length;
      const start = (page - 1) * limit;
      const paginatedFacilities = facilities.slice(start, start + limit);
      
      return {
        data: paginatedFacilities,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1
        }
      };
    },
    enabled: facilities.length > 0,
    staleTime: 5 * 60 * 1000
  });
};
