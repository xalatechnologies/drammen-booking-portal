
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
  created_by?: string; // Made optional to let the backend handle it with default value
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
  
  // Override the create method to handle blackout period creation properly
  async create(data: Partial<FacilityBlackoutPeriod>): Promise<RepositoryResponse<FacilityBlackoutPeriod | null>> {
    try {
      console.log('FacilityBlackoutRepository.create - Called with data:', data);
      
      // Create a sanitized version of the data without problematic fields
      const sanitizedData = {
        facility_id: data.facility_id,
        type: data.type,
        reason: data.reason,
        start_date: data.start_date,
        end_date: data.end_date
        // Explicitly omit created_by to let the database use its default value or trigger
      };
      
      console.log('FacilityBlackoutRepository.create - Sanitized data:', sanitizedData);
      
      const { data: result, error } = await supabase
        .from(this.tableName as any)
        .insert(sanitizedData as any)
        .select()
        .maybeSingle();

      if (error) {
        console.error('FacilityBlackoutRepository.create - Error:', error);
        return {
          data: null,
          error: error.message
        };
      }

      console.log('FacilityBlackoutRepository.create - Success, result:', result);
      return {
        data: result as unknown as FacilityBlackoutPeriod | null
      };
    } catch (error: any) {
      console.error('FacilityBlackoutRepository.create - Exception:', error);
      return {
        data: null,
        error: error.message
      };
    }
  }
  
  // Override the update method to handle blackout period updates properly
  async update(id: string, data: Partial<FacilityBlackoutPeriod>): Promise<RepositoryResponse<FacilityBlackoutPeriod | null>> {
    try {
      console.log('FacilityBlackoutRepository.update - Called with id:', id, 'data:', data);
      
      // Create a sanitized version of the data without problematic fields
      const sanitizedData = {
        facility_id: data.facility_id,
        type: data.type,
        reason: data.reason,
        start_date: data.start_date,
        end_date: data.end_date
        // Explicitly omit fields that might cause UUID validation errors
      };
      
      console.log('FacilityBlackoutRepository.update - Sanitized data:', sanitizedData);
      
      const { data: result, error } = await supabase
        .from(this.tableName as any)
        .update(sanitizedData as any)
        .eq('id', id)
        .select()
        .maybeSingle();

      if (error) {
        console.error('FacilityBlackoutRepository.update - Error:', error);
        return {
          data: null,
          error: error.message
        };
      }

      console.log('FacilityBlackoutRepository.update - Success, result:', result);
      return {
        data: result as unknown as FacilityBlackoutPeriod | null
      };
    } catch (error: any) {
      console.error('FacilityBlackoutRepository.update - Exception:', error);
      return {
        data: null,
        error: error.message
      };
    }
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
