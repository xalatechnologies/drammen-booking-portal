import { BaseRepository } from '@/dal/BaseRepository';
import { RepositoryResponse, PaginationParams } from '@/types/api';
import { supabase } from '@/integrations/supabase/client';

/**
 * Generic Entity Repository with actual Supabase implementation
 */
export class GenericEntityRepository<T extends Record<string, any>> extends BaseRepository<T> {
  private table: string;
  private related?: string;
  private idField: string;
  private statusField?: string;
  private activeValue?: string;
  
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

  async findAll(pagination?: PaginationParams, filters?: any): Promise<RepositoryResponse<T[]>> {
    try {
      console.log('GenericEntityRepository.findAll - Starting query for table:', this.table);
      
      // Build the select query with related data
      let selectQuery = '*';
      if (this.related) {
        selectQuery = `*, ${this.related}(*)`;
      }
      
      let query = supabase
        .from(this.table as any)
        .select(selectQuery, { count: 'exact' });

      // Apply status filter if configured
      if (this.statusField && this.activeValue) {
        query = query.eq(this.statusField, this.activeValue);
      }

      // Apply additional filters
      if (filters) {
        Object.keys(filters).forEach(key => {
          if (filters[key] !== undefined && filters[key] !== null && filters[key] !== 'all') {
            query = query.eq(key, filters[key]);
          }
        });
      }

      // Apply pagination if provided
      if (pagination) {
        const from = (pagination.page! - 1) * pagination.limit!;
        const to = from + pagination.limit! - 1;
        query = query.range(from, to);
      }

      // Order by name if it exists, otherwise by id
      if (this.table === 'facilities') {
        query = query.order('name');
      } else {
        query = query.order(this.idField);
      }

      const { data, error, count } = await query;

      if (error) {
        console.error('GenericEntityRepository.findAll - Supabase error:', error);
        return {
          data: [] as T[],
          error: error.message
        };
      }

      console.log('GenericEntityRepository.findAll - Success:', {
        table: this.table,
        count: data?.length || 0,
        totalCount: count
      });

      return {
        data: (data || []) as T[],
        error: null,
        pagination: count !== null ? {
          total: count,
          page: pagination?.page || 1,
          limit: pagination?.limit || 20,
          totalPages: Math.ceil(count / (pagination?.limit || 20))
        } : undefined
      };
    } catch (error) {
      console.error('GenericEntityRepository.findAll - Unexpected error:', error);
      return {
        data: [] as T[],
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async findById(id: string): Promise<RepositoryResponse<T | null>> {
    try {
      console.log('GenericEntityRepository.findById - Starting query for ID:', id);
      
      let selectQuery = '*';
      if (this.related) {
        selectQuery = `*, ${this.related}(*)`;
      }
      
      const { data, error } = await supabase
        .from(this.table as any)
        .select(selectQuery)
        .eq(this.idField, id)
        .maybeSingle();

      if (error) {
        console.error('GenericEntityRepository.findById - Supabase error:', error);
        return {
          data: null,
          error: error.message
        };
      }

      console.log('GenericEntityRepository.findById - Success:', !!data);

      return {
        data: data as T | null,
        error: null
      };
    } catch (error) {
      console.error('GenericEntityRepository.findById - Unexpected error:', error);
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async create(data: Omit<T, 'id' | 'created_at' | 'updated_at'>): Promise<RepositoryResponse<T | null>> {
    try {
      console.log('GenericEntityRepository.create - Creating record in table:', this.table);
      
      const { data: result, error } = await supabase
        .from(this.table as any)
        .insert(data as any)
        .select()
        .maybeSingle();

      if (error) {
        console.error('GenericEntityRepository.create - Supabase error:', error);
        return {
          data: null,
          error: error.message
        };
      }

      console.log('GenericEntityRepository.create - Success');

      return {
        data: result as T | null,
        error: null
      };
    } catch (error) {
      console.error('GenericEntityRepository.create - Unexpected error:', error);
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async update(id: string, data: Partial<Omit<T, 'id' | 'created_at'>>): Promise<RepositoryResponse<T | null>> {
    try {
      console.log('GenericEntityRepository.update - Updating record ID:', id);
      
      const updateData = {
        ...data,
        updated_at: new Date().toISOString()
      };
      
      const { data: result, error } = await supabase
        .from(this.table as any)
        .update(updateData as any)
        .eq(this.idField, id)
        .select()
        .maybeSingle();

      if (error) {
        console.error('GenericEntityRepository.update - Supabase error:', error);
        return {
          data: null,
          error: error.message
        };
      }

      console.log('GenericEntityRepository.update - Success');

      return {
        data: result as T | null,
        error: null
      };
    } catch (error) {
      console.error('GenericEntityRepository.update - Unexpected error:', error);
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async delete(id: string): Promise<RepositoryResponse<boolean>> {
    try {
      console.log('GenericEntityRepository.delete - Deleting record ID:', id);
      
      // If we have a status field, do soft delete, otherwise hard delete
      if (this.statusField) {
        const { error } = await supabase
          .from(this.table as any)
          .update({ 
            [this.statusField]: 'inactive',
            updated_at: new Date().toISOString()
          } as any)
          .eq(this.idField, id);

        if (error) {
          console.error('GenericEntityRepository.delete - Supabase soft delete error:', error);
          return {
            data: false,
            error: error.message
          };
        }
      } else {
        const { error } = await supabase
          .from(this.table as any)
          .delete()
          .eq(this.idField, id);

        if (error) {
          console.error('GenericEntityRepository.delete - Supabase hard delete error:', error);
          return {
            data: false,
            error: error.message
          };
        }
      }

      console.log('GenericEntityRepository.delete - Success');

      return {
        data: true,
        error: null
      };
    } catch (error) {
      console.error('GenericEntityRepository.delete - Unexpected error:', error);
      return {
        data: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}
