
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";

export interface Zone {
  id: string;
  code: string;
  name: any;
  capacity: number;
  interval: string;
  location_id: string;
  metadata?: any;
  created_at?: string;
  updated_at?: string;
}

export function useZones(facilityId?: string) {
  const { language } = useLanguage();

  return useQuery({
    queryKey: ['zones', facilityId, language],
    queryFn: async () => {
      let query = supabase
        .from('app_zones')
        .select('*')
        .order('code');

      if (facilityId) {
        query = query.eq('location_id', facilityId);
      }

      const { data, error } = await query;

      if (error) throw new Error(error.message);

      const zones = data?.map(zone => ({
        ...zone,
        displayName: typeof zone.name === 'object' && zone.name 
          ? zone.name[language] || zone.name['NO'] || zone.name['EN'] || zone.code
          : zone.code
      })) || [];

      return { data: zones, error: null };
    },
    enabled: true,
    staleTime: 0,
  });
}

export function useCreateZone() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (zoneData: {
      code: string;
      name: any;
      capacity: number;
      interval: string;
      location_id: string;
      metadata?: any;
    }) => {
      // Ensure location_id is a string
      const dataToInsert = {
        ...zoneData,
        location_id: String(zoneData.location_id)
      };

      const { data, error } = await supabase
        .from('app_zones')
        .insert([dataToInsert])
        .select()
        .single();

      if (error) throw new Error(error.message);

      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['zones'] });
      queryClient.invalidateQueries({ queryKey: ['zones', data.location_id] });
    },
  });
}

export function useUpdateZone() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      id, 
      updates 
    }: { 
      id: string; 
      updates: Partial<Zone> 
    }) => {
      const { data, error } = await supabase
        .from('app_zones')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw new Error(error.message);

      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['zones'] });
      queryClient.invalidateQueries({ queryKey: ['zones', data.location_id] });
    },
  });
}

export function useDeleteZone() {
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
}
