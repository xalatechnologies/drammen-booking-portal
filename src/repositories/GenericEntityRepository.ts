import { BaseRepository } from '@/dal/BaseRepository';
import { RepositoryResponse, PaginationParams } from '@/types/api';
import { GENERIC_ENTITY_URL, SUPABASE_ANON_KEY } from '@/config/env';
import { supabase } from '@/integrations/supabase/client';
import { PostgrestError } from '@supabase/supabase-js';

/**
 * Generic Entity Repository
 * 
 * A flexible repository that works with the generic-entity Edge Function
 * to provide CRUD operations for any entity type.
 */
export class GenericEntityRepository<T extends Record<string, any>> extends BaseRepository<T> {
  private table: string;
  private related?: string;
  private idField: string;
  private statusField?: string;
  private activeValue?: string;
  
  /**
   * Helper method to get the Edge Function URL
   */
  private getEdgeFunctionUrl(): string {
    return GENERIC_ENTITY_URL;
  }
  
  /**
   * Helper method to serialize parameters for URL
   */
  private serializeParams(params: Record<string, any>): Record<string, string> {
    const result: Record<string, string> = {};
    
    for (const [key, value] of Object.entries(params)) {
      if (value === undefined || value === null) continue;
      
      if (typeof value === 'object') {
        result[key] = JSON.stringify(value);
      } else {
        result[key] = String(value);
      }
    }
    
    return result;
  }

  /**
   * Create a new GenericEntityRepository
   * 
   * @param table The database table name
   * @param options Configuration options
   */
  constructor(
    table: string,
    options: {
      related?: string | string[];
      idField?: string;
      statusField?: string;
      activeValue?: string;
    } = {}
  ) {
    super();
    this.table = table;
    this.related = Array.isArray(options.related)
      ? options.related.join(',')
      : options.related;
    this.idField = options.idField || 'id';
    this.statusField = options.statusField;
    this.activeValue = options.activeValue;
  }

  /**
   * Get a list of entities with optional pagination and filters
   */
  async findAll(pagination?: PaginationParams, filters?: any): Promise<RepositoryResponse<T[]>> {
    const params = {
      table: this.table,
      ...(this.related ? { related: this.related } : {}),
      ...(pagination ? { page: pagination.page, limit: pagination.limit } : {}),
      ...filters
    };
    
    return this.fetchFromEdgeFunction<T[]>('GET', '', undefined, params);
  }

  /**
   * Get a single entity by ID
   */
  async findById(id: string): Promise<RepositoryResponse<T | null>> {
    const params = {
      table: this.table,
      ...(this.related ? { related: this.related } : {})
    };
    
    return this.fetchFromEdgeFunction<T | null>('GET', `/${id}`, undefined, params);
  }

  /**
   * Create a new entity
   */
  async create(data: Omit<T, 'id' | 'created_at' | 'updated_at'>): Promise<RepositoryResponse<T | null>> {
    const params = {
      table: this.table
    };
    
    return this.fetchFromEdgeFunction<T | null>('POST', '', data, params);
  }

  /**
   * Update an existing entity
   */
  async update(id: string, data: Partial<Omit<T, 'id' | 'created_at'>>): Promise<RepositoryResponse<T | null>> {
    const params = {
      table: this.table
    };
    
    return this.fetchFromEdgeFunction<T | null>('PUT', `/${id}`, data, params);
  }

  /**
   * Delete an entity (soft delete if statusField is provided)
   */
  async delete(id: string): Promise<RepositoryResponse<boolean>> {
    const params = {
      table: this.table,
      ...(this.statusField ? { statusField: this.statusField } : {})
    };
    
    return this.fetchFromEdgeFunction<boolean>('DELETE', `/${id}`, undefined, params);
  }
  
