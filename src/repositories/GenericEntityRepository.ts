
import { RepositoryResponse } from '@/types/api';

export abstract class GenericEntityRepository<T extends Record<string, any>> {
  protected abstract tableName: string;

  async findAll(): Promise<RepositoryResponse<T[]>> {
    return {
      data: [],
      error: "GenericEntityRepository methods not implemented - use hooks instead"
    };
  }

  async findById(id: string): Promise<RepositoryResponse<T | null>> {
    return {
      data: null,
      error: "GenericEntityRepository methods not implemented - use hooks instead"
    };
  }

  async create(data: Partial<T>): Promise<RepositoryResponse<T | null>> {
    return {
      data: null,
      error: "GenericEntityRepository methods not implemented - use hooks instead"
    };
  }

  async update(id: string, data: Partial<T>): Promise<RepositoryResponse<T | null>> {
    return {
      data: null,
      error: "GenericEntityRepository methods not implemented - use hooks instead"
    };
  }

  async delete(id: string): Promise<RepositoryResponse<boolean>> {
    return {
      data: false,
      error: "GenericEntityRepository methods not implemented - use hooks instead"
    };
  }
}
