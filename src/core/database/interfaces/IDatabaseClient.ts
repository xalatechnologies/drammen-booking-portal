/**
 * Database Client Interface
 * 
 * Defines the contract for all database client implementations.
 * Following SOLID principles:
 * - Single Responsibility: Only responsible for database operations
 * - Open/Closed: Can be extended with new methods without modifying existing ones
 * - Liskov Substitution: All implementations can be used interchangeably
 * - Interface Segregation: Focused on database operations only
 * - Dependency Inversion: High-level modules depend on this abstraction
 */

import { Result } from '@/core/utils/result';

export interface QueryOptions {
  limit?: number;
  offset?: number;
  orderBy?: string;
  orderDirection?: 'asc' | 'desc';
  filters?: Record<string, any>;
}

export interface IDatabaseClient {
  /**
   * Get a single item by ID
   * @param table The table name
   * @param id The item ID
   * @returns Promise resolving to Result containing the found item or error
   */
  getById<T>(table: string, id: string): Promise<Result<T>>;

  /**
   * Get many items with optional filters
   * @param table The table name
   * @param filters Optional filters to apply
   * @param options Query options like pagination, sorting
   * @returns Promise resolving to Result containing an array of items or error
   */
  getMany<T>(table: string, filters?: Record<string, any>, options?: QueryOptions): Promise<Result<T[]>>;

  /**
   * Insert a new item
   * @param table The table name
   * @param data The data to insert
   * @returns Promise resolving to Result containing the created item or error
   */
  insert<T>(table: string, data: Partial<T>): Promise<Result<T>>;

  /**
   * Update an existing item
   * @param table The table name
   * @param id The item ID
   * @param data The data to update
   * @returns Promise resolving to Result containing the updated item or error
   */
  update<T>(table: string, id: string, data: Partial<T>): Promise<Result<T>>;

  /**
   * Delete an item
   * @param table The table name
   * @param id The item ID
   * @returns Promise resolving to Result containing true if successful or error
   */
  delete<T>(table: string, id: string): Promise<Result<boolean>>;

  /**
   * Execute a custom query
   * @param query The query string or object
   * @param params The query parameters
   * @returns Promise resolving to the query result
   */
  executeQuery<T>(query: string | object, params?: any[]): Promise<T[]>;
  
  /**
   * Count records in a table
   * @param table The table name
   * @param filters Optional filters to apply
   * @returns Promise resolving to Result containing the count or error
   */
  count(table: string, filters?: Record<string, any>): Promise<Result<number>>;
}
