
import { supabase } from '@/integrations/supabase/client';

export class ZoneService {
  static async getZonesByFacilityId(facilityId: number) {
    const { data, error } = await supabase
      .from('zones')
      .select('*')
      .eq('facility_id', facilityId);
    
    if (error) throw error;
    return data || [];
  }

  static async createZone(zoneData: any) {
    const { data, error } = await supabase
      .from('zones')
      .insert(zoneData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
}
