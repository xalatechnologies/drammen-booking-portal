
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Facility {
  id: number;
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
    id: number;
    image_url: string;
    alt_text?: string;
    is_featured: boolean;
  }>;
}

export const useFacilities = () => {
  return useQuery({
    queryKey: ['facilities'],
    queryFn: async (): Promise<Facility[]> => {
      try {
        // Use app_locations table since that's what exists in the database
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

        // Transform the data to match the expected Facility interface
        const facilities = (data || []).map((location: any) => ({
          id: location.id,
          name: typeof location.name === 'string' ? location.name : location.name?.en || 'Unknown',
          type: location.location_type || 'facility',
          area: location.address || '',
          description: typeof location.description === 'string' ? location.description : location.description?.en || '',
          capacity: location.capacity || 0,
          price_per_hour: 450, // Default price
          address_street: location.address || '',
          address_city: '',
          address_postal_code: '',
          equipment: location.facilities || [],
          amenities: [],
          accessibility_features: [],
          is_featured: false,
          status: 'active',
          facility_images: location.app_location_images || []
        }));

        return facilities;
      } catch (error) {
        console.error('Facilities fetch error:', error);
        return [];
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false // Don't retry on errors to avoid spam
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

        // Transform the data to match the expected Facility interface
        const facility = {
          id: data.id,
          name: typeof data.name === 'string' ? data.name : data.name?.en || 'Unknown',
          type: data.location_type || 'facility',
          area: data.address || '',
          description: typeof data.description === 'string' ? data.description : data.description?.en || '',
          capacity: data.capacity || 0,
          price_per_hour: 450, // Default price
          address_street: data.address || '',
          address_city: '',
          address_postal_code: '',
          equipment: data.facilities || [],
          amenities: [],
          accessibility_features: [],
          is_featured: false,
          status: 'active',
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
