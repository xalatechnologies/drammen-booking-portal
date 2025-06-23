
import { supabase } from '@/integrations/supabase/client';
import { RepositoryResponse, PaginationParams } from '@/types/api';

export abstract class GenericSupabaseRepository<TFrontend, TDatabase = any> {
  protected abstract tableName: string;

  // Abstract methods for type conversion
  protected abstract mapFromDatabase(dbRecord: TDatabase): TFrontend;
  protected abstract mapToDatabase(frontendRecord: Partial<TFrontend>): Partial<TDatabase>;

  async findAll(
    pagination?: PaginationParams,
    filters?: Record<string, any>
  ): Promise<RepositoryResponse<TFrontend[]>> {
    try {
      let query = supabase.from(this.tableName as any).select('*', { count: 'exact' });

      // Apply filters
      if (filters) {
        Object.keys(filters).forEach(key => {
          if (filters[key] !== undefined && filters[key] !== null && filters[key] !== 'all') {
            query = query.eq(key, filters[key]);
          }
        });
      }

      // Apply pagination
      if (pagination) {
        const from = (pagination.page - 1) * pagination.limit;
        const to = from + pagination.limit - 1;
        query = query.range(from, to);
      }

      const { data, error, count } = await query;

      if (error) {
        return {
          data: [],
          error: error.message
        };
      }

      const mappedData = (data || []).map(record => this.mapFromDatabase(record));

      return {
        data: mappedData,
        error: null,
        pagination: count !== null ? {
          total: count,
          page: pagination?.page || 1,
          limit: pagination?.limit || 20,
          totalPages: Math.ceil(count / (pagination?.limit || 20))
        } : undefined
      };
    } catch (error: any) {
      return {
        data: [],
        error: error.message
      };
    }
  }

  async findById(id: string): Promise<RepositoryResponse<TFrontend | null>> {
    try {
      const { data, error } = await supabase
        .from(this.tableName as any)
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) {
        return {
          data: null,
          error: error.message
        };
      }

      return {
        data: data ? this.mapFromDatabase(data) : null,
        error: null
      };
    } catch (error: any) {
      return {
        data: null,
        error: error.message
      };
    }
  }

  async create(data: Partial<TFrontend>): Promise<RepositoryResponse<TFrontend | null>> {
    try {
      const dbData = this.mapToDatabase(data);
      const { data: result, error } = await supabase
        .from(this.tableName as any)
        .insert(dbData as any)
        .select()
        .maybeSingle();

      if (error) {
        return {
          data: null,
          error: error.message
        };
      }

      return {
        data: result ? this.mapFromDatabase(result) : null,
        error: null
      };
    } catch (error: any) {
      return {
        data: null,
        error: error.message
      };
    }
  }

  async update(id: string, data: Partial<TFrontend>): Promise<RepositoryResponse<TFrontend | null>> {
    try {
      const dbData = this.mapToDatabase(data);
      const { data: result, error } = await supabase
        .from(this.tableName as any)
        .update(dbData as any)
        .eq('id', id)
        .select()
        .maybeSingle();

      if (error) {
        return {
          data: null,
          error: error.message
        };
      }

      return {
        data: result ? this.mapFromDatabase(result) : null,
        error: null
      };
    } catch (error: any) {
      return {
        data: null,
        error: error.message
      };
    }
  }

  async delete(id: string): Promise<RepositoryResponse<boolean>> {
    try {
      const { error } = await supabase
        .from(this.tableName as any)
        .delete()
        .eq('id', id);

      if (error) {
        return {
          data: false,
          error: error.message
        };
      }

      return {
        data: true,
        error: null
      };
    } catch (error: any) {
      return {
        data: false,
        error: error.message
      };
    }
  }
}
