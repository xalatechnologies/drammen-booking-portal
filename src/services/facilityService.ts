
import { supabase } from "@/integrations/supabase/client";

export const FacilityService = {
  getFacilities: async (pagination?: any, filters?: any, sort?: any) => {
    console.log('FacilityService.getFacilities - Called with:', { pagination, filters, sort });
    
    try {
      let query = supabase
        .from('app_locations')
        .select('*')
        .order('created_at', { ascending: false });

      // Apply pagination if provided
      if (pagination) {
        const from = (pagination.page - 1) * pagination.limit;
        const to = from + pagination.limit - 1;
        query = query.range(from, to);
      }

      const { data, error } = await query;
      
      if (error) throw new Error(error.message);

      return {
        success: true,
        data: {
          data: data || [],
          pagination: {
            page: pagination?.page || 1,
            limit: pagination?.limit || 20,
            total: data?.length || 0,
            totalPages: 1,
            hasNext: false,
            hasPrev: false
          }
        }
      };
    } catch (error: any) {
      console.error('FacilityService.getFacilities - Error:', error);
      return {
        success: false,
        error: { message: error.message }
      };
    }
  },
  
  getFacilityById: async (id: string) => {
    console.log('FacilityService.getFacilityById - Called with ID:', id);
    
    try {
      const { data, error } = await supabase
        .from('app_locations')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) throw new Error(error.message);

      return {
        success: true,
        data
      };
    } catch (error: any) {
      console.error('FacilityService.getFacilityById - Error:', error);
      return {
        success: false,
        error: { message: error.message }
      };
    }
  },
  
  createFacility: async (data: any) => {
    try {
      const { data: result, error } = await supabase
        .from('app_locations')
        .insert(data)
        .select()
        .single();

      if (error) throw new Error(error.message);

      return {
        success: true,
        data: result
      };
    } catch (error: any) {
      return {
        success: false,
        error: { message: error.message }
      };
    }
  },
  
  updateFacility: async (id: string, data: any) => {
    try {
      const { data: result, error } = await supabase
        .from('app_locations')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) throw new Error(error.message);

      return {
        success: true,
        data: result
      };
    } catch (error: any) {
      return {
        success: false,
        error: { message: error.message }
      };
    }
  },
  
  deleteFacility: async (id: string) => {
    try {
      const { error } = await supabase
        .from('app_locations')
        .delete()
        .eq('id', id);

      if (error) throw new Error(error.message);

      return {
        success: true
      };
    } catch (error: any) {
      return {
        success: false,
        error: { message: error.message }
      };
    }
  },
  
  getFacilitiesByType: async (type: string) => {
    try {
      const { data, error } = await supabase
        .from('app_locations')
        .select('*')
        .eq('location_type', type);

      if (error) throw new Error(error.message);
      return { success: true, data };
    } catch (error: any) {
      return { success: false, error: { message: error.message } };
    }
  },
  
  getFacilitiesByArea: async (area: string) => {
    try {
      const { data, error } = await supabase
        .from('app_locations')
        .select('*')
        .ilike('address', `%${area}%`);

      if (error) throw new Error(error.message);
      return { success: true, data };
    } catch (error: any) {
      return { success: false, error: { message: error.message } };
    }
  },
  
  getZonesByFacilityId: async (facilityId: string) => {
    console.log('FacilityService.getZonesByFacilityId - Called with facility ID:', facilityId);
    
    try {
      const { data, error } = await supabase
        .from('app_zones')
        .select('*')
        .eq('location_id', facilityId);

      if (error) throw new Error(error.message);

      return {
        success: true,
        data: data || []
      };
    } catch (error: any) {
      console.error('FacilityService.getZonesByFacilityId - Error:', error);
      return {
        success: false,
        error: { message: error.message }
      };
    }
  },
  
  getZoneById: async (zoneId: string) => {
    console.log('FacilityService.getZoneById - Called with zone ID:', zoneId);
    
    try {
      const { data, error } = await supabase
        .from('app_zones')
        .select('*')
        .eq('id', zoneId)
        .maybeSingle();

      if (error) throw new Error(error.message);

      return {
        success: true,
        data
      };
    } catch (error: any) {
      return {
        success: false,
        error: { message: error.message }
      };
    }
  }
};
