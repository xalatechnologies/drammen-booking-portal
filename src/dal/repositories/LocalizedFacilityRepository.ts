
import { SimpleRepository } from './SimpleRepository';

export class LocalizedFacilityRepository extends SimpleRepository {
  constructor() {
    super('app_locations');
  }

  async findAllWithFilters(pagination?: any, filters?: any, language: string = 'NO') {
    console.log("LocalizedFacilityRepository.findAllWithFilters - Using simplified approach", { pagination, filters, language });
    return this.getAll();
  }

  async findById(id: string, language: string = 'NO') {
    console.log("LocalizedFacilityRepository.findById - Using simplified approach", { id, language });
    return this.getById(id);
  }

  async create(data: any, language: string = 'NO') {
    console.log("LocalizedFacilityRepository.create - Using simplified approach", { data, language });
    return super.create(data);
  }

  async update(id: string, data: any, language: string = 'NO') {
    console.log("LocalizedFacilityRepository.update - Using simplified approach", { id, data, language });
    return super.update(id, data);
  }
}

export const localizedFacilityRepository = new LocalizedFacilityRepository();
