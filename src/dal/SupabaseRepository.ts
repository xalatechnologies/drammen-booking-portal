
import { supabase } from "@/integrations/supabase/client";
import { BaseRepository, QueryOptions, ApiResponse, PaginationParams } from "./BaseRepository";

export class SupabaseRepository<T = any> implements BaseRepository<T> {
  constructor(private tableName: string) {}

  async getAll(options?: QueryOptions): Promise<ApiResponse<T[]>> {
    try {
      // Check if table exists in the new schema by trying common app_ tables
      const appTables = ['app_locations', 'app_actors', 'app_users', 'app_zones', 'app_bookings'];
      const actualTable = appTables.includes(this.tableName) ? this.tableName : `app_${this.tableName}`;
      
      let query = supabase.from(actualTable).select('*');
      
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
          data: data || [],
          pagination: options?.pagination ? {
            page: options.pagination.page,
            limit: options.pagination.limit,
            total: count || 0,
            totalPages: Math.ceil((count || 0) / options.pagination.limit),
            hasNext: (options.pagination.page * options.pagination.limit) < (count || 0),
            hasPrev: options.pagination.page > 1
          } : undefined
        }
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
      const appTables = ['app_locations', 'app_actors', 'app_users', 'app_zones', 'app_bookings'];
      const actualTable = appTables.includes(this.tableName) ? this.tableName : `app_${this.tableName}`;
      
      const { data, error } = await supabase
        .from(actualTable)
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        return { success: false, error: { message: error.message, code: error.code } };
      }

      return { success: true, data };
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
      const appTables = ['app_locations', 'app_actors', 'app_users', 'app_zones', 'app_bookings'];
      const actualTable = appTables.includes(this.tableName) ? this.tableName : `app_${this.tableName}`;
      
      const { data: result, error } = await supabase
        .from(actualTable)
        .insert(data)
        .select()
        .single();

      if (error) {
        return { success: false, error: { message: error.message, code: error.code } };
      }

      return { success: true, data: result };
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
      const appTables = ['app_locations', 'app_actors', 'app_users', 'app_zones', 'app_bookings'];
      const actualTable = appTables.includes(this.tableName) ? this.tableName : `app_${this.tableName}`;
      
      const { data: result, error } = await supabase
        .from(actualTable)
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        return { success: false, error: { message: error.message, code: error.code } };
      }

      return { success: true, data: result };
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
      const appTables = ['app_locations', 'app_actors', 'app_users', 'app_zones', 'app_bookings'];
      const actualTable = appTables.includes(this.tableName) ? this.tableName : `app_${this.tableName}`;
      
      const { error } = await supabase
        .from(actualTable)
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
