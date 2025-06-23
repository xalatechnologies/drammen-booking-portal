
import { BaseRepository } from '@/dal/BaseRepository';
import { RepositoryResponse, PaginationParams } from '@/types/api';
import { supabase } from '@/integrations/supabase/client';

/**
 * Simplified Generic Entity Repository
 * 
 * A basic repository that uses direct Supabase client calls
 * to avoid complex TypeScript issues with the edge function approach.
 */
export class GenericEntityRepository<T extends Record<string, any>> extends BaseRepository<T> {
  private table: string;
  private related?: string;
  private idField: string;
  private statusField?: string;
  private activeValue?: string;
  
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
    try {
      // Extract skipRelated from filters if present
      const { skipRelated, ...otherFilters } = filters || {};
      
      // Build query using .from() with proper type assertion
      let query = supabase.from(this.table as any);
      
      // Add related tables if specified
      if (this.related && !skipRelated) {
        query = query.select(`*, ${this.related}`);
      } else {
        query = query.select('*');
      }
      
      // Apply status filter if needed
      if (this.statusField && !otherFilters.includeInactive) {
        query = query.eq(this.statusField, this.activeValue || 'active');
      }
      
      // Apply pagination
      if (pagination && pagination.page && pagination.limit) {
        const start = (pagination.page - 1) * pagination.limit;
        const end = start + pagination.limit - 1;
        query = query.range(start, end);
      }
      
      const result = await query;
      
      if (result.error) {
        return {
          error: result.error.message,
          data: null as unknown as T[],
        };
      }
      
      return {
        data: result.data as T[],
        error: null,
      };
    } catch (error) {
      return {
        data: null as unknown as T[],
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Get a single entity by ID
   */
  async findById(id: string): Promise<RepositoryResponse<T | null>> {
    try {
      let query = supabase.from(this.table as any);
      
      if (this.related) {
        query = query.select(`*, ${this.related}`);
      } else {
        query = query.select('*');
      }
      
      const result = await query.eq(this.idField, id).single();
      
      if (result.error) {
        return {
          error: result.error.message,
          data: null,
        };
      }
      
      return {
        data: result.data as T,
        error: null,
      };
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Create a new entity
   */
  async create(data: Omit<T, 'id' | 'created_at' | 'updated_at'>): Promise<RepositoryResponse<T | null>> {
    try {
      const result = await supabase.from(this.table as any).insert(data).select();
      
      if (result.error) {
        return {
          error: result.error.message,
          data: null,
        };
      }
      
      return {
        data: result.data?.[0] as T || null,
        error: null,
      };
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Update an existing entity
   */
  async update(id: string, data: Partial<Omit<T, 'id' | 'created_at'>>): Promise<RepositoryResponse<T | null>> {
    try {
      const result = await supabase.from(this.table as any)
        .update(data)
        .eq(this.idField, id)
        .select();
      
      if (result.error) {
        return {
          error: result.error.message,
          data: null,
        };
      }
      
      return {
        data: result.data?.[0] as T || null,
        error: null,
      };
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Delete an entity (soft delete if statusField is provided)
   */
  async delete(id: string): Promise<RepositoryResponse<boolean>> {
    try {
      let result;
      
      if (this.statusField) {
        // Soft delete by updating status
        result = await supabase.from(this.table as any)
          .update({ [this.statusField]: 'inactive' })
          .eq(this.idField, id);
      } else {
        // Hard delete
        result = await supabase.from(this.table as any)
          .delete()
          .eq(this.idField, id);
      }
      
      if (result.error) {
        return {
          error: result.error.message,
          data: false,
        };
      }
      
      return {
        data: true,
        error: null,
      };
    } catch (error) {
      return {
        data: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}
