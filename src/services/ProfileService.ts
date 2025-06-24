
import { supabase } from "@/integrations/supabase/client";

export interface Profile {
  id: string;
  name: string;
  email: string;
  locale: string;
  created_at: string;
}

export class ProfileService {
  static async getCurrentProfile(): Promise<{ success: boolean; data?: Profile; error?: { message: string } }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { success: false, error: { message: 'Not authenticated' } };
      }

      const profile = await this.getProfile(user.id);
      if (!profile) {
        return { success: false, error: { message: 'Profile not found' } };
      }

      return { success: true, data: profile };
    } catch (error) {
      return { success: false, error: { message: 'Failed to get profile' } };
    }
  }

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

  static async updateProfile(userId: string, updates: Partial<Profile>): Promise<{ success: boolean; data?: Profile; error?: { message: string } }> {
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

      const profile: Profile = {
        id: data.id,
        name: data.name,
        email: data.email,
        locale: data.locale || 'NO',
        created_at: data.created_at || ''
      };

      return { success: true, data: profile };
    } catch (error) {
      return { success: false, error: { message: 'Failed to update profile' } };
    }
  }

  static async getUserRoles(userId?: string): Promise<{ success: boolean; data?: string[]; error?: { message: string } }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const targetUserId = userId || user?.id;
      
      if (!targetUserId) {
        return { success: false, error: { message: 'User ID required' } };
      }

      const { data, error } = await supabase
        .from('app_user_roles')
        .select(`
          role:app_roles(name)
        `)
        .eq('user_id', targetUserId);

      if (error) throw new Error(error.message);

      const roles = (data || []).map((item: any) => item.role?.name).filter(Boolean);
      return { success: true, data: roles };
    } catch (error) {
      return { success: false, error: { message: 'Failed to get user roles' } };
    }
  }

  static async hasRole(role: string, userId?: string): Promise<boolean> {
    try {
      const result = await this.getUserRoles(userId);
      if (!result.success || !result.data) return false;
      return result.data.includes(role);
    } catch (error) {
      console.error('Error checking user role:', error);
      return false;
    }
  }
}
