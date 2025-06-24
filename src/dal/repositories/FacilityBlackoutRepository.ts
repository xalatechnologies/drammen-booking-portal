
import { SimpleRepository } from './SimpleRepository';

export class FacilityBlackoutRepository extends SimpleRepository {
  constructor() {
    super('facility_blackout_periods');
  }

  async getAllBlackouts(facilityId?: number) {
    console.log("FacilityBlackoutRepository.getAllBlackouts - Using simplified approach", { facilityId });
    return this.getAll();
  }
}

export const facilityBlackoutRepository = new FacilityBlackoutRepository();
