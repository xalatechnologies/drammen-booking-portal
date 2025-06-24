
import { supabase } from '@/integrations/supabase/client';

export class SimpleRepository {
  constructor(private tableName: string) {}

  async getAll() {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*');
    
    if (error) {
      console.error(`Error fetching from ${this.tableName}:`, error);
      return { data: [], error: error.message };
    }
    
    return { data: data || [], error: null };
  }

  async getById(id: string) {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .eq('id', id)
      .maybeSingle();
    
    if (error) {
      console.error(`Error fetching ${id} from ${this.tableName}:`, error);
      return { data: null, error: error.message };
    }
    
    return { data, error: null };
  }

  async create(data: Record<string, any>) {
    const { data: result, error } = await supabase
      .from(this.tableName)
      .insert(data)
      .select()
      .single();
    
    if (error) {
      console.error(`Error creating in ${this.tableName}:`, error);
      return { data: null, error: error.message };
    }
    
    return { data: result, error: null };
  }

  async update(id: string, data: Record<string, any>) {
    const { data: result, error } = await supabase
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
  }

  async delete(id: string) {
    const { error } = await supabase
      .from(this.tableName)
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error(`Error deleting ${id} from ${this.tableName}:`, error);
      return { success: false, error: error.message };
    }
    
    return { success: true, error: null };
  }
}