  /**
   * Generic method to fetch data from the edge function with fallback to direct Supabase client
   */
  private async fetchFromEdgeFunction<R>(method: string, path: string = '', body?: any, params?: Record<string, any>): Promise<RepositoryResponse<R>> {
    try {
      const url = new URL(`${this.getEdgeFunctionUrl()}${path}`);
      
      // Add query parameters
      if (params) {
        const serializedParams = this.serializeParams(params);
        Object.entries(serializedParams).forEach(([key, value]) => {
          url.searchParams.append(key, value);
        });
      }
      
      try {
        // Get the current session to retrieve the access token
        const { data } = await supabase.auth.getSession();
        
        // Create a new Supabase client with the same configuration as our main client
        // This ensures we're using the same authentication mechanism
        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
        };
        
        // Set the Authorization header with the JWT token if available
        if (data.session?.access_token) {
          headers['Authorization'] = `Bearer ${data.session.access_token}`;
        }
        
        // Always include the apikey header
        headers['apikey'] = SUPABASE_ANON_KEY;
        
        // Add client info header that Supabase expects
        headers['x-client-info'] = 'supabase-js/2.0.0';
        
        const response = await fetch(url.toString(), {
          method,
          headers,
          body: body ? JSON.stringify(body) : undefined,
          // Include credentials to ensure cookies are sent
          credentials: 'include',
        });
        
        const data = await response.json();
        
        if (data.code === 'NOT_FOUND' && data.message === 'Requested function was not found') {
          // Edge function not found, use fallback
          console.warn('Edge function not found, using direct Supabase client fallback');
          return this.fallbackToDirectSupabase<R>(method, path, body, params);
        }
        
        if (!response.ok) {
          return {
            error: data.message || 'Unknown error',
            data: null as unknown as R,
          };
        }
        
        return {
          data: data.data,
          meta: data.meta,
        };
      } catch (fetchError) {
        // Network error or other fetch issue, try fallback
        console.warn('Edge function fetch error, using direct Supabase client fallback', fetchError);
        return this.fallbackToDirectSupabase<R>(method, path, body, params);
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        data: null as unknown as R,
      };
    }
  }
  
  /**
   * Fallback implementation using direct Supabase client calls
   * Used when the edge function is not available
   */
  private async fallbackToDirectSupabase<R>(method: string, path: string = '', body?: any, params?: Record<string, any>): Promise<RepositoryResponse<R>> {
    try {
      // Extract ID from path if present
      const id = path ? path.replace('/', '') : undefined;
      
      // Get table and other params
      const table = this.table;
      const related = params?.related?.split(',') || [];
      const includeInactive = params?.includeInactive === 'true';
      const orderBy = params?.orderBy;
      const orderDirection = params?.orderDirection || 'asc';
      const page = params?.page ? parseInt(params.page as string) : undefined;
      const limit = params?.limit ? parseInt(params.limit as string) : undefined;
      
      // Remove known params to isolate filters
      const knownParams = ['table', 'related', 'idField', 'statusField', 'activeValue', 'includeInactive', 'orderBy', 'orderDirection', 'page', 'limit'];
      const filters: Record<string, any> = {};
      
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (!knownParams.includes(key)) {
            // Try to parse JSON values
            try {
              filters[key] = typeof value === 'string' ? JSON.parse(value) : value;
            } catch {
              filters[key] = value;
            }
          }
        });
      }
      
      // Build query
      let query = supabase.from(table);
      
      // Add related tables if specified
      if (related.length > 0) {
        query = query.select(`*, ${related.map(rel => rel.trim()).join(', ')}`);
      } else {
        query = query.select('*');
      }
      
      // Apply status filter if needed
      if (this.statusField && !includeInactive) {
        query = query.eq(this.statusField, this.activeValue || 'active');
      }
      
      // Apply custom filters
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (typeof value === 'object') {
            // Handle range filters, etc.
            if (value.gt) query = query.gt(key, value.gt);
            if (value.gte) query = query.gte(key, value.gte);
            if (value.lt) query = query.lt(key, value.lt);
            if (value.lte) query = query.lte(key, value.lte);
            if (value.in) query = query.in(key, value.in);
          } else {
            // Simple equality filter
            query = query.eq(key, value);
          }
        }
      });
      
      // Apply ordering
      if (orderBy) {
        query = query.order(orderBy, { ascending: orderDirection === 'asc' });
      }
      
      // Apply pagination
      if (page !== undefined && limit !== undefined) {
        const start = (page - 1) * limit;
        const end = start + limit - 1;
        query = query.range(start, end);
      }
      
      // Execute the appropriate operation based on method and path
      let result;
      
      switch (method) {
        case 'GET':
          if (id) {
            // Get by ID
            result = await query.eq(this.idField, id).single();
          } else {
            // Get list
            result = await query;
          }
          break;
          
        case 'POST':
          // Create
          result = await supabase.from(table).insert(body).select();
          break;
          
        case 'PUT':
          // Update
          if (!id) throw new Error('ID is required for update operations');
          result = await supabase.from(table).update(body).eq(this.idField, id).select();
          break;
          
        case 'DELETE':
          // Delete
          if (!id) throw new Error('ID is required for delete operations');
          result = await supabase.from(table).delete().eq(this.idField, id);
          break;
          
        default:
          throw new Error(`Unsupported method: ${method}`);
      }
      
      if (result.error) {
        return {
          error: result.error.message,
          data: null as unknown as R,
        };
      }
      
      // For GET list, include count for pagination
      let meta;
      if (method === 'GET' && !id && page !== undefined) {
        const countResult = await supabase.from(table).select('*', { count: 'exact', head: true });
        meta = {
          pagination: {
            page,
            limit: limit || 10,
            total: countResult.count || 0,
          }
        };
      }
      
      return {
        data: (id && method === 'GET' ? result.data : result.data || []) as unknown as R,
        meta,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        data: null as unknown as R,
      };
    }
  }
}
