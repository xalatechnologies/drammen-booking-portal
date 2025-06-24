
import { SupabaseRepository } from '../SupabaseRepository';
import { FacilityBlackoutPeriod, BlackoutType } from '@/types/facility';
import { PaginationParams, RepositoryResponse } from '@/types/api';
import { supabase } from '@/integrations/supabase/client';

interface BlackoutFilters {
  facilityId?: string;
  type?: BlackoutType;
  startDate?: Date;
  endDate?: Date;
  isActive?: boolean;
}

interface BlackoutCreateRequest {
  facility_id: number;
  start_date: Date;
  end_date: Date;
  type: BlackoutType;
  reason: string;
  created_by: string;
}

interface BlackoutUpdateRequest extends Partial<BlackoutCreateRequest> {
  is_resolved?: boolean;
  resolved_by?: string;
  resolved_at?: Date;
}

export class FacilityBlackoutRepository extends SupabaseRepository<FacilityBlackoutPeriod> {
  protected tableName = 'facility_blackout_periods';

  constructor() {
    super();
  }

  async findAllWithFilters(
    pagination?: PaginationParams,
    filters?: BlackoutFilters
  ): Promise<RepositoryResponse<FacilityBlackoutPeriod[]>> {
    try {
      let query = supabase.from(this.tableName as any).select('*');

      // Apply filters
      if (filters?.facilityId) {
        query = query.eq('facility_id', filters.facilityId);
      }
      if (filters?.type) {
        query = query.eq('type', filters.type);
      }
      if (filters?.startDate) {
        query = query.gte('start_date', filters.startDate.toISOString());
      }
      if (filters?.endDate) {
        query = query.lte('end_date', filters.endDate.toISOString());
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
        data: (data as unknown as FacilityBlackoutPeriod[]) || []
      };
    } catch (error: any) {
      return {
        data: [],
        error: error.message
      };
    }
  }

  async getBlackoutsByFacility(facilityId: string): Promise<RepositoryResponse<FacilityBlackoutPeriod[]>> {
    return this.findAllWithFilters(undefined, { facilityId });
  }

  async getActiveBlackouts(facilityId?: string): Promise<RepositoryResponse<FacilityBlackoutPeriod[]>> {
    const now = new Date();
    return this.findAllWithFilters(undefined, {
      facilityId,
      startDate: now
    });
  }
}

// Export singleton instance
export const facilityBlackoutRepository = new FacilityBlackoutRepository();
