
import { SimpleRepository } from './SimpleRepository';

export class FacilityRepository extends SimpleRepository {
  constructor() {
    super('app_locations');
    console.log("FacilityRepository - Using simplified approach");
  }

  async getFacilitiesByType(type: string) {
    console.log("FacilityRepository.getFacilitiesByType - Using simplified approach", { type });
    return this.getAll();
  }

  async getFacilitiesByArea(area: string) {
    console.log("FacilityRepository.getFacilitiesByArea - Using simplified approach", { area });
    return this.getAll();
  }

  async getFacilityZones(id: string) {
    console.log("FacilityRepository.getFacilityZones - Using simplified approach", { id });
    const zoneRepo = new SimpleRepository('app_zones');
    return zoneRepo.getAll();
  }
}

export const facilityRepository = new FacilityRepository();
