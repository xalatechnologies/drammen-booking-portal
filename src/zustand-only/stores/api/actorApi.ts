import { supabase } from '@/integrations/supabase/client';
import { GenericApi } from '@/zustand-only/types/api';
import { 
  Actor, 
  ActorFilter, 
  ActorCreateInput, 
  ActorUpdateInput,
  ActorType
} from '@/zustand-only/types/models';

/**
 * API adapter for Actor entity
 * Implements the GenericApi interface for actors (organizations, individuals)
 */
export class ActorApi implements GenericApi<Actor, ActorFilter, ActorCreateInput, ActorUpdateInput> {
  /**
   * Get a list of actors with optional filtering and pagination
   */
  async getList(params: {
    pagination?: { page: number; limit: number };
    filters?: ActorFilter;
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
      let query = supabase.from('actors');
      
      // Select with related data
      query = query.select(`
        *,
        members:actor_memberships(
          user:users(id, name, email)
        )
      `);
      
      // Apply filters
      if (filters.type) {
        query = query.eq('type', filters.type);
      }
      
      if (filters.status) {
        query = query.eq('status', filters.status);
      }
      
      // Apply search
      if (filters.search) {
        // Search in JSON fields requires special handling
        query = query.or(
          `name->>'en'.ilike.%${filters.search}%, name->>'no'.ilike.%${filters.search}%, code.ilike.%${filters.search}%`
        );
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
        data: data as Actor[],
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
      console.error('Error fetching actors:', error);
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
   * Get an actor by ID
   */
  async getById(id: string) {
    try {
      const { data, error } = await supabase
        .from('actors')
        .select(`
          *,
          members:actor_memberships(
            user:users(id, name, email)
          )
        `)
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      return { data: data as Actor };
    } catch (error) {
      console.error('Error fetching actor:', error);
      return { error: (error as Error).message };
    }
  }
  
  /**
   * Create a new actor
   */
  async create(input: ActorCreateInput) {
    try {
      const { data, error } = await supabase
        .from('actors')
        .insert({
          ...input,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        })
        .select();
      
      if (error) throw error;
      
      if (!data || data.length === 0) {
        throw new Error('No data returned after creating actor');
      }
      
      return { data: data[0] as Actor };
    } catch (error) {
      console.error('Error creating actor:', error);
      return { error: (error as Error).message };
    }
  }
  
  /**
   * Update an existing actor
   */
  async update(id: string, input: ActorUpdateInput) {
    try {
      const { data, error } = await supabase
        .from('actors')
        .update({
          ...input,
          updatedAt: new Date().toISOString()
        })
        .eq('id', id)
        .select();
      
      if (error) throw error;
      
      if (!data || data.length === 0) {
        throw new Error('No data returned after updating actor');
      }
      
      return { data: data[0] as Actor };
    } catch (error) {
      console.error('Error updating actor:', error);
      return { error: (error as Error).message };
    }
  }
  
  /**
   * Delete an actor
   */
  async delete(id: string) {
    try {
      // Check if actor has associated memberships
      const { count: membershipCount, error: membershipError } = await supabase
        .from('actor_memberships')
        .select('id', { count: 'exact', head: true })
        .eq('actorId', id);
      
      if (membershipError) throw membershipError;
      
      if (membershipCount && membershipCount > 0) {
        return { error: 'Cannot delete actor with associated memberships' };
      }
      
      // Check if actor has associated bookings
      const { count: bookingCount, error: bookingError } = await supabase
        .from('bookings')
        .select('id', { count: 'exact', head: true })
        .eq('actorId', id);
      
      if (bookingError) throw bookingError;
      
      if (bookingCount && bookingCount > 0) {
        return { error: 'Cannot delete actor with associated bookings' };
      }
      
      // Delete actor
      const { error } = await supabase
        .from('actors')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      return { data: true };
    } catch (error) {
      console.error('Error deleting actor:', error);
      return { error: (error as Error).message };
    }
  }
  
  /**
   * Add a member to an actor
   */
  async addMember(actorId: string, userId: string, role?: string) {
    try {
      const { data, error } = await supabase
        .from('actor_memberships')
        .insert({
          actorId,
          userId,
          role: role || 'member',
          createdAt: new Date().toISOString()
        })
        .select(`
          *,
          user:users(id, name, email)
        `);
      
      if (error) throw error;
      
      if (!data || data.length === 0) {
        throw new Error('No data returned after adding member');
      }
      
      return { data: data[0] };
    } catch (error) {
      console.error('Error adding member to actor:', error);
      return { error: (error as Error).message };
    }
  }
  
  /**
   * Remove a member from an actor
   */
  async removeMember(actorId: string, userId: string) {
    try {
      const { error } = await supabase
        .from('actor_memberships')
        .delete()
        .eq('actorId', actorId)
        .eq('userId', userId);
      
      if (error) throw error;
      
      return { data: true };
    } catch (error) {
      console.error('Error removing member from actor:', error);
      return { error: (error as Error).message };
    }
  }
  
  /**
   * Get actors by user ID
   */
  async getByUserId(userId: string) {
    try {
      const { data, error } = await supabase
        .from('actor_memberships')
        .select(`
          actor:actors(*)
        `)
        .eq('userId', userId);
      
      if (error) throw error;
      
      const actors = data.map(item => item.actor) as Actor[];
      
      return { data: actors };
    } catch (error) {
      console.error('Error fetching user actors:', error);
      return { error: (error as Error).message, data: [] };
    }
  }
}
