
import { supabase } from "@/integrations/supabase/client";

export interface SimpleResponse<T> {
  success: boolean;
  data?: T;
  error?: { message: string; code?: string };
}

export class SupabaseRepository {
  constructor(private tableName: string) {}

  async getAll(): Promise<SimpleResponse<any[]>> {
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .select('*');
      
      if (error) {
        return { success: false, error: { message: error.message, code: error.code } };
      }

      return {
        success: true,
        data: data || []
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

  async getById(id: string): Promise<SimpleResponse<any>> {
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .select('*')
        .eq('id', id)
        .maybeSingle();

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

  async create(data: any): Promise<SimpleResponse<any>> {
    try {
      const { data: result, error } = await supabase
        .from(this.tableName)
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

  async update(id: string, data: any): Promise<SimpleResponse<any>> {
    try {
      const { data: result, error } = await supabase
        .from(this.tableName)
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

  async delete(id: string): Promise<SimpleResponse<void>> {
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
