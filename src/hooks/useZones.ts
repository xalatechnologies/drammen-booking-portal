
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Zone } from '@/types/facility';
import { useLanguage } from '@/contexts/LanguageContext';

export const useZones = (facilityId?: string) => {
  const { language } = useLanguage();

  return useQuery({
    queryKey: ['zones', facilityId, language],
    queryFn: async () => {
      console.log('useZones - Fetching zones for facility:', facilityId);
      
      if (!facilityId) {
        console.log('useZones - No facility ID provided, returning empty array');
        return [];
      }

      try {
        const { data, error } = await supabase
          .from('app_zones')
          .select('*')
          .eq('location_id', facilityId);
        
        if (error) {
          console.error('useZones - Error fetching zones:', error);
          throw new Error(error.message);
        }

        console.log('useZones - Raw zones data:', data);

        // Transform the data to match the expected Zone interface
        const zones: Zone[] = (data || []).map((zone: any) => {
          const getName = (nameObj: any) => {
            if (typeof nameObj === 'string') return nameObj;
            if (typeof nameObj === 'object' && nameObj) {
              return nameObj[language] || nameObj['NO'] || nameObj['EN'] || 'Unknown Zone';
            }
            return 'Unknown Zone';
          };

          return {
            id: zone.id,
            name: getName(zone.name),
            facility_id: zone.location_id,
            type: 'room',
            capacity: zone.capacity || 1,
            description: getName(zone.name),
            is_main_zone: false,
            parent_zone_id: null,
            bookable_independently: true,
            area_sqm: null,
            floor: null,
            coordinates_x: null,
            coordinates_y: null,
            coordinates_width: null,
            coordinates_height: null,
            equipment: [],
            accessibility_features: [],
            status: 'active',
            created_at: zone.created_at,
            updated_at: zone.updated_at,
            // Legacy fields
            facilityId: zone.location_id,
            isActive: true,
            amenities: [],
            pricePerHour: 0,
            bookableIndependently: true
          };
        });

        console.log('useZones - Transformed zones:', zones);
        return zones;
      } catch (error) {
        console.error('useZones - Exception:', error);
        throw error;
      }
    },
    enabled: !!facilityId,
  });
};

export const useCreateZone = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (zoneData: Partial<Zone>) => {
      const { data, error } = await supabase
        .from('app_zones')
        .insert({
          location_id: zoneData.facilityId || zoneData.facility_id,
          name: { NO: zoneData.name, EN: zoneData.name },
          capacity: zoneData.capacity || 1,
          code: zoneData.name?.toLowerCase().replace(/\s+/g, '-') || 'zone',
          metadata: {}
        })
        .select()
        .single();
      
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['zones', variables.facilityId || variables.facility_id] });
    },
  });
};

export const useUpdateZone = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Zone> }) => {
      const updateData: any = {};
      
      if (data.name) {
        updateData.name = { NO: data.name, EN: data.name };
      }
      if (data.capacity) {
        updateData.capacity = data.capacity;
      }
      
      const { data: result, error } = await supabase
        .from('app_zones')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw new Error(error.message);
      return result;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['zones', data.location_id] });
    },
  });
};

export const useDeleteZone = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('app_zones')
        .delete()
        .eq('id', id);
      
      if (error) throw new Error(error.message);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['zones'] });
    },
  });
};
