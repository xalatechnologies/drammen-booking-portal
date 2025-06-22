/**
 * Base service interface defining common service operations
 * Follows Interface Segregation Principle by providing only essential methods
 * 
 * @template T The entity type the service operates on
 */
export interface IBaseService<T> {
  /**
   * Get all entities
   */
  getAll(): Promise<T[]>;
  
  /**
   * Get an entity by its ID
   * @param id The ID of the entity to retrieve
   */
  getById(id: string | number): Promise<T | null>;
  
  /**
   * Create a new entity
   * @param entity The entity data to create
   */
  create(entity: Omit<T, 'id'>): Promise<T>;
  
  /**
   * Update an existing entity
   * @param id The ID of the entity to update
   * @param entity The partial entity data to update
   */
  update(id: string | number, entity: Partial<T>): Promise<T>;
  
  /**
   * Delete an entity by its ID
   * @param id The ID of the entity to delete
   */
  delete(id: string | number): Promise<boolean>;
}
