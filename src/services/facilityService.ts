
import { supabase } from '@/integrations/supabase/client';

export class FacilityService {
  static async createFacility(data: any) {
    try {
      const { data: facility, error } = await supabase
        .from('facilities')
        .insert(data)
        .select()
        .single();

      if (error) throw error;
      return { success: true, data: facility };
    } catch (error) {
      return { success: false, error };
    }
  }

  static async updateFacility(id: string, data: any) {
    try {
      const { data: facility, error } = await supabase
        .from('facilities')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return { success: true, data: facility };
    } catch (error) {
      return { success: false, error };
    }
  }

  static async getFacilityById(id: string) {
    try {
      const { data, error } = await supabase
        .from('facilities')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      return { success: false, error };
    }
  }
}
