
import { SupabaseRepository } from './SupabaseRepository';
import { User, UserFilters, UserCreateRequest, UserUpdateRequest } from '@/types/user';
import { RepositoryResponse } from '@/types/api';
import { supabase } from '@/integrations/supabase/client';

export class UserRepository extends SupabaseRepository<User> {
  protected tableName = 'profiles';

  constructor() {
    super();
  }

  // User-specific methods
  async findByEmail(email: string): Promise<RepositoryResponse<User | null>> {
    try {
      const { data, error } = await supabase
        .from(this.tableName as any)
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
        data: data as unknown as User | null
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
        .from('user_roles')
        .select(`
          *,
          profiles (*)
        `)
        .eq('role', role as any)
        .eq('is_active', true);

      if (error) {
        return {
          data: [],
          error: error.message
        };
      }

      return {
        data: (data?.map((item: any) => item.profiles).filter(Boolean) as User[]) || []
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
        .from(this.tableName as any)
        .update({
          last_login_at: new Date().toISOString()
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
        data: data as unknown as User | null
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
