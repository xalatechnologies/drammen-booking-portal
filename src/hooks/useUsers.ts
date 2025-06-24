
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface User {
  id: string;
  name: string;
  email: string;
  locale: string;
  created_at: string;
  updated_at: string;
}

export function useUsers() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('app_users')
        .select(`
          *,
          app_user_roles (
            role_id,
            created_at
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching users:', error);
        throw new Error(error.message);
      }

      return data || [];
    }
  });

  return {
    users: data || [],
    isLoading,
    error,
    refetch
  };
}

export function useUser(id: string) {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['user', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('app_users')
        .select(`
          *,
          app_user_roles (
            role_id,
            created_at
          )
        `)
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching user:', error);
        throw new Error(error.message);
      }

      return data;
    },
    enabled: !!id
  });

  return {
    user: data,
    isLoading,
    error,
    refetch
  };
}
