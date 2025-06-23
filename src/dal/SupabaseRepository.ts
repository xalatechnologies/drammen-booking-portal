
import { supabase } from '@/integrations/supabase/client';
import { PaginationParams, RepositoryResponse } from '@/types/api';

export abstract class SupabaseRepository<T extends Record<string, any>> {
  protected abstract tableName: string;

  async findAll(
    pagination?: PaginationParams,
    orderBy?: string,
    orderDirection: 'asc' | 'desc' = 'asc'
  ): Promise<RepositoryResponse<T[]>> {
    try {
      let query = supabase.from(this.tableName as any).select('*', { count: 'exact' });

      if (orderBy) {
        query = query.order(orderBy, { ascending: orderDirection === 'asc' });
      }

      if (pagination) {
        const from = (pagination.page! - 1) * pagination.limit!;
        const to = from + pagination.limit! - 1;
        query = query.range(from, to);
      }

      const { data, error } = await query;

      if (error) {
        return {
          data: [] as T[],
          error: error.message
        };
      }

      return {
        data: (data as unknown as T[]) || [],
        error: null
      };
    } catch (error: any) {
      return {
        data: [] as T[],
        error: error.message
      };
    }
  }

  async findById(id: string): Promise<RepositoryResponse<T | null>> {
    try {
      const { data, error } = await supabase
        .from(this.tableName as any)
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) {
        return {
          data: null,
          error: error.message
        };
      }

      return {
        data: data as unknown as T | null,
        error: null
      };
    } catch (error: any) {
      return {
        data: null,
        error: error.message
      };
    }
  }

  async create(data: Omit<T, 'id' | 'created_at' | 'updated_at'>): Promise<RepositoryResponse<T | null>> {
    try {
      const { data: result, error } = await supabase
        .from(this.tableName as any)
        .insert(data as any)
        .select()
        .maybeSingle();

      if (error) {
        return {
          data: null,
          error: error.message
        };
      }

      return {
        data: result as unknown as T | null,
        error: null
      };
    } catch (error: any) {
      return {
        data: null,
        error: error.message
      };
    }
  }

  async update(id: string, data: Partial<Omit<T, 'id' | 'created_at'>>): Promise<RepositoryResponse<T | null>> {
    try {
      const { data: result, error } = await supabase
        .from(this.tableName as any)
        .update(data as any)
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
        data: result as unknown as T | null,
        error: null
      };
    } catch (error: any) {
      return {
        data: null,
        error: error.message
      };
    }
  }

  async delete(id: string): Promise<RepositoryResponse<boolean>> {
    try {
      const { error } = await supabase
        .from(this.tableName as any)
        .delete()
        .eq('id', id);

      if (error) {
        return {
          data: false,
          error: error.message
        };
      }

      return {
        data: true,
        error: null
      };
    } catch (error: any) {
      return {
        data: false,
        error: error.message
      };
    }
  }
}
