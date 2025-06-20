
import { supabase } from '@/integrations/supabase/client';
import { ApiResponse } from '@/types/api';

export interface Profile {
  id: string;
  first_name: string;
  last_name: string;
  phone?: string;
  avatar_url?: string;
  bio?: string;
  preferred_language: 'NO' | 'EN';
  date_of_birth?: string;
  address_street?: string;
  address_city?: string;
  address_postal_code?: string;
  address_country?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserRole {
  id: string;
  user_id: string;
  role: string;
  granted_at: string;
  expires_at?: string;
  is_active: boolean;
}

export class ProfileService {
  static async getCurrentProfile(): Promise<ApiResponse<Profile>> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return {
          success: false,
          error: {
            message: 'User not authenticated',
            code: 'UNAUTHENTICATED'
          }
        };
      }

      const { data, error } = await supabase
        .from('profiles')
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
        data
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
            message: 'User not authenticated',
            code: 'UNAUTHENTICATED'
          }
        };
      }

      const { data, error } = await supabase
        .from('profiles')
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
        data
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
            message: 'User ID required',
            code: 'INVALID_INPUT'
          }
        };
      }

      const { data, error } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', targetUserId)
        .eq('is_active', true);

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
        data
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

      return rolesResult.data.some(userRole => 
        userRole.role === role && 
        userRole.is_active &&
        (!userRole.expires_at || new Date(userRole.expires_at) > new Date())
      );
    } catch (error) {
      console.error('Error checking user role:', error);
      return false;
    }
  }
}
