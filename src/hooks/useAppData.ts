
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface AppLocation {
  id: string;
  name: any;
  description: any;
  address: string;
  code: string;
  latitude: number | null;
  longitude: number | null;
  metadata: any;
  created_at: string;
  updated_at: string;
}

export interface AppActor {
  id: string;
  name: any;
  type: string;
  contact_info: any;
  metadata: any;
  created_at: string;
  updated_at: string;
}

export interface AppUser {
  id: string;
  name: string;
  email: string;
  locale: string;
  created_at: string;
  updated_at: string;
}

export const useAppLocations = () => {
  return useQuery({
    queryKey: ['app-locations'],
    queryFn: async (): Promise<AppLocation[]> => {
      const { data, error } = await supabase
        .from('app_locations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });
};

export const useAppActors = () => {
  return useQuery({
    queryKey: ['app-actors'],
    queryFn: async (): Promise<AppActor[]> => {
      const { data, error } = await supabase
        .from('app_actors')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });
};

export const useAppUsers = () => {
  return useQuery({
    queryKey: ['app-users'],
    queryFn: async (): Promise<AppUser[]> => {
      const { data, error } = await supabase
        .from('app_users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });
};
