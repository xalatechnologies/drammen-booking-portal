
import { supabase } from '@/integrations/supabase/client';
import { ApiResponse } from '@/types/api';

export interface Profile {
  id: string;
  name: string;
  email: string;
  locale: 'NO' | 'EN';
  created_at: string;
  updated_at: string;
}

export interface UserRole {
  id: string;
  user_id: string;
  role_id: string;
  created_at: string;
}

export class ProfileService {
  static async getCurrentProfile(): Promise<ApiResponse<Profile>> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return {
          success: false,
          error: {
            message: 'User not authenticated'
          }
        };
      }

      const { data, error } = await supabase
        .from('app_users')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        return {
          success: false,
          error: {
            message: 'Failed to fetch profile',
            details: error
          }
        };
      }

      return {
        success: true,
        data: {
          id: data.id,
          name: data.name,
          email: data.email,
          locale: data.locale as 'NO' | 'EN',
          created_at: data.created_at,
          updated_at: data.updated_at
        }
      };
    } catch (error) {
      return {
        success: false,
        error: {
          message: 'Failed to fetch profile',
          details: error
        }
      };
    }
  }

  static async updateProfile(updates: Partial<Profile>): Promise<ApiResponse<Profile>> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return {
          success: false,
          error: {
            message: 'User not authenticated'
          }
        };
      }

      const { data, error } = await supabase
        .from('app_users')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)
        .select()
        .single();

      if (error) {
        return {
          success: false,
          error: {
            message: 'Failed to update profile',
            details: error
          }
        };
      }

      return {
        success: true,
        data: {
          id: data.id,
          name: data.name,
          email: data.email,
          locale: data.locale as 'NO' | 'EN',
          created_at: data.created_at,
          updated_at: data.updated_at
        }
      };
    } catch (error) {
      return {
        success: false,
        error: {
          message: 'Failed to update profile',
          details: error
        }
      };
    }
  }

  static async getUserRoles(userId?: string): Promise<ApiResponse<UserRole[]>> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const targetUserId = userId || user?.id;
      
      if (!targetUserId) {
        return {
          success: false,
          error: {
            message: 'User ID required'
          }
        };
      }

      const { data, error } = await supabase
        .from('app_user_roles')
        .select('*')
        .eq('user_id', targetUserId);

      if (error) {
        return {
          success: false,
          error: {
            message: 'Failed to fetch user roles',
            details: error
          }
        };
      }

      return {
        success: true,
        data: data || []
      };
    } catch (error) {
      return {
        success: false,
        error: {
          message: 'Failed to fetch user roles',
          details: error
        }
      };
    }
  }

  static async hasRole(role: string, userId?: string): Promise<boolean> {
    try {
      const rolesResult = await this.getUserRoles(userId);
      
      if (!rolesResult.success) {
        return false;
      }

      // For now, return false since we don't have role name mapping
      // This would need to be implemented with proper role management
      return false;
    } catch (error) {
      console.error('Error checking user role:', error);
      return false;
    }
  }
}
