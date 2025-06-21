
import { supabase } from '@/integrations/supabase/client';
import { PaginationParams, RepositoryResponse } from '@/types/api';

export abstract class BaseRepository<T extends Record<string, any>> {
  protected tableName: string;

  constructor(tableName: string) {
    this.tableName = tableName;
  }

  async findAll(
    pagination?: PaginationParams,
    orderBy?: string,
    orderDirection: 'asc' | 'desc' = 'asc'
  ): Promise<RepositoryResponse<T[]>> {
    try {
      let query = supabase.from(this.tableName).select('*', { count: 'exact' });

      if (orderBy) {
        query = query.order(orderBy, { ascending: orderDirection === 'asc' });
      }

      if (pagination) {
        const from = (pagination.page - 1) * pagination.limit;
        const to = from + pagination.limit - 1;
        query = query.range(from, to);
      }

      const { data, error, count } = await query;

      if (error) {
        return {
          data: [],
          error: error.message
        };
      }

      return {
        data: (data as T[]) || []
      };
    } catch (error: any) {
      return {
        data: [],
        error: error.message
      };
    }
  }

  async findById(id: string): Promise<RepositoryResponse<T | null>> {
    try {
      const { data, error } = await supabase
        .from(this.tableName)
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
        data: data as T | null
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
        .from(this.tableName)
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
        data: result as T | null
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
        .from(this.tableName)
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
        data: result as T | null
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
        .from(this.tableName)
        .delete()
        .eq('id', id);

      if (error) {
        return {
          data: false,
          error: error.message
        };
      }

      return {
        data: true
      };
    } catch (error: any) {
      return {
        data: false,
        error: error.message
      };
    }
  }
}
