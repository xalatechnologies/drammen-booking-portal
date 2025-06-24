import { SupabaseRepository } from '../SupabaseRepository';
import { AdditionalService, ServiceFilters } from '@/types/additionalServices';
import { PaginationParams, RepositoryResponse } from '@/types/api';
import { supabase } from '@/integrations/supabase/client';

interface AdditionalServiceCreateRequest extends Omit<AdditionalService, 'id' | 'created_at' | 'updated_at'> {}
interface AdditionalServiceUpdateRequest extends Partial<AdditionalServiceCreateRequest> {}

export class AdditionalServiceRepository extends SupabaseRepository<AdditionalService> {
  protected tableName = 'additional_services';

  constructor() {
    super();
  }

  // Override findAll to add filtering support
  async findAllWithFilters(
    pagination?: PaginationParams,
    filters?: ServiceFilters
  ): Promise<RepositoryResponse<AdditionalService[]>> {
    try {
      let query = supabase.from(this.tableName as any).select('*');

      // Apply filters
      if (filters?.category) {
        query = query.eq('category', filters.category);
      }
      if (filters?.isActive !== undefined) {
        query = query.eq('is_active', filters.isActive);
      }
      if (filters?.searchTerm) {
        query = query.or(`name.ilike.%${filters.searchTerm}%,description.ilike.%${filters.searchTerm}%`);
      }
      if (filters?.priceRange) {
        query = query.gte('base_price', filters.priceRange.min).lte('base_price', filters.priceRange.max);
      }

      // Apply pagination
      if (pagination) {
        const from = (pagination.page - 1) * pagination.limit;
        const to = from + pagination.limit - 1;
        query = query.range(from, to);
      }

      const { data, error } = await query;

      if (error) {
        return {
          data: [],
          error: error.message
        };
      }

      return {
        data: (data as unknown as AdditionalService[]) || []
      };
    } catch (error: any) {
      return {
        data: [],
        error: error.message
      };
    }
  }

  async getAllByCategory(category: string): Promise<RepositoryResponse<AdditionalService[]>> {
    try {
      const { data, error } = await supabase
        .from('additional_services')
        .select('*')
        .eq('category', category)
        .eq('is_active', true);

      if (error) {
        return {
          data: [],
          error: error.message
        };
      }

      return {
        data: data || [],
        error: null
      };
    } catch (error: any) {
      return {
        data: [],
        error: error.message
      };
    }
  }
}

// Export singleton instance
export const additionalServiceRepository = new AdditionalServiceRepository();
