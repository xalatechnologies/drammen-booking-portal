import { ApiResponse, PaginatedResponse, QueryParams } from './entity';

/**
 * Generic API interface for all entity types
 * This interface defines the standard methods that all entity API adapters must implement
 */
export interface GenericApi<
  TEntity,
  TFilter = Record<string, any>,
  TCreateInput = Partial<TEntity>,
  TUpdateInput = Partial<TEntity>
> {
  /**
   * Get a list of entities with optional filtering, pagination, and sorting
   */
  getList: (params?: {
    pagination?: { page: number; limit: number };
    filters?: TFilter;
    orderBy?: string;
    orderDirection?: 'asc' | 'desc';
  }) => Promise<{
    data: TEntity[];
    error?: string;
    meta: {
      pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
      }
    }
  }>;
  
  /**
   * Get a single entity by ID
   */
  getById: (id: string | number) => Promise<{
    data?: TEntity;
    error?: string;
  }>;
  
  /**
   * Create a new entity
   */
  create: (input: TCreateInput) => Promise<{
    data?: TEntity;
    error?: string;
  }>;
  
  /**
   * Update an existing entity
   */
  update: (id: string | number, input: TUpdateInput) => Promise<{
    data?: TEntity;
    error?: string;
  }>;
  
  /**
   * Delete an entity
   */
  delete: (id: string | number) => Promise<{
    data?: boolean;
    error?: string;
  }>;
}

/**
 * Base repository interface for bridging existing repositories to the Zustand architecture
 * This interface is used by the createRepositoryStore function
 */
export interface BaseRepository<TEntity, TFilter = Record<string, any>> {
  getAll: (filters?: TFilter) => Promise<TEntity[]>;
  getById: (id: string | number) => Promise<TEntity | null>;
  create: (data: Partial<TEntity>) => Promise<TEntity>;
  update: (id: string | number, data: Partial<TEntity>) => Promise<TEntity>;
  delete: (id: string | number) => Promise<boolean>;
}

/**
 * Extended API interface with additional methods for specific entity types
 * Implementations can extend this interface to add custom methods
 */
export interface ExtendedApi<
  TEntity,
  TFilter = Record<string, any>,
  TCreateInput = Partial<TEntity>,
  TUpdateInput = Partial<TEntity>
> extends GenericApi<TEntity, TFilter, TCreateInput, TUpdateInput> {
  [key: string]: any;
}
