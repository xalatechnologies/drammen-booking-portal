import { supabase } from '@/integrations/supabase/client';
import { GenericApi } from '@/zustand-only/types/entity';
import { 
  Zone, 
  ZoneFilter, 
  ZoneCreateInput, 
  ZoneUpdateInput 
} from '@/zustand-only/types/models';

/**
 * API adapter for Zone entity
 * Implements the GenericApi interface for zones
 */
export class ZoneApi implements GenericApi<Zone, ZoneFilter, ZoneCreateInput, ZoneUpdateInput> {
  /**
   * Get a list of zones with optional filtering and pagination
   */
  async getList(params: {
    pagination?: { page: number; limit: number };
    filters?: ZoneFilter;
    orderBy?: string;
    orderDirection?: 'asc' | 'desc';
  }) {
    try {
      const { 
        pagination = { page: 1, limit: 10 }, 
        filters = {}, 
        orderBy = 'name', 
        orderDirection = 'asc' 
      } = params;
      
      // Calculate range for pagination
      const from = (pagination.page - 1) * pagination.limit;
      const to = from + pagination.limit - 1;
      
      // Build query
      let query = supabase.from('zones');
      
      // Select with related data
      query = query.select(`
        *,
        location:locations(*),
        availabilityRules:availability_rules(*)
      `);
      
      // Apply filters
      if (filters.locationId) {
        query = query.eq('locationId', filters.locationId);
      }
      
      if (filters.code) {
        query = query.eq('code', filters.code);
      }
      
      if (filters.status) {
        query = query.eq('status', filters.status);
      }
      
      // Apply search
      if (filters.search) {
        // Search in JSON fields requires special handling
        query = query.or(
          `name->>'en'.ilike.%${filters.search}%, name->>'no'.ilike.%${filters.search}%`
        );
      }
      
      // Apply capacity filter
      if (filters.minCapacity) {
        query = query.gte('capacity', filters.minCapacity);
      }
      
      if (filters.maxCapacity) {
        query = query.lte('capacity', filters.maxCapacity);
      }
      
      // Apply ordering - special handling for JSON fields
      if (orderBy === 'name') {
        // Order by name in the current locale, defaulting to English
        const locale = 'no'; // Should come from a locale store or similar
        query = query.order(`name->>'${locale}'`, { ascending: orderDirection === 'asc' });
      } else {
        query = query.order(orderBy, { ascending: orderDirection === 'asc' });
      }
      
      // Apply pagination
      query = query.range(from, to);
      
      // Execute query
      const { data, error, count } = await query;
      
      if (error) throw error;
      
      return {
        data: data as Zone[],
        meta: {
          pagination: {
            page: pagination.page,
            limit: pagination.limit,
            total: count || 0,
            totalPages: count ? Math.ceil(count / pagination.limit) : 0
          }
        }
      };
    } catch (error) {
      console.error('Error fetching zones:', error);
      return {
        data: [],
        error: (error as Error).message,
        meta: {
          pagination: {
            page: params.pagination?.page || 1,
            limit: params.pagination?.limit || 10,
            total: 0,
            totalPages: 0
          }
        }
      };
    }
  }
  
  /**
   * Get a zone by ID
   */
  async getById(id: string) {
    try {
      const { data, error } = await supabase
        .from('zones')
        .select(`
          *,
          location:locations(*),
          availabilityRules:availability_rules(*),
          priceRules:price_rules(*)
        `)
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      return { data: data as Zone };
    } catch (error) {
      console.error('Error fetching zone:', error);
      return { error: (error as Error).message };
    }
  }
  
  /**
   * Create a new zone
   */
  async create(input: ZoneCreateInput) {
    try {
      const { data, error } = await supabase
        .from('zones')
        .insert({
          ...input,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        })
        .select();
      
      if (error) throw error;
      
      if (!data || data.length === 0) {
        throw new Error('No data returned after creating zone');
      }
      
      return { data: data[0] as Zone };
    } catch (error) {
      console.error('Error creating zone:', error);
      return { error: (error as Error).message };
    }
  }
  
  /**
   * Update an existing zone
   */
  async update(id: string, input: ZoneUpdateInput) {
    try {
      const { data, error } = await supabase
        .from('zones')
        .update({
          ...input,
          updatedAt: new Date().toISOString()
        })
        .eq('id', id)
        .select();
      
      if (error) throw error;
      
      if (!data || data.length === 0) {
        throw new Error('No data returned after updating zone');
      }
      
      return { data: data[0] as Zone };
    } catch (error) {
      console.error('Error updating zone:', error);
      return { error: (error as Error).message };
    }
  }
  
  /**
   * Delete a zone
   */
  async delete(id: string) {
    try {
      // Check if zone has associated bookings
      const { count: bookingCount, error: bookingError } = await supabase
        .from('bookings')
        .select('id', { count: 'exact', head: true })
        .eq('zoneId', id);
      
      if (bookingError) throw bookingError;
      
      if (bookingCount && bookingCount > 0) {
        return { error: 'Cannot delete zone with associated bookings' };
      }
      
      // Delete zone
      const { error } = await supabase
        .from('zones')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      return { data: true };
    } catch (error) {
      console.error('Error deleting zone:', error);
      return { error: (error as Error).message };
    }
  }
  
  /**
   * Check zone availability for a given time period
   */
  async checkAvailability(zoneId: string, startDateTime: string, endDateTime: string) {
    try {
      // Check for overlapping bookings
      const { data: bookings, error: bookingError } = await supabase
        .from('bookings')
        .select('id')
        .eq('zoneId', zoneId)
        .lte('startDateTime', endDateTime)
        .gte('endDateTime', startDateTime)
        .not('status', 'eq', 'CANCELLED');
      
      if (bookingError) throw bookingError;
      
      // Zone is available if there are no overlapping bookings
      const isAvailable = !bookings || bookings.length === 0;
      
      return { 
        data: {
          isAvailable,
          conflictingBookings: bookings || []
        }
      };
    } catch (error) {
      console.error('Error checking zone availability:', error);
      return { error: (error as Error).message };
    }
  }
}
