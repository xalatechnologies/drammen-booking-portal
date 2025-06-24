
import { SimpleRepository } from './SimpleRepository';

export class AdditionalServiceRepository extends SimpleRepository {
  constructor() {
    super('additional_services');
  }

  async getAllByCategory(category: string) {
    console.log("AdditionalServiceRepository.getAllByCategory - Using simplified approach", { category });
    return this.getAll();
  }

  async findAllWithFilters(pagination?: any, filters?: any) {
    console.log("AdditionalServiceRepository.findAllWithFilters - Using simplified approach", { pagination, filters });
    return this.getAll();
  }
}

export const additionalServiceRepository = new AdditionalServiceRepository();
