
import { SupabaseRepository } from './SupabaseRepository';
import { User, UserFilters, UserCreateRequest, UserUpdateRequest } from '@/types/user';
import { RepositoryResponse } from '@/types/api';
import { supabase } from '@/integrations/supabase/client';

export class UserRepository extends SupabaseRepository<User> {
  constructor() {
    super('app_users');
  }

  // User-specific methods
  async findByEmail(email: string): Promise<RepositoryResponse<User | null>> {
    try {
      const { data, error } = await supabase
        .from('app_users')
        .select('*')
        .eq('email', email.toLowerCase())
        .maybeSingle();

      if (error) {
        return {
          data: null,
          error: error.message
        };
      }

      return {
        data: data as unknown as User | null,
        error: null
      };
    } catch (error: any) {
      return {
        data: null,
        error: error.message
      };
    }
  }

  async findByRole(role: string): Promise<RepositoryResponse<User[]>> {
    try {
      const { data, error } = await supabase
        .from('app_user_roles')
        .select(`
          *,
          app_users (*)
        `)
        .eq('role_id', role as any);

      if (error) {
        return {
          data: [],
          error: error.message
        };
      }

      return {
        data: (data?.map((item: any) => item.app_users).filter(Boolean) as User[]) || [],
        error: null
      };
    } catch (error: any) {
      return {
        data: [],
        error: error.message
      };
    }
  }

  async updateLastLogin(id: string): Promise<RepositoryResponse<User | null>> {
    try {
      const { data, error } = await supabase
        .from('app_users')
        .update({
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .maybeSingle();

      if (error) {
        return {
          data: null,
          error: error.message
        };
      }

      return {
        data: data as unknown as User | null,
        error: null
      };
    } catch (error: any) {
      return {
        data: null,
        error: error.message
      };
    }
  }
}

// Export singleton instance
export const userRepository = new UserRepository();
