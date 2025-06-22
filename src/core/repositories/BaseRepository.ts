/**
 * Base Repository
 * 
 * Base class for all repositories providing common CRUD operations
 * while still following SOLID principles.
 */

import { IDatabaseClient, QueryOptions } from '../database/interfaces/IDatabaseClient';
import { Result, ErrorType } from '../utils/result';

/**
 * Base repository with common CRUD operations
 * Generic types:
 * T - Entity type
 * D - DTO type
 * K - Key type
 * C - Create DTO type
 * U - Update DTO type
 * F - Filter type
 */
export abstract class BaseRepository<T, D, K = string, C = Partial<T>, U = Partial<T>, F = Record<string, any>> {
  /**
   * Constructor with dependency injection for database client
   * following Dependency Inversion Principle
   */
  constructor(
    protected readonly databaseClient: IDatabaseClient,
    protected readonly tableName: string
  ) {}
  
  /**
   * Map from DTO to domain model
   * This method should be implemented by derived classes
   */
  protected abstract mapFromDTO(dto: D): T;
  
  /**
   * Map from domain model to DTO
   * This method should be implemented by derived classes
   */
  protected abstract mapToDTO(entity: T): D;
  
  /**
   * Map from partial domain model to DTO
   * This method should be implemented by derived classes for create operations
   */
  protected abstract mapCreateToDTO(createRequest: C): Partial<D>;
  
  /**
   * Map from partial domain model to DTO
   * This method should be implemented by derived classes for update operations
   */
  protected abstract mapUpdateToDTO(updateRequest: U): Partial<D>;
  
  /**
   * Apply filters to a query
   * This method can be overridden by derived classes to add custom filtering
   */
  protected applyFilters(query: any, filters?: F): any {
    return query;
  }
  
  /**
   * Get an entity by ID
   */
  async getById(id: K): Promise<Result<T>> {
    try {
      const result = await this.databaseClient.getById<D>(this.tableName, id as string);
      
      // If the database operation failed, return the error
      if (result.isFailure) {
        return Result.failure(result.error);
      }
      
      // If data is null (should not happen with Result but just in case)
      if (!result.value) {
        return Result.notFound<T>(`Entity with ID ${id} not found`, { id });
      }
      
      // Map the result value to the domain model
      return Result.success(this.mapFromDTO(result.value));
    } catch (error) {
      return Result.databaseError('Failed to fetch entity', error);
    }
  }
  
  /**
   * Get all entities matching the provided filters
   */
  async getAll(filters?: F): Promise<Result<T[]>> {
    try {
      // Create query options for pagination/sorting if needed
      const queryOptions: QueryOptions = {};
      
      // Get results with separated filters and options parameters
      const result = await this.databaseClient.getMany<D>(this.tableName, filters as Record<string, any>, queryOptions);
      
      if (result.isFailure) {
        return Result.failure(result.error);
      }
      
      return Result.success(result.value.map(item => this.mapFromDTO(item)));
    } catch (error) {
      return Result.databaseError('Failed to fetch entities', error);
    }
  }
  
  /**
   * Create a new entity
   */
  async create(createRequest: C): Promise<Result<T>> {
    try {
      const dto = this.mapCreateToDTO(createRequest);
      const result = await this.databaseClient.insert<D>(this.tableName, dto);
      
      // If the database operation failed, return the error
      if (result.isFailure) {
        return Result.failure(result.error);
      }
      
      // Map the result value to the domain model
      return Result.success(this.mapFromDTO(result.value));
    } catch (error) {
      return Result.databaseError('Failed to create entity', error);
    }
  }
  
  /**
   * Update an existing entity
   */
  async update(id: K, updateRequest: U): Promise<Result<T>> {
    try {
      const dto = this.mapUpdateToDTO(updateRequest);
      const result = await this.databaseClient.update<D>(this.tableName, id as string, dto);
      
      // If the database operation failed, return the error
      if (result.isFailure) {
        return result as unknown as Result<T>; // Type safety for error passthrough
      }
      
      // Map the result value to the domain model
      return Result.success(this.mapFromDTO(result.value));
    } catch (error) {
      return Result.databaseError('Failed to update entity', error);
    }
  }
  
  /**
   * Delete an entity
   */
  async delete(id: K): Promise<Result<boolean>> {
    try {
      const result = await this.databaseClient.delete(this.tableName, id as string);
      
      // If the database operation failed, return the error
      if (result.isFailure) {
        return result;
      }
      
      return Result.success(true);
    } catch (error) {
      return Result.databaseError('Failed to delete entity', error);
    }
  }
}
