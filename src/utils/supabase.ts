
import { supabase } from '@/integrations/supabase/client';

export const facilityUtils = {
  getFacilities: async () => {
    const { data, error } = await supabase
      .from('facilities')
      .select('*')
      .order('name');
    
    if (error) throw error;
    return data || [];
  },

  getFacilityById: async (id: string | number) => {
    const facilityId = typeof id === 'string' ? parseInt(id, 10) : id;
    const { data, error } = await supabase
      .from('facilities')
      .select('*')
      .eq('id', facilityId)
      .single();
    
    if (error) throw error;
    return data;
  },

  createFacility: async (facility: any) => {
    const { data, error } = await supabase
      .from('facilities')
      .insert(facility)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  updateFacility: async (id: string | number, updates: any) => {
    const facilityId = typeof id === 'string' ? parseInt(id, 10) : id;
    const { data, error } = await supabase
      .from('facilities')
      .update(updates)
      .eq('id', facilityId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  deleteFacility: async (id: string | number) => {
    const facilityId = typeof id === 'string' ? parseInt(id, 10) : id;
    const { error } = await supabase
      .from('facilities')
      .delete()
      .eq('id', facilityId);
    
    if (error) throw error;
  }
};

export const zoneUtils = {
  getZonesByFacilityId: async (facilityId: number) => {
    // Mock implementation - replace with actual zone fetching
    return [];
  }
};

export const openingHoursUtils = {
  getOpeningHours: async (facilityId: number) => {
    const { data, error } = await supabase
      .from('facility_opening_hours')
      .select('*')
      .eq('facility_id', facilityId);
    
    if (error) throw error;
    return data || [];
  },

  saveOpeningHours: async (facilityId: number, hours: any[]) => {
    // Implementation for saving opening hours
    console.log('Saving opening hours for facility:', facilityId, hours);
    return true;
  }
};
