
import { PaginationParams, RepositoryResponse } from '@/types/api';

export abstract class BaseRepository<T extends Record<string, any>> {
  
  async findAll(
    pagination?: PaginationParams,
    orderBy?: string,
    orderDirection: 'asc' | 'desc' = 'asc'
  ): Promise<RepositoryResponse<T[]>> {
    // This method should be overridden by concrete implementations
    throw new Error('findAll method must be implemented by concrete repository');
  }

  async findById(id: string): Promise<RepositoryResponse<T | null>> {
    // This method should be overridden by concrete implementations
    throw new Error('findById method must be implemented by concrete repository');
  }

  async create(data: Omit<T, 'id' | 'created_at' | 'updated_at'>): Promise<RepositoryResponse<T | null>> {
    // This method should be overridden by concrete implementations
    throw new Error('create method must be implemented by concrete repository');
  }

  async update(id: string, data: Partial<Omit<T, 'id' | 'created_at'>>): Promise<RepositoryResponse<T | null>> {
    // This method should be overridden by concrete implementations
    throw new Error('update method must be implemented by concrete repository');
  }

  async delete(id: string): Promise<RepositoryResponse<boolean>> {
    // This method should be overridden by concrete implementations
    throw new Error('delete method must be implemented by concrete repository');
  }

  // Utility methods for subclasses
  protected generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  protected getCurrentTimestamp(): Date {
    return new Date();
  }
}
