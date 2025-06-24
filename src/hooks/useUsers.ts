
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('app_users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw new Error(error.message);
      return data || [];
    },
  });
}

export function useUser(id: string) {
  return useQuery({
    queryKey: ['user', id],
    queryFn: async () => {
      if (!id) return null;
      
      const { data, error } = await supabase
        .from('app_users')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) throw new Error(error.message);
      return data;
    },
    enabled: !!id,
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (userData: any) => {
      const { data, error } = await supabase
        .from('app_users')
        .insert(userData)
        .select()
        .single();

      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const { data: result, error } = await supabase
        .from('app_users')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) throw new Error(error.message);
      return result;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['user', variables.id] });
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('app_users')
        .delete()
        .eq('id', id);

      if (error) throw new Error(error.message);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}
