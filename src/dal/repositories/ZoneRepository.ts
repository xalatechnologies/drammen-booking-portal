
import { SupabaseRepository } from '../SupabaseRepository';
import { Zone } from '@/types/facility';
import { PaginationParams, RepositoryResponse } from '@/types/api';
import { supabase } from '@/integrations/supabase/client';

interface ZoneFilters {
  facilityId?: string;
  type?: string;
  isActive?: boolean;
  capacity?: number;
}

interface ZoneCreateRequest {
  facility_id: number;
  name: string;
  type: string;
  capacity: number;
  description?: string;
  is_main_zone?: boolean;
  parent_zone_id?: string;
  bookable_independently?: boolean;
  area_sqm?: number;
  floor?: string;
  equipment?: string[];
  accessibility_features?: string[];
}

interface ZoneUpdateRequest extends Partial<ZoneCreateRequest> {
  status?: 'active' | 'maintenance' | 'inactive';
}

export class ZoneRepository extends SupabaseRepository<Zone> {
  protected tableName = 'zones';

  constructor() {
    super();
  }

  async findAllWithFilters(
    pagination?: PaginationParams,
    filters?: ZoneFilters
  ): Promise<RepositoryResponse<Zone[]>> {
    try {
      let query = supabase.from(this.tableName as any).select('*');

      // Apply filters
      if (filters?.facilityId) {
        query = query.eq('facility_id', filters.facilityId);
      }
      if (filters?.type) {
        query = query.eq('type', filters.type);
      }
      if (filters?.isActive !== undefined) {
        query = query.eq('status', filters.isActive ? 'active' : 'inactive');
      }
      if (filters?.capacity) {
        query = query.gte('capacity', filters.capacity);
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
        data: (data as unknown as Zone[]) || []
      };
    } catch (error: any) {
      return {
        data: [],
        error: error.message
      };
    }
  }

  async getZonesByFacility(facilityId: string): Promise<RepositoryResponse<Zone[]>> {
    return this.findAllWithFilters(undefined, { facilityId });
  }

  async getMainZones(facilityId?: string): Promise<RepositoryResponse<Zone[]>> {
    try {
      let query = supabase
        .from(this.tableName as any)
        .select('*')
        .eq('is_main_zone', true);

      if (facilityId) {
        query = query.eq('facility_id', facilityId);
      }

      const { data, error } = await query;

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
}

// Export singleton instance
export const zoneRepository = new ZoneRepository();
