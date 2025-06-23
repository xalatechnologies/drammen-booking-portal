import { BaseRepository } from './BaseRepository';
import { callEdgeFunction } from '@/integrations/supabase/edgeFunctions';
import { PaginationParams, RepositoryResponse } from '@/types/api';

/**
 * Base repository for interacting with Supabase Edge Functions
 * Extends BaseRepository to provide a consistent interface for Edge Function calls
 */
export abstract class BaseEdgeFunctionRepository<T extends Record<string, any>> extends BaseRepository<T> {
  protected abstract functionName: string;
  
  /**
   * Find all items with optional pagination and ordering
   * @param pagination Pagination parameters
   * @param orderBy Field to order by
   * @param orderDirection Order direction
   * @returns Repository response with array of items
   */
  async findAll(
    pagination?: PaginationParams,
    orderBy?: string,
    orderDirection: 'asc' | 'desc' = 'asc'
  ): Promise<RepositoryResponse<T[]>> {
    try {
      console.log(`${this.constructor.name}.findAll - Called with pagination:`, pagination);
      
      const response = await callEdgeFunction<T[]>(
        this.functionName, 
        'GET', 
        { pagination, orderBy, orderDirection }
      );
      
      if (!response.success) {
        return {
          data: [],
          error: response.error?.message || 'Failed to fetch items'
        };
      }
      
      return {
        data: response.data || []
      };
    } catch (error: any) {
      console.error(`${this.constructor.name}.findAll - Exception:`, error);
      return {
        data: [],
        error: error.message || 'Failed to fetch items'
      };
    }
  }
  
  /**
   * Find an item by ID
   * @param id Item ID
   * @returns Repository response with item or null
   */
  async findById(id: string): Promise<RepositoryResponse<T | null>> {
    try {
      console.log(`${this.constructor.name}.findById - Called with ID:`, id);
      
      const response = await callEdgeFunction<T>(
        this.functionName, 
        'GET', 
        { id }
      );
      
      if (!response.success) {
        return {
          data: null,
          error: response.error?.message || `Failed to fetch item with ID ${id}`
        };
      }
      
      return {
        data: response.data || null
      };
    } catch (error: any) {
      console.error(`${this.constructor.name}.findById - Exception:`, error);
      return {
        data: null,
        error: error.message || `Failed to fetch item with ID ${id}`
      };
    }
  }
  
  /**
   * Create a new item
   * @param data Item data
   * @returns Repository response with created item or null
   */
  async create(data: Omit<T, 'id' | 'created_at' | 'updated_at'>): Promise<RepositoryResponse<T | null>> {
    try {
      console.log(`${this.constructor.name}.create - Called with data:`, data);
      
      // Sanitize data before sending to Edge Function
      const sanitizedData = this.sanitizeData(data);
      console.log(`${this.constructor.name}.create - Sanitized data:`, sanitizedData);
      
      const response = await callEdgeFunction<T>(
        this.functionName, 
        'POST', 
        sanitizedData
      );
      
      if (!response.success) {
        return {
          data: null,
          error: response.error?.message || 'Failed to create item'
        };
      }
      
      return {
        data: response.data || null
      };
    } catch (error: any) {
      console.error(`${this.constructor.name}.create - Exception:`, error);
      return {
        data: null,
        error: error.message || 'Failed to create item'
      };
    }
  }
  
  /**
   * Update an existing item
   * @param id Item ID
   * @param data Updated item data
   * @returns Repository response with updated item or null
   */
  async update(id: string, data: Partial<Omit<T, 'id' | 'created_at'>>): Promise<RepositoryResponse<T | null>> {
    try {
      console.log(`${this.constructor.name}.update - Called with ID:`, id, 'and data:', data);
      
      // Sanitize data before sending to Edge Function
      const sanitizedData = this.sanitizeData(data);
      console.log(`${this.constructor.name}.update - Sanitized data:`, sanitizedData);
      
      const response = await callEdgeFunction<T>(
        this.functionName, 
        'PUT', 
        { id, ...sanitizedData }
      );
      
      if (!response.success) {
        return {
          data: null,
          error: response.error?.message || `Failed to update item with ID ${id}`
        };
      }
      
      return {
        data: response.data || null
      };
    } catch (error: any) {
      console.error(`${this.constructor.name}.update - Exception:`, error);
      return {
        data: null,
        error: error.message || `Failed to update item with ID ${id}`
      };
    }
  }
  
  /**
   * Delete an item
   * @param id Item ID
   * @returns Repository response with success status
   */
  async delete(id: string): Promise<RepositoryResponse<boolean>> {
    try {
      console.log(`${this.constructor.name}.delete - Called with ID:`, id);
      
      const response = await callEdgeFunction<void>(
        this.functionName, 
        'DELETE', 
        { id }
      );
      
      if (!response.success) {
        return {
          data: false,
          error: response.error?.message || `Failed to delete item with ID ${id}`
        };
      }
      
      return {
        data: true
      };
    } catch (error: any) {
      console.error(`${this.constructor.name}.delete - Exception:`, error);
      return {
        data: false,
        error: error.message || `Failed to delete item with ID ${id}`
      };
    }
  }
  
  /**
   * Custom method to call Edge Function with any method and parameters
   * @param method HTTP method
   * @param params Parameters
   * @returns Repository response with result
   */
  async customCall<R>(method: 'GET' | 'POST' | 'PUT' | 'DELETE', params?: Record<string, any>): Promise<RepositoryResponse<R>> {
    try {
      console.log(`${this.constructor.name}.customCall - Called with method:`, method, 'and params:', params);
      
      const response = await callEdgeFunction<R>(
        this.functionName, 
        method, 
        params
      );
      
      if (!response.success) {
        return {
          data: null as unknown as R,
          error: response.error?.message || 'Failed to execute custom call'
        };
      }
      
      return {
        data: response.data as R
      };
    } catch (error: any) {
      console.error(`${this.constructor.name}.customCall - Exception:`, error);
      return {
        data: null as unknown as R,
        error: error.message || 'Failed to execute custom call'
      };
    }
  }
  
  /**
   * Hook for subclasses to sanitize data before sending to Edge Function
   * Override this in subclasses to handle specific data sanitization needs
   * @param data Data to sanitize
   * @returns Sanitized data
   */
  protected sanitizeData(data: Record<string, any>): Record<string, any> {
    // Default implementation just returns the data as is
    // Subclasses should override this to handle specific sanitization needs
    return data;
  }
}
