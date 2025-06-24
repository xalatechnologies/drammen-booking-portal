
import { supabase } from "@/integrations/supabase/client";

interface Profile {
  id: string;
  name: string;
  email: string;
  locale: string;
  created_at: string;
}

export class ProfileService {
  static async getProfile(userId: string): Promise<Profile | null> {
    try {
      const { data, error } = await supabase
        .from('app_users')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) throw new Error(error.message);
      if (!data) return null;

      return {
        id: data.id,
        name: data.name,
        email: data.email,
        locale: data.locale || 'NO',
        created_at: data.created_at || ''
      };
    } catch (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
  }

  static async updateProfile(userId: string, updates: Partial<Profile>): Promise<Profile | null> {
    try {
      const { data, error } = await supabase
        .from('app_users')
        .update({
          name: updates.name,
          email: updates.email,
          locale: updates.locale
        })
        .eq('id', userId)
        .select()
        .single();

      if (error) throw new Error(error.message);

      return {
        id: data.id,
        name: data.name,
        email: data.email,
        locale: data.locale || 'NO',
        created_at: data.created_at || ''
      };
    } catch (error) {
      console.error('Error updating profile:', error);
      return null;
    }
  }

  static async getUserRoles(userId: string): Promise<string[]> {
    try {
      const { data, error } = await supabase
        .from('app_user_roles')
        .select(`
          role:app_roles(name)
        `)
        .eq('user_id', userId);

      if (error) throw new Error(error.message);

      return (data || []).map((item: any) => item.role?.name).filter(Boolean);
    } catch (error) {
      console.error('Error fetching user roles:', error);
      return [];
    }
  }
}
