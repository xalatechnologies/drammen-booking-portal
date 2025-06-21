
import { SupabaseRepository } from '../SupabaseRepository';
import { LocalizedFacility } from '@/types/localization';
import { Zone } from '@/types/zone';
import { FacilityFilters } from '@/types/facility';
import { PaginationParams, PaginatedResponse, RepositoryResponse } from '@/types/api';
import { supabase } from '@/integrations/supabase/client';

// Define local filters interface that matches the actual usage
interface LocalFacilityFilters {
  type?: string[];
  area?: string[];
  search?: string;
}

export class LocalizedFacilityRepository extends SupabaseRepository<LocalizedFacility> {
  protected tableName = 'facilities';

  constructor() {
    super();
  }

  async findAllRaw(
    pagination: PaginationParams,
    filters?: LocalFacilityFilters,
    orderBy?: string,
    orderDirection: 'asc' | 'desc' = 'asc'
  ): Promise<RepositoryResponse<PaginatedResponse<LocalizedFacility>>> {
    try {
      let query = supabase
        .from(this.tableName as any)
        .select(`
          *,
          facility_translations(*),
          facility_images(*)
        `, { count: 'exact' });

      // Apply filters
      if (filters?.type && filters.type.length > 0) {
        query = query.in('type', filters.type);
      }
      if (filters?.area && filters.area.length > 0) {
        query = query.in('area', filters.area);
      }
      if (filters?.search) {
        query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
      }

      // Apply sorting
      if (orderBy) {
        query = query.order(orderBy, { ascending: orderDirection === 'asc' });
      }

      // Apply pagination
      const from = (pagination.page - 1) * pagination.limit;
      const to = from + pagination.limit - 1;
      query = query.range(from, to);

      const { data, error, count } = await query;

      if (error) {
        return {
          data: {
            data: [],
            pagination: {
              page: pagination.page,
              limit: pagination.limit,
              total: 0,
              totalPages: 0,
              hasNext: false,
              hasPrev: false
            }
          },
          error: error.message
        };
      }

      const totalPages = Math.ceil((count || 0) / pagination.limit);

      return {
        data: {
          data: (data as unknown as LocalizedFacility[]) || [],
          pagination: {
            page: pagination.page,
            limit: pagination.limit,
            total: count || 0,
            totalPages,
            hasNext: pagination.page < totalPages,
            hasPrev: pagination.page > 1
          }
        }
      };
    } catch (error: any) {
      return {
        data: {
          data: [],
          pagination: {
            page: pagination.page,
            limit: pagination.limit,
            total: 0,
            totalPages: 0,
            hasNext: false,
            hasPrev: false
          }
        },
        error: error.message
      };
    }
  }

  async findByIdRaw(id: string): Promise<RepositoryResponse<LocalizedFacility | null>> {
    try {
      const { data, error } = await supabase
        .from(this.tableName as any)
        .select(`
          *,
          facility_translations(*),
          facility_images(*)
        `)
        .eq('id', parseInt(id))
        .maybeSingle();

      if (error) {
        return {
          data: null,
          error: error.message
        };
      }

      return {
        data: data as unknown as LocalizedFacility | null
      };
    } catch (error: any) {
      return {
        data: null,
        error: error.message
      };
    }
  }

  async getZonesByFacilityId(facilityId: string): Promise<RepositoryResponse<Zone[]>> {
    try {
      const { data, error } = await supabase
        .from('zones')
        .select('*')
        .eq('facility_id', parseInt(facilityId));

      if (error) {
        return {
          data: [],
          error: error.message
        };
      }

      return {
        data: (data as unknown as Zone[]) || []
      };
    } catch (error: any) {
      return {
        data: [],
        error: error.message
      };
    }
  }

  async getZoneById(zoneId: string): Promise<RepositoryResponse<Zone | null>> {
    try {
      const { data, error } = await supabase
        .from('zones')
        .select('*')
        .eq('id', zoneId)
        .maybeSingle();

      if (error) {
        return {
          data: null,
          error: error.message
        };
      }

      return {
        data: data as unknown as Zone | null
      };
    } catch (error: any) {
      return {
        data: null,
        error: error.message
      };
    }
  }

  async getRawFacilitiesByType(type: string): Promise<RepositoryResponse<LocalizedFacility[]>> {
    try {
      const { data, error } = await supabase
        .from(this.tableName as any)
        .select(`
          *,
          facility_translations(*),
          facility_images(*)
        `)
        .eq('type', type);

      if (error) {
        return {
          data: [],
          error: error.message
        };
      }

      return {
        data: (data as unknown as LocalizedFacility[]) || []
      };
    } catch (error: any) {
      return {
        data: [],
        error: error.message
      };
    }
  }

  async getRawFacilitiesByArea(area: string): Promise<RepositoryResponse<LocalizedFacility[]>> {
    try {
      const { data, error } = await supabase
        .from(this.tableName as any)
        .select(`
          *,
          facility_translations(*),
          facility_images(*)
        `)
        .eq('area', area);

      if (error) {
        return {
          data: [],
          error: error.message
        };
      }

      return {
        data: (data as unknown as LocalizedFacility[]) || []
      };
    } catch (error: any) {
      return {
        data: [],
        error: error.message
      };
    }
  }
}
