import { SupabaseRepository } from '../SupabaseRepository';
import { FacilityBlackoutPeriod } from '@/types/facility';
import { RepositoryResponse } from '@/types/api';
import { supabase } from '@/integrations/supabase/client';

export class FacilityBlackoutRepository extends SupabaseRepository<FacilityBlackoutPeriod> {
  protected tableName = 'facility_blackout_periods';

  constructor() {
    super();
  }

  async getAllBlackouts(facilityId?: number): Promise<RepositoryResponse<FacilityBlackoutPeriod[]>> {
    try {
      let query = supabase.from('facility_blackout_periods').select('*');
      
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
export const facilityBlackoutRepository = new FacilityBlackoutRepository();
