
import { supabase } from '@/integrations/supabase/client';

export class SimpleRepository {
  constructor(private tableName: string) {}

  async getAll() {
    try {
      const { data, error } = await (supabase as any)
        .from(this.tableName)
        .select('*');
      
      if (error) {
        console.error(`Error fetching from ${this.tableName}:`, error);
        return { data: [], error: error.message };
      }
      
      return { data: data || [], error: null };
    } catch (err: any) {
      console.error(`Error in getAll for ${this.tableName}:`, err);
      return { data: [], error: err.message };
    }
  }

  async getById(id: string) {
    try {
      const { data, error } = await (supabase as any)
        .from(this.tableName)
        .select('*')
        .eq('id', id)
        .maybeSingle();
      
      if (error) {
        console.error(`Error fetching ${id} from ${this.tableName}:`, error);
        return { data: null, error: error.message };
      }
      
      return { data, error: null };
    } catch (err: any) {
      console.error(`Error in getById for ${this.tableName}:`, err);
      return { data: null, error: err.message };
    }
  }

  async create(data: Record<string, any>) {
    try {
      const { data: result, error } = await (supabase as any)
        .from(this.tableName)
        .insert(data)
        .select()
        .single();
      
      if (error) {
        console.error(`Error creating in ${this.tableName}:`, error);
        return { data: null, error: error.message };
      }
      
      return { data: result, error: null };
    } catch (err: any) {
      console.error(`Error in create for ${this.tableName}:`, err);
      return { data: null, error: err.message };
    }
  }

  async update(id: string, data: Record<string, any>) {
    try {
      const { data: result, error } = await (supabase as any)
        .from(this.tableName)
        .update(data)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error(`Error updating ${id} in ${this.tableName}:`, error);
        return { data: null, error: error.message };
      }
      
      return { data: result, error: null };
    } catch (err: any) {
      console.error(`Error in update for ${this.tableName}:`, err);
      return { data: null, error: err.message };
    }
  }

  async delete(id: string) {
    try {
      const { error } = await (supabase as any)
        .from(this.tableName)
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error(`Error deleting ${id} from ${this.tableName}:`, error);
        return { success: false, error: error.message };
      }
      
      return { success: true, error: null };
    } catch (err: any) {
      console.error(`Error in delete for ${this.tableName}:`, err);
      return { success: false, error: err.message };
    }
  }
}
