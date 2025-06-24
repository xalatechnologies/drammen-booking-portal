
import { supabase } from "@/integrations/supabase/client";
import { BaseRepository, QueryOptions, ApiResponse } from "./BaseRepository";

export class SupabaseRepository<T = any> implements BaseRepository<T> {
  constructor(private tableName: string) {}

  async getAll(options?: QueryOptions): Promise<ApiResponse<T[]>> {
    try {
      let query = supabase.from(this.tableName as any).select('*');
      
      if (options?.filters) {
        Object.entries(options.filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            query = query.eq(key, value);
          }
        });
      }
      
      if (options?.sortBy) {
        query = query.order(options.sortBy, { 
          ascending: options.sortOrder === 'asc'
        });
      }
      
      if (options?.pagination) {
        const { page, limit } = options.pagination;
        const from = (page - 1) * limit;
        const to = from + limit - 1;
        query = query.range(from, to);
      }

      const { data, error, count } = await query;
      
      if (error) {
        return { success: false, error: { message: error.message, code: error.code } };
      }

      return {
        success: true,
        data: {
          data: (data || []) as T[],
          pagination: options?.pagination ? {
            page: options.pagination.page,
            limit: options.pagination.limit,
            total: count || 0,
            totalPages: Math.ceil((count || 0) / options.pagination.limit),
            hasNext: (options.pagination.page * options.pagination.limit) < (count || 0),
            hasPrev: options.pagination.page > 1
          } : undefined
        } as any
      };
    } catch (error) {
      return {
        success: false,
        error: {
          message: error instanceof Error ? error.message : 'Unknown error occurred',
          code: 'UNKNOWN_ERROR'
        }
      };
    }
  }

  async getById(id: string): Promise<ApiResponse<T>> {
    try {
      const { data, error } = await supabase
        .from(this.tableName as any)
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) {
        return { success: false, error: { message: error.message, code: error.code } };
      }

      return { success: true, data: data as T };
    } catch (error) {
      return {
        success: false,
        error: {
          message: error instanceof Error ? error.message : 'Unknown error occurred',
          code: 'UNKNOWN_ERROR'
        }
      };
    }
  }

  async create(data: Partial<T>): Promise<ApiResponse<T>> {
    try {
      const { data: result, error } = await supabase
        .from(this.tableName as any)
        .insert(data as any)
        .select()
        .single();

      if (error) {
        return { success: false, error: { message: error.message, code: error.code } };
      }

      return { success: true, data: result as T };
    } catch (error) {
      return {
        success: false,
        error: {
          message: error instanceof Error ? error.message : 'Unknown error occurred',
          code: 'UNKNOWN_ERROR'
        }
      };
    }
  }

  async update(id: string, data: Partial<T>): Promise<ApiResponse<T>> {
    try {
      const { data: result, error } = await supabase
        .from(this.tableName as any)
        .update(data as any)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        return { success: false, error: { message: error.message, code: error.code } };
      }

      return { success: true, data: result as T };
    } catch (error) {
      return {
        success: false,
        error: {
          message: error instanceof Error ? error.message : 'Unknown error occurred',
          code: 'UNKNOWN_ERROR'
        }
      };
    }
  }

  async delete(id: string): Promise<ApiResponse<void>> {
    try {
      const { error } = await supabase
        .from(this.tableName as any)
        .delete()
        .eq('id', id);

      if (error) {
        return { success: false, error: { message: error.message, code: error.code } };
      }

      return { success: true, data: undefined };
    } catch (error) {
      return {
        success: false,
        error: {
          message: error instanceof Error ? error.message : 'Unknown error occurred',
          code: 'UNKNOWN_ERROR'
        }
      };
    }
  }
}
