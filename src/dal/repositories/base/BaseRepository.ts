import { IBaseRepository } from '@/dal/interfaces/base/IBaseRepository';
import { RepositoryResponse } from '@/types/api';
import { supabaseClient } from '@/supabase/client';

/**
 * Generic base repository implementation
 * Implements common CRUD operations defined in IBaseRepository
 * Follows Single Responsibility Principle by providing core repository operations
 * Follows Open/Closed Principle by being open for extension but closed for modification
 * 
 * @template T The entity type this repository operates on
 */
export abstract class BaseRepository<T> implements IBaseRepository<T> {
  /**
   * Supabase client instance for database operations
   */
  protected client;
  
  /**
   * Table name to be set by specific repository implementations
   */
  protected abstract tableName: string;

  /**
   * Constructor for BaseRepository
   * @param client The database client to use
   */
  constructor(client = supabaseClient) {
    this.client = client;
  }

  /**
   * Find all entities
   */
  async findAll(): Promise<RepositoryResponse<T[]>> {
    try {
      const { data, error } = await this.client
        .from(this.tableName)
        .select('*');
        
      return {
        data: data || [],
        error: error?.message
      };
    } catch (error: any) {
      return {
        data: [],
        error: error.message || `Error fetching ${this.tableName}`
      };
    }
  }

  /**
   * Find an entity by ID
   * @param id The ID of the entity to find
   */
  async findById(id: string | number): Promise<RepositoryResponse<T>> {
    try {
      const { data, error } = await this.client
        .from(this.tableName)
        .select('*')
        .eq('id', id)
        .single();
        
      return {
        data: data || null,
        error: error?.message
      };
    } catch (error: any) {
      return {
        data: null,
        error: error.message || `Error fetching ${this.tableName} by ID`
      };
    }
  }

  /**
   * Create a new entity
   * @param entity The entity data to create
   */
  async create(entity: Omit<T, 'id' | 'created_at' | 'updated_at'>): Promise<RepositoryResponse<T>> {
    try {
      const { data, error } = await this.client
        .from(this.tableName)
        .insert(entity)
        .select()
        .single();
        
      return {
        data: data || null,
        error: error?.message
      };
    } catch (error: any) {
      return {
        data: null,
        error: error.message || `Error creating ${this.tableName}`
      };
    }
  }

  /**
   * Update an existing entity
   * @param id The ID of the entity to update
   * @param entity The entity data to update
   */
  async update(id: string | number, entity: Partial<T>): Promise<RepositoryResponse<T>> {
    try {
      const { data, error } = await this.client
        .from(this.tableName)
        .update(entity)
        .eq('id', id)
        .select()
        .single();
        
      return {
        data: data || null,
        error: error?.message
      };
    } catch (error: any) {
      return {
        data: null,
        error: error.message || `Error updating ${this.tableName}`
      };
    }
  }

  /**
   * Delete an entity
   * @param id The ID of the entity to delete
   */
  async delete(id: string | number): Promise<RepositoryResponse<boolean>> {
    try {
      const { error } = await this.client
        .from(this.tableName)
        .delete()
        .eq('id', id);
        
      return {
        data: !error,
        error: error?.message
      };
    } catch (error: any) {
      return {
        data: false,
        error: error.message || `Error deleting ${this.tableName}`
      };
    }
  }
}
