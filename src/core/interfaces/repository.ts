/**
 * Core Repository Interface
 * 
 * This file defines the base repository interface pattern following SOLID principles:
 * - Interface Segregation: Each repository interface is focused on a specific domain
 * - Dependency Inversion: High-level modules depend on abstractions
 */

import { RepositoryResponse } from '../../types/api';

/**
 * Base repository interface for CRUD operations
 * Generic types:
 * T - Entity type
 * K - Key type
 * C - Create DTO type
 * U - Update DTO type
 * F - Filter type
 */
export interface IRepository<T, K, C, U, F = Record<string, any>> {
  getById(id: K): Promise<RepositoryResponse<T>>;
  getAll(filters?: F): Promise<RepositoryResponse<T[]>>;
  create(entity: C): Promise<RepositoryResponse<T>>;
  update(id: K, entity: U): Promise<RepositoryResponse<T>>;
  delete(id: K): Promise<RepositoryResponse<boolean>>;
}
