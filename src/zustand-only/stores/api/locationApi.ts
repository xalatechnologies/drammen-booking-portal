import { supabase } from '@/integrations/supabase/client';
import { GenericApi } from '@/zustand-only/types/entity';
import { 
  Location, 
  LocationFilter, 
  LocationCreateInput, 
  LocationUpdateInput 
} from '@/zustand-only/types/models';

/**
 * API adapter for Location entity
 * Implements the GenericApi interface for locations
 */
export class LocationApi implements GenericApi<Location, LocationFilter, LocationCreateInput, LocationUpdateInput> {
  /**
   * Get a list of locations with optional filtering and pagination
   */
  async getList(params: {
    pagination?: { page: number; limit: number };
    filters?: LocationFilter;
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
      let query = supabase.from('locations');
      
      // Select with related data
      query = query.select(`
        *,
        zones:zones(*)
      `);
      
      // Apply filters
      if (filters.code) {
        query = query.eq('code', filters.code);
      }
      
      // Apply search
      if (filters.search) {
        // Search in JSON fields requires special handling
        // This assumes 'name' is a JSONB column with language keys
        query = query.or(
          `name->>'en'.ilike.%${filters.search}%, name->>'no'.ilike.%${filters.search}%`
        );
      }
      
      // Apply location-based filtering if provided
      if (filters.nearLatitude && filters.nearLongitude && filters.maxDistance) {
        // This is a simplified approach - in a real app you'd use PostGIS or a similar solution
        // Here we're just filtering based on a bounding box
        const lat = filters.nearLatitude;
        const lng = filters.nearLongitude;
        const distance = filters.maxDistance; // in kilometers
        
        // Approximate degrees per km (very rough approximation)
        const degreesPerKm = 0.01;
        const latRange = distance * degreesPerKm;
        const lngRange = distance * degreesPerKm;
        
        query = query
          .gte('latitude', lat - latRange)
          .lte('latitude', lat + latRange)
          .gte('longitude', lng - lngRange)
          .lte('longitude', lng + lngRange);
      }
      
      // Apply ordering - special handling for JSON fields
      if (orderBy === 'name') {
        // Order by name in the current locale, defaulting to English
        // This assumes we have access to the current locale
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
        data: data as Location[],
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
      console.error('Error fetching locations:', error);
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
   * Get a location by ID
   */
  async getById(id: string) {
    try {
      const { data, error } = await supabase
        .from('locations')
        .select(`
          *,
          zones:zones(*),
          availabilityRules:availability_rules(*)
        `)
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      return { data: data as Location };
    } catch (error) {
      console.error('Error fetching location:', error);
      return { error: (error as Error).message };
    }
  }
  
  /**
   * Create a new location
   */
  async create(input: LocationCreateInput) {
    try {
      const { data, error } = await supabase
        .from('locations')
        .insert({
          ...input,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        })
        .select();
      
      if (error) throw error;
      
      if (!data || data.length === 0) {
        throw new Error('No data returned after creating location');
      }
      
      return { data: data[0] as Location };
    } catch (error) {
      console.error('Error creating location:', error);
      return { error: (error as Error).message };
    }
  }
  
  /**
   * Update an existing location
   */
  async update(id: string, input: LocationUpdateInput) {
    try {
      const { data, error } = await supabase
        .from('locations')
        .update({
          ...input,
          updatedAt: new Date().toISOString()
        })
        .eq('id', id)
        .select();
      
      if (error) throw error;
      
      if (!data || data.length === 0) {
        throw new Error('No data returned after updating location');
      }
      
      return { data: data[0] as Location };
    } catch (error) {
      console.error('Error updating location:', error);
      return { error: (error as Error).message };
    }
  }
  
  /**
   * Delete a location
   */
  async delete(id: string) {
    try {
      // Check if location has associated zones or bookings
      const { count: zoneCount, error: zoneError } = await supabase
        .from('zones')
        .select('id', { count: 'exact', head: true })
        .eq('locationId', id);
      
      if (zoneError) throw zoneError;
      
      if (zoneCount && zoneCount > 0) {
        return { error: 'Cannot delete location with associated zones' };
      }
      
      const { count: bookingCount, error: bookingError } = await supabase
        .from('bookings')
        .select('id', { count: 'exact', head: true })
        .eq('locationId', id);
      
      if (bookingError) throw bookingError;
      
      if (bookingCount && bookingCount > 0) {
        return { error: 'Cannot delete location with associated bookings' };
      }
      
      // Delete location
      const { error } = await supabase
        .from('locations')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      return { data: true };
    } catch (error) {
      console.error('Error deleting location:', error);
      return { error: (error as Error).message };
    }
  }
}
