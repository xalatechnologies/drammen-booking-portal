
import { SimpleRepository } from './SimpleRepository';

export class LocalizedAdditionalServiceRepository extends SimpleRepository {
  constructor() {
    super('additional_services');
  }

  async findAllWithFilters(pagination?: any, filters?: any) {
    console.log("LocalizedAdditionalServiceRepository.findAllWithFilters - Using simplified approach", { pagination, filters });
    return this.getAll();
  }

  async findById(id: string, language: string = 'NO') {
    console.log("LocalizedAdditionalServiceRepository.findById - Using simplified approach", { id, language });
    return this.getById(id);
  }

  async create(data: any, language: string = 'NO') {
    console.log("LocalizedAdditionalServiceRepository.create - Using simplified approach", { data, language });
    return super.create(data);
  }

  async update(id: string, data: any, language: string = 'NO') {
    console.log("LocalizedAdditionalServiceRepository.update - Using simplified approach", { id, data, language });
    return super.update(id, data);
  }
}

export const localizedAdditionalServiceRepository = new LocalizedAdditionalServiceRepository();
