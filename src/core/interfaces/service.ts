/**
 * Core Service Interface
 * 
 * This file defines the base service interface pattern following SOLID principles:
 * - Interface Segregation: Each service interface is focused on a specific domain
 * - Dependency Inversion: High-level modules depend on abstractions
 * - Single Responsibility: Services handle only business logic
 */

import { ServiceResponse } from '../../types/api';

/**
 * Base service interface for business logic operations
 * Generic types:
 * T - Entity type
 * K - Key type
 * C - Create DTO type
 * U - Update DTO type
 * F - Filter type
 */
export interface IService<T, K, C, U, F = Record<string, any>> {
  getById(id: K): Promise<ServiceResponse<T>>;
  getAll(filters?: F): Promise<ServiceResponse<T[]>>;
  create(entity: C): Promise<ServiceResponse<T>>;
  update(id: K, entity: U): Promise<ServiceResponse<T>>;
  delete(id: K): Promise<ServiceResponse<boolean>>;
}
