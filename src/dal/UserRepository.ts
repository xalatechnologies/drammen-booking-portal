
import { supabase } from '@/integrations/supabase/client';

export class UserRepository {
  async getAllUsers() {
    try {
      const { data, error } = await supabase
        .from('app_users')
        .select(`
          *,
          app_user_roles (
            role,
            is_active
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching users:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('User fetch error:', error);
      return [];
    }
  }

  async getUserById(id: string) {
    try {
      const { data, error } = await supabase
        .from('app_users')
        .select(`
          *,
          app_user_roles (
            role,
            is_active
          )
        `)
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching user:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('User fetch error:', error);
      return null;
    }
  }

  async getUserRoles(userId: string) {
    try {
      const { data, error } = await supabase
        .from('app_user_roles')
        .select('*')
        .eq('user_id', userId)
        .eq('is_active', true);

      if (error) {
        console.error('Error fetching user roles:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('User roles fetch error:', error);
      return [];
    }
  }
}

export const userRepository = new UserRepository();
