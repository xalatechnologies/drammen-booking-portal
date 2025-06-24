
import { create } from 'zustand';
import { GenericEntityRepository } from '@/repositories/GenericEntityRepository';
import { RepositoryResponse, PaginationParams } from '@/types/api';

interface GenericEntityState<T> {
  entities: T[];
  currentEntity: T | null;
  isLoading: boolean;
  error: string | null;
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  } | null;
  
  // Actions
  setEntities: (entities: T[]) => void;
  setCurrentEntity: (entity: T | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setPagination: (pagination: any) => void;
  fetchAll: (pagination?: PaginationParams, filters?: any) => Promise<void>;
  fetchById: (id: string) => Promise<void>;
  createEntity: (data: Partial<T>) => Promise<boolean>;
  updateEntity: (id: string, data: Partial<T>) => Promise<boolean>;
  deleteEntity: (id: string) => Promise<boolean>;
  reset: () => void;
}

export function createGenericEntityStore<T extends Record<string, any>>(
  tableName: string,
  options: {
    related?: string[];
    idField?: string;
    statusField?: string;
    activeValue?: string;
  } = {}
) {
  const repository = new GenericEntityRepository<T>(tableName, options);

  return create<GenericEntityState<T>>((set, get) => ({
    entities: [],
    currentEntity: null,
    isLoading: false,
    error: null,
    pagination: null,

    setEntities: (entities) => set({ entities }),
    setCurrentEntity: (entity) => set({ currentEntity: entity }),
    setLoading: (loading) => set({ isLoading: loading }),
    setError: (error) => set({ error }),
    setPagination: (pagination) => set({ pagination }),

    fetchAll: async (pagination, filters) => {
      set({ isLoading: true, error: null });
      try {
        console.log('GenericEntityStore.fetchAll - Starting fetch for table:', tableName);
        const result = await repository.findAll(pagination, filters);
        
        if (result.error) {
          console.error('GenericEntityStore.fetchAll - Repository error:', result.error);
          set({ error: result.error, isLoading: false });
        } else {
          console.log('GenericEntityStore.fetchAll - Success:', {
            entitiesCount: result.data.length,
            pagination: result.pagination
          });
          set({ 
            entities: result.data, 
            pagination: result.pagination || null,
            isLoading: false 
          });
        }
      } catch (error) {
        console.error('GenericEntityStore.fetchAll - Unexpected error:', error);
        set({ 
          error: error instanceof Error ? error.message : 'Unknown error', 
          isLoading: false 
        });
      }
    },

    fetchById: async (id) => {
      set({ isLoading: true, error: null });
      try {
        const result = await repository.findById(id);
        if (result.error) {
          set({ error: result.error, isLoading: false });
        } else {
          set({ currentEntity: result.data, isLoading: false });
        }
      } catch (error) {
        set({ 
          error: error instanceof Error ? error.message : 'Unknown error', 
          isLoading: false 
        });
      }
    },

    createEntity: async (data) => {
      set({ isLoading: true, error: null });
      try {
        const result = await repository.create(data as any);
        if (result.error) {
          set({ error: result.error, isLoading: false });
          return false;
        } else {
          set({ isLoading: false });
          return true;
        }
      } catch (error) {
        set({ 
          error: error instanceof Error ? error.message : 'Unknown error', 
          isLoading: false 
        });
        return false;
      }
    },

    updateEntity: async (id, data) => {
      set({ isLoading: true, error: null });
      try {
        const result = await repository.update(id, data);
        if (result.error) {
          set({ error: result.error, isLoading: false });
          return false;
        } else {
          set({ isLoading: false });
          return true;
        }
      } catch (error) {
        set({ 
          error: error instanceof Error ? error.message : 'Unknown error', 
          isLoading: false 
        });
        return false;
      }
    },

    deleteEntity: async (id) => {
      set({ isLoading: true, error: null });
      try {
        const result = await repository.delete(id);
        if (result.error) {
          set({ error: result.error, isLoading: false });
          return false;
        } else {
          set({ isLoading: false });
          return true;
        }
      } catch (error) {
        set({ 
          error: error instanceof Error ? error.message : 'Unknown error', 
          isLoading: false 
        });
        return false;
      }
    },

    reset: () => set({
      entities: [],
      currentEntity: null,
      isLoading: false,
      error: null,
      pagination: null
    })
  }));
}
