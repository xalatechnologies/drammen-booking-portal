import { PaginationParams, RepositoryResponse, SortingParams } from '@/types/api';

/**
 * Base repository interface defining common operations for all entity types
 * Following Interface Segregation Principle - interfaces should be focused
 */
export interface IBaseRepository<T> {
  /**
   * Retrieve all entities with optional pagination, filtering, and sorting
   */
  findAll(
    pagination?: PaginationParams,
    filters?: Record<string, any>,
    sorting?: SortingParams
  ): Promise<RepositoryResponse<T[]>>;
  
  /**
   * Retrieve a single entity by its ID
   */
  findById(id: string | number): Promise<RepositoryResponse<T | null>>;
  
  /**
   * Create a new entity
   */
  create(data: Omit<T, 'id' | 'created_at' | 'updated_at'>): Promise<RepositoryResponse<T>>;
  
  /**
   * Update an existing entity by ID
   */
  update(id: string | number, data: Partial<Omit<T, 'id' | 'created_at'>>): Promise<RepositoryResponse<T>>;
  
  /**
   * Delete an entity by ID
   */
  delete(id: string | number): Promise<RepositoryResponse<boolean>>;
}
