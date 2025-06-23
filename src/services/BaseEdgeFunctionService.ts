import { ApiResponse } from '@/types/api';
import { callEdgeFunction } from '@/integrations/supabase/edgeFunctions';

/**
 * Base class for services that interact with Supabase Edge Functions
 * Provides standardized methods for CRUD operations with retry logic and error handling
 */
export abstract class BaseEdgeFunctionService<T> {
  protected abstract functionName: string;
  
  /**
   * Get all items or items filtered by criteria
   * @param params Parameters to pass to the Edge Function
   * @returns ApiResponse with array of items
   */
  async getAll(params?: Record<string, any>): Promise<ApiResponse<T[]>> {
    console.log(`${this.constructor.name}.getAll - Called with params:`, params);
    
    const response = await callEdgeFunction<T[]>(this.functionName, 'GET', params);
    
    if (!response.success) {
      console.error(`${this.constructor.name}.getAll - Failed:`, response.error);
      return response;
    }
    
    console.log(`${this.constructor.name}.getAll - Success, items:`, response.data?.length || 0);
    return {
      success: true,
      data: response.data || []
    };
  }
  
  /**
   * Get a single item by ID
   * @param id Item ID
   * @param params Additional parameters
   * @returns ApiResponse with single item
   */
  async getById(id: string | number, params?: Record<string, any>): Promise<ApiResponse<T>> {
    console.log(`${this.constructor.name}.getById - Called with ID:`, id);
    
    const response = await callEdgeFunction<T>(
      this.functionName, 
      'GET', 
      { id, ...(params || {}) }
    );
    
    if (!response.success) {
      console.error(`${this.constructor.name}.getById - Failed:`, response.error);
      return response;
    }
    
    console.log(`${this.constructor.name}.getById - Success:`, response.data);
    return response;
  }
  
  /**
   * Create a new item
   * @param data Item data
   * @returns ApiResponse with created item
   */
  async create(data: Partial<T>): Promise<ApiResponse<T>> {
    console.log(`${this.constructor.name}.create - Called with data:`, data);
    
    // Sanitize data before sending to Edge Function
    const sanitizedData = this.sanitizeData(data);
    console.log(`${this.constructor.name}.create - Sanitized data:`, sanitizedData);
    
    const response = await callEdgeFunction<T>(this.functionName, 'POST', sanitizedData);
    
    if (!response.success) {
      console.error(`${this.constructor.name}.create - Failed:`, response.error);
      return response;
    }
    
    console.log(`${this.constructor.name}.create - Success:`, response.data);
    return response;
  }
  
  /**
   * Update an existing item
   * @param id Item ID
   * @param data Updated item data
   * @returns ApiResponse with updated item
   */
  async update(id: string | number, data: Partial<T>): Promise<ApiResponse<T>> {
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
      console.error(`${this.constructor.name}.update - Failed:`, response.error);
      return response;
    }
    
    console.log(`${this.constructor.name}.update - Success:`, response.data);
    return response;
  }
  
  /**
   * Delete an item
   * @param id Item ID
   * @returns ApiResponse with success status
   */
  async delete(id: string | number): Promise<ApiResponse<void>> {
    console.log(`${this.constructor.name}.delete - Called with ID:`, id);
    
    const response = await callEdgeFunction<void>(
      this.functionName, 
      'DELETE', 
      { id }
    );
    
    if (!response.success) {
      console.error(`${this.constructor.name}.delete - Failed:`, response.error);
      return response;
    }
    
    console.log(`${this.constructor.name}.delete - Success`);
    return { success: true };
  }
  
  /**
   * Custom method to call Edge Function with any method and parameters
   * @param method HTTP method
   * @param params Parameters
   * @returns ApiResponse with result
   */
  async customCall<R>(method: 'GET' | 'POST' | 'PUT' | 'DELETE', params?: Record<string, any>): Promise<ApiResponse<R>> {
    console.log(`${this.constructor.name}.customCall - Called with method:`, method, 'and params:', params);
    
    const response = await callEdgeFunction<R>(this.functionName, method, params);
    
    if (!response.success) {
      console.error(`${this.constructor.name}.customCall - Failed:`, response.error);
      return response;
    }
    
    console.log(`${this.constructor.name}.customCall - Success:`, response.data);
    return response;
  }
  
  /**
   * Hook for subclasses to sanitize data before sending to Edge Function
   * Override this in subclasses to handle specific data sanitization needs
   * @param data Data to sanitize
   * @returns Sanitized data
   */
  protected sanitizeData(data: Partial<T>): Record<string, any> {
    // Default implementation just returns the data as is
    // Subclasses should override this to handle specific sanitization needs
    return data as Record<string, any>;
  }
}
