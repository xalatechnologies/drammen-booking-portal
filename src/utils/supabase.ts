
import { supabase } from '@/integrations/supabase/client';
import { Facility } from '@/types/facility';

export const facilityUtils = {
  async getFacilities() {
    const { data, error } = await supabase
      .from('facilities')
      .select(`
        *,
        facility_opening_hours(*),
        facility_images(*)
      `)
      .eq('status', 'active')
      .order('name');
    
    if (error) throw error;
    return data;
  },

  async getFacilityById(id: string) {
    const { data, error } = await supabase
      .from('facilities')
      .select(`
        *,
        facility_opening_hours(*),
        facility_images(*)
      `)
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  async createFacility(facility: Partial<Facility>) {
    const { data, error } = await supabase
      .from('facilities')
      .insert(facility)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateFacility(id: string, updates: Partial<Facility>) {
    const { data, error } = await supabase
      .from('facilities')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async deleteFacility(id: string) {
    const { error } = await supabase
      .from('facilities')
      .update({ status: 'inactive', updated_at: new Date().toISOString() })
      .eq('id', id);
    
    if (error) throw error;
    return true;
  }
};

export const zoneUtils = {
  async getZonesByFacilityId(facilityId: number) {
    const { data, error } = await supabase
      .from('zones')
      .select('*')
      .eq('facility_id', facilityId)
      .eq('status', 'active')
      .order('name');
    
    if (error) throw error;
    return data || [];
  }
};

export const openingHoursUtils = {
  async getOpeningHours(facilityId: number) {
    const { data, error } = await supabase
      .from('facility_opening_hours')
      .select('*')
      .eq('facility_id', facilityId)
      .order('day_of_week');
    
    if (error) throw error;
    return data || [];
  },

  async saveOpeningHours(facilityId: number, hours: any[]) {
    // Delete existing hours
    await supabase
      .from('facility_opening_hours')
      .delete()
      .eq('facility_id', facilityId);

    // Insert new hours
    const hoursWithFacilityId = hours.map(hour => ({
      ...hour,
      facility_id: facilityId
    }));

    const { data, error } = await supabase
      .from('facility_opening_hours')
      .insert(hoursWithFacilityId)
      .select();
    
    if (error) throw error;
    return data;
  }
};

export const blackoutUtils = {
  async getBlackoutsByFacility(facilityId: number) {
    const { data, error } = await supabase
      .from('facility_blackout_periods')
      .select('*')
      .eq('facility_id', facilityId)
      .order('start_date');
    
    if (error) throw error;
    return data || [];
  },

  async createBlackout(blackout: any) {
    const { data, error } = await supabase
      .from('facility_blackout_periods')
      .insert(blackout)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async deleteBlackout(id: string) {
    const { error } = await supabase
      .from('facility_blackout_periods')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  }
};
