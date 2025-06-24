
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Zone {
  id: string;
  name: string;
  facility_id: number;
  type: string;
  capacity: number;
  description: string | null;
  is_main_zone: boolean;
  parent_zone_id: string | null;
  bookable_independently: boolean;
  area_sqm: number | null;
  floor: string | null;
  coordinates_x: number | null;
  coordinates_y: number | null;
  coordinates_width: number | null;
  coordinates_height: number | null;
  equipment: string[] | null;
  accessibility_features: string[] | null;
  status: string;
  created_at: string;
  updated_at: string;
}

export function useZones(facilityId?: number) {
  return useQuery({
    queryKey: ['zones', facilityId],
    queryFn: async () => {
      let query = supabase
        .from('zones')
        .select('*')
        .eq('status', 'active')
        .order('name');

      if (facilityId) {
        query = query.eq('facility_id', facilityId);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching zones:', error);
        throw error;
      }

      return data || [];
    },
    enabled: true,
  });
}

export function useZonesByFacility(facilityId: number) {
  return useZones(facilityId);
}
