
import { SupabaseRepository } from '../SupabaseRepository';
import { FacilityBlackoutPeriod } from '@/types/facility';
import { RepositoryResponse } from '@/types/api';

export class FacilityBlackoutRepository extends SupabaseRepository<FacilityBlackoutPeriod> {
  protected tableName = 'facility_blackout_periods';

  constructor() {
    super();
  }

  async getAllBlackouts(facilityId?: number): Promise<RepositoryResponse<FacilityBlackoutPeriod[]>> {
    return {
      data: [],
      error: "FacilityBlackoutRepository methods not implemented - use hooks instead"
    };
  }
}

// Export singleton instance
export const facilityBlackoutRepository = new FacilityBlackoutRepository();
