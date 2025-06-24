
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
        const zones: Zone[] = (data || []).map((zone: any) => ({
          id: zone.id,
          name: typeof zone.name === 'object' ? zone.name[language] || zone.name.NO || zone.name.EN || 'Unknown Zone' : zone.name,
          description: typeof zone.name === 'object' ? zone.name[language] || zone.name.NO || zone.name.EN || '' : '',
          capacity: zone.capacity || 1,
          facilityId: zone.location_id,
          isActive: true,
          equipment: [],
          amenities: [],
          pricePerHour: 0,
        }));

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
          location_id: zoneData.facilityId,
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
      queryClient.invalidateQueries({ queryKey: ['zones', variables.facilityId] });
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
