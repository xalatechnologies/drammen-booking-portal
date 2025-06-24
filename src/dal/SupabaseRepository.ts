
import { supabase } from "@/integrations/supabase/client";
import { BaseRepository, QueryOptions, ApiResponse } from "./BaseRepository";

export class SupabaseRepository<T = any> implements BaseRepository<T> {
  constructor(private tableName: string) {}

  async getAll(options?: QueryOptions): Promise<ApiResponse<T[]>> {
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .select('*');
      
      if (error) {
        return { success: false, error: { message: error.message, code: error.code } };
      }

      return {
        success: true,
        data: data as T[]
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
        .from(this.tableName)
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
        .from(this.tableName)
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
        .from(this.tableName)
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
        .from(this.tableName)
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
