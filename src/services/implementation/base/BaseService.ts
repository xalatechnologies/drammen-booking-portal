import { IBaseService } from '@/services/interfaces/base/IBaseService';
import { IBaseRepository } from '@/dal/interfaces/IBaseRepository';

/**
 * Generic base service implementation
 * Implements the common CRUD operations defined in IBaseService
 * Follows the Single Responsibility Principle by focusing only on generic entity operations
 * Follows Dependency Inversion by depending on repository abstractions
 * 
 * @template T The entity type this service operates on
 */
export abstract class BaseService<T> implements IBaseService<T> {
  /**
   * Repository instance injected via constructor (Dependency Injection)
   */
  protected repository: IBaseRepository<T>;

  /**
   * Constructor for BaseService
   * @param repository The repository implementation to use
   */
  constructor(repository: IBaseRepository<T>) {
    this.repository = repository;
  }

  /**
   * Get all entities
   */
  async getAll(): Promise<T[]> {
    const response = await this.repository.findAll();
    return response.data || [];
  }

  /**
   * Get an entity by its ID
   * @param id The ID of the entity to retrieve
   */
  async getById(id: string | number): Promise<T | null> {
    const response = await this.repository.findById(id);
    return response.data || null;
  }

  /**
   * Create a new entity
   * @param entity The entity data to create
   */
  async create(entity: Omit<T, 'id'>): Promise<T> {
    // Cast to the expected repository type, removing created_at and updated_at
    // This aligns with the repository interface requirements
    const entityData = entity as unknown as Omit<T, 'id' | 'created_at' | 'updated_at'>;
    
    const response = await this.repository.create(entityData);
    
    if (response.error) {
      throw new Error(response.error || 'Failed to create entity');
    }
    
    if (!response.data) {
      throw new Error('Failed to create entity: No data returned');
    }
    
    return response.data;
  }

  /**
   * Update an existing entity
   * @param id The ID of the entity to update
   * @param entity The partial entity data to update
   */
  async update(id: string | number, entity: Partial<T>): Promise<T> {
    const response = await this.repository.update(id, entity);
    
    if (response.error) {
      throw new Error(response.error || 'Failed to update entity');
    }
    
    if (!response.data) {
      throw new Error('Failed to update entity: No data returned');
    }
    
    return response.data;
  }

  /**
   * Delete an entity by its ID
   * @param id The ID of the entity to delete
   */
  async delete(id: string | number): Promise<boolean> {
    const response = await this.repository.delete(id);
    
    if (response.error) {
      throw new Error(response.error || 'Failed to delete entity');
    }
    
    return response.data || false;
  }
}
