
import { SimpleRepository } from './SimpleRepository';
import { Zone } from '@/types/facility';
import { RepositoryResponse } from '@/types/api';

export class ZoneRepository extends SimpleRepository {
  constructor() {
    super('zones');
  }

  async getAllZones(facilityId?: number): Promise<RepositoryResponse<Zone[]>> {
    return {
      data: [],
      error: "ZoneRepository methods not implemented - use hooks instead"
    };
  }

  async getZonesByFacilityId(facilityId: number): Promise<RepositoryResponse<Zone[]>> {
    return {
      data: [],
      error: "ZoneRepository methods not implemented - use hooks instead"
    };
  }
}
