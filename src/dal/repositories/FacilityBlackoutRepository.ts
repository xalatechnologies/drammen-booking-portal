
import { GenericSupabaseRepository } from '../GenericSupabaseRepository';
import { FacilityBlackoutPeriod } from '@/types/facility';
import { RepositoryResponse } from '@/types/api';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

type DatabaseBlackoutPeriod = Database['public']['Tables']['facility_blackout_periods']['Row'];
type DatabaseBlackoutPeriodInsert = Database['public']['Tables']['facility_blackout_periods']['Insert'];

export class FacilityBlackoutRepository extends GenericSupabaseRepository<FacilityBlackoutPeriod, DatabaseBlackoutPeriod> {
  protected tableName = 'facility_blackout_periods';

  protected mapFromDatabase(dbRecord: DatabaseBlackoutPeriod): FacilityBlackoutPeriod {
    return {
      id: dbRecord.id,
      facilityId: dbRecord.facility_id,
      startDate: new Date(dbRecord.start_date),
      endDate: new Date(dbRecord.end_date),
      reason: dbRecord.reason,
      type: dbRecord.type as any,
      createdBy: dbRecord.created_by,
      createdAt: new Date(dbRecord.created_at)
    };
  }

  protected mapToDatabase(frontendRecord: Partial<FacilityBlackoutPeriod>): Partial<DatabaseBlackoutPeriodInsert> {
    return {
      facility_id: frontendRecord.facilityId,
      start_date: frontendRecord.startDate?.toISOString(),
      end_date: frontendRecord.endDate?.toISOString(),
      reason: frontendRecord.reason,
      type: frontendRecord.type || 'maintenance',
      created_by: frontendRecord.createdBy
    };
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

      const mappedData = (data || []).map(record => this.mapFromDatabase(record));

      return {
        data: mappedData,
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
