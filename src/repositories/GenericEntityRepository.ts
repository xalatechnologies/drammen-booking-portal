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
        // First try to get a fresh session
        await supabase.auth.refreshSession();
        const { data: sessionData } = await supabase.auth.getSession();
        
        // Prepare headers exactly as the edge function expects them
        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
        };
        
        // IMPORTANT: The order and format of these headers matter for Supabase Edge Functions
        
        // 1. Set the apikey header - this is required for all requests
        headers['apikey'] = SUPABASE_ANON_KEY;
        
        // 2. Set the Authorization header - this is used by the edge function's createSupabaseClient
        if (sessionData?.session?.access_token) {
          // When authenticated, use the JWT token
          headers['Authorization'] = `Bearer ${sessionData.session.access_token}`;
        } else {
          // For anonymous access, use the anon key
          headers['Authorization'] = `Bearer ${SUPABASE_ANON_KEY}`;
        }
        
        // 3. Add the client info header that Supabase expects
        headers['x-client-info'] = 'supabase-js/2.0.0';
        
        console.log('[EdgeFunction] Sending request with headers:', JSON.stringify(headers, null, 2));
        
        const response = await fetch(url.toString(), {
          method,
          headers,
          body: body ? JSON.stringify(body) : undefined,
        });
        
        console.log(`[EdgeFunction] Response status: ${response.status} ${response.statusText}`);
        
        // Log response headers for debugging
        const responseHeaders: Record<string, string> = {};
        response.headers.forEach((value, key) => {
          responseHeaders[key] = value;
        });
        console.log('[EdgeFunction] Response headers:', JSON.stringify(responseHeaders, null, 2));
        
        // Clone the response for debugging
        const responseClone = response.clone();
        const responseText = await responseClone.text();
        console.log('[EdgeFunction] Response body:', responseText);
        
        // Try to parse the response as JSON
        let responseData;
        try {
          responseData = JSON.parse(responseText);
        } catch (parseError) {
          console.error('[EdgeFunction] Failed to parse response as JSON:', parseError);
          return {
            data: null,
            error: `Failed to parse response: ${parseError.message}. Raw response: ${responseText.substring(0, 100)}...`
          };
        }
        
        // Handle error responses
        if (!response.ok) {
          console.error(`[EdgeFunction] Error ${response.status}: ${JSON.stringify(responseData)}`);
          
          // If we have a 401 error, it's likely an authentication issue
          if (response.status === 401) {
            console.log('[EdgeFunction] 401 Unauthorized - Attempting to refresh session...');
            
            // Try to refresh the session and retry the request
            try {
              const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();
              console.log('[EdgeFunction] Session refresh result:', refreshError ? 'Failed' : 'Success');
              
              if (!refreshError && refreshData?.session) {
                console.log('[EdgeFunction] Session refreshed successfully, retrying request...');
                // If refresh was successful, retry the request recursively
                return this.fetchFromEdgeFunction<R>(method, path, body, params);
              } else {
                console.error('[EdgeFunction] Failed to refresh session:', refreshError);
              }
            } catch (refreshError) {
              console.error('[EdgeFunction] Error during session refresh:', refreshError);
            }
            
            // If we're still here, refresh didn't work, try to get a new session directly
            try {
              const { data: authData } = await supabase.auth.getSession();
              if (authData?.session) {
                console.log('[EdgeFunction] Got fresh session, retrying with new token...');
                return this.fetchFromEdgeFunction<R>(method, path, body, params);
              }
            } catch (authError) {
              console.error('[EdgeFunction] Error getting fresh session:', authError);
            }
          }
          
          // Return a structured error response
          return {
            data: null,
            error: responseData.error?.message || 
                   responseData.error?.code || 
                   `HTTP error ${response.status}: ${response.statusText}`
          };
        }
        
        // Return successful response
        console.log('[EdgeFunction] Request successful');
        return {
          data: responseData.data,
          error: null
        };
      } catch (fetchError) {
        // Network error or other fetch issue, try fallback
        console.warn('Edge function fetch error, using direct Supabase client fallback', fetchError);
        return this.fallbackToDirectSupabase<R>(method, path, body, params);
      }
    } catch (error) {
      return {
        data: null as unknown as R,
        error: error instanceof Error ? error.message : 'Unknown error'
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
        data: null as unknown as R,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}
