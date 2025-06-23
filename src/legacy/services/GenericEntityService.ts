import { GenericEntityRepository } from '@/repositories/GenericEntityRepository';
import { RepositoryResponse, PaginationParams } from '@/types/api';

/**
 * Generic Entity Service
 * 
 * A service layer for working with any entity type through the generic-entity Edge Function.
 * This follows our pattern of having repositories, DAL, and Zustand for all DB interactions.
 */
export class GenericEntityService<T> {
  private repository: GenericEntityRepository<T>;

  /**
   * Create a new GenericEntityService
   * 
   * @param table The database table name
   * @param options Configuration options
   */
  constructor(table: string, options?: {
    related?: string[];
    idField?: string;
    statusField?: string;
    activeValue?: string;
  }) {
    this.repository = new GenericEntityRepository<T>(table, options);
  }

  /**
   * Get a single entity by ID
   */
  async getById(id: string): Promise<RepositoryResponse<T | null>> {
    return this.repository.findById(id);
  }

  /**
   * Get a list of entities with optional filtering and pagination
   */
  async getList(params: {
    page?: number;
    limit?: number;
    orderBy?: string;
    orderDirection?: 'asc' | 'desc';
    includeInactive?: boolean;
    [key: string]: any;
  } = {}): Promise<RepositoryResponse<T[]>> {
    const pagination: PaginationParams | undefined = params.page ? {
      page: params.page,
      limit: params.limit || 10
    } : undefined;
    
    const filters = { ...params };
    delete filters.page;
    delete filters.limit;
    
    return this.repository.findAll(pagination, filters);
  }

  /**
   * Create a new entity
   */
  async create(data: Partial<T>): Promise<RepositoryResponse<T | null>> {
    return this.repository.create(data as any);
  }

  /**
   * Update an existing entity
   */
  async update(id: string, data: Partial<T>): Promise<RepositoryResponse<T | null>> {
    return this.repository.update(id, data);
  }

  /**
   * Delete an entity (soft delete if statusField is provided)
   */
  async delete(id: string): Promise<RepositoryResponse<boolean>> {
    return this.repository.delete(id);
  }
}
