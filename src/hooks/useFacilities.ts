
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
        // Try the edge function first
        const { data, error } = await supabase.functions.invoke('facilities');
        
        if (error) {
          console.error('Edge function error:', error);
          // Fallback to direct database query
          const { data: facilities, error: dbError } = await supabase
            .from('facilities')
            .select(`
              *,
              facility_images (
                id,
                image_url,
                alt_text,
                is_featured
              )
            `)
            .eq('status', 'active')
            .order('name');

          if (dbError) {
            console.error('Database error:', dbError);
            return [];
          }

          return facilities || [];
        }

        return data?.data || [];
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
        // Try the edge function first
        const { data, error } = await supabase.functions.invoke('facilities', {
          body: { id: parseInt(id) }
        });
        
        if (error) {
          console.error('Edge function error:', error);
          // Fallback to direct database query
          const { data: facility, error: dbError } = await supabase
            .from('facilities')
            .select(`
              *,
              facility_images (
                id,
                image_url,
                alt_text,
                is_featured
              )
            `)
            .eq('id', parseInt(id))
            .eq('status', 'active')
            .single();

          if (dbError) {
            console.error('Database error:', dbError);
            return null;
          }

          return facility;
        }

        return data?.data || null;
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
