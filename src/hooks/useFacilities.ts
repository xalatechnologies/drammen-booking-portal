
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

const getLocalizedText = (value: any, fallback: string = 'Unknown'): string => {
  if (typeof value === 'string') {
    return value;
  }
  if (typeof value === 'object' && value !== null) {
    // Try different language codes
    return value.no || value.en || value.nb || fallback;
  }
  return fallback;
};

export const useFacilities = () => {
  return useQuery({
    queryKey: ['facilities'],
    queryFn: async (): Promise<Facility[]> => {
      try {
        const { data, error } = await supabase
          .from('app_locations')
          .select(`
            *,
            app_location_images (
              id,
              image_url,
              alt_text,
              is_featured
            )
          `)
          .eq('is_published', true)
          .order('name');

        if (error) {
          console.error('Database error:', error);
          return [];
        }

        const facilities = (data || []).map((location: any) => ({
          id: location.id,
          name: getLocalizedText(location.name, 'Unknown Facility'),
          type: location.location_type || 'facility',
          area: location.address || '',
          description: getLocalizedText(location.description, ''),
          capacity: location.capacity || 0,
          price_per_hour: location.price_per_hour || 450,
          address_street: location.address || '',
          address_city: '',
          address_postal_code: '',
          equipment: location.equipment || [],
          amenities: location.amenities || [],
          accessibility_features: location.accessibility_features || [],
          is_featured: location.is_featured || false,
          status: location.status || 'active',
          facility_images: location.app_location_images || []
        }));

        return facilities;
      } catch (error) {
        console.error('Facilities fetch error:', error);
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
        const { data, error } = await supabase
          .from('app_locations')
          .select(`
            *,
            app_location_images (
              id,
              image_url,
              alt_text,
              is_featured
            )
          `)
          .eq('id', id)
          .eq('is_published', true)
          .single();

        if (error) {
          console.error('Database error:', error);
          return null;
        }

        const facility = {
          id: data.id,
          name: getLocalizedText(data.name, 'Unknown Facility'),
          type: data.location_type || 'facility',
          area: data.address || '',
          description: getLocalizedText(data.description, ''),
          capacity: data.capacity || 0,
          price_per_hour: data.price_per_hour || 450,
          address_street: data.address || '',
          address_city: '',
          address_postal_code: '',
          equipment: data.equipment || [],
          amenities: data.amenities || [],
          accessibility_features: data.accessibility_features || [],
          is_featured: data.is_featured || false,
          status: data.status || 'active',
          facility_images: data.app_location_images || []
        };

        return facility;
      } catch (error) {
        console.error('Facility fetch error:', error);
        return null;
      }
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    retry: false
  });
};

export const useFacilitiesPagination = (page: number = 1, limit: number = 12) => {
  const { data: facilities = [], isLoading } = useFacilities();
  
  return useQuery({
    queryKey: ['facilities-paginated', page, limit],
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
    enabled: !isLoading,
    staleTime: 5 * 60 * 1000
  });
};
