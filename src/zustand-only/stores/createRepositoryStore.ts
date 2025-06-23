import { create } from 'zustand';
import { BaseRepository } from '@/dal/BaseRepository';
import { PaginationParams, RepositoryResponse } from '@/types/api';

/**
 * Generic store state interface that bridges the repository pattern with Zustand
 */
export interface RepositoryStoreState<T extends Record<string, any>> {
  // State
  items: T[];
  selectedItem: T | null;
  isLoading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  
  // Actions
  fetchList: (pagination?: PaginationParams, filters?: any) => Promise<void>;
  fetchById: (id: string) => Promise<void>;
  create: (data: Omit<T, 'id' | 'created_at' | 'updated_at'>) => Promise<T | null>;
  update: (id: string, data: Partial<Omit<T, 'id' | 'created_at'>>) => Promise<T | null>;
  remove: (id: string) => Promise<boolean>;
  setSelectedItem: (item: T | null) => void;
  clearError: () => void;
  reset: () => void;
}

/**
 * Create a Zustand store that wraps a repository
 * This provides a bridge between the existing repository pattern and Zustand
 * 
 * @param repository The repository instance that implements BaseRepository
 * @returns A Zustand store with CRUD operations
 */
export function createRepositoryStore<T extends Record<string, any>>(
  repository: BaseRepository<T>
) {
  // Define the store
  return create<RepositoryStoreState<T>>((set, get) => ({
    // Initial state
    items: [],
    selectedItem: null,
    isLoading: false,
    error: null,
    pagination: {
      page: 1,
      limit: 10,
      total: 0,
      totalPages: 0
    },
    
    // Actions
    fetchList: async (pagination = { page: 1, limit: 10 }, filters = {}) => {
      set({ isLoading: true, error: null });
      try {
        const response = await repository.findAll(pagination);
        if (response.data) {
          set({
            items: response.data,
            isLoading: false,
            pagination: {
              page: pagination.page,
              limit: pagination.limit,
              total: response.meta?.pagination?.total || response.data.length,
              totalPages: response.meta?.pagination?.totalPages || 
                Math.ceil((response.meta?.pagination?.total || response.data.length) / pagination.limit)
            }
          });
        } else {
          set({ error: response.error || 'Failed to fetch items', isLoading: false });
        }
      } catch (error) {
        set({ error: (error as Error).message || 'An unexpected error occurred', isLoading: false });
      }
    },
    
    fetchById: async (id) => {
      set({ isLoading: true, error: null });
      try {
        const response = await repository.findById(id);
        if (response.data) {
          set({ selectedItem: response.data, isLoading: false });
        } else {
          set({ error: response.error || 'Failed to fetch item', isLoading: false });
        }
      } catch (error) {
        set({ error: (error as Error).message || 'An unexpected error occurred', isLoading: false });
      }
    },
    
    create: async (data) => {
      set({ isLoading: true, error: null });
      try {
        const response = await repository.create(data);
        if (response.data) {
          const newItem = response.data;
          set(state => ({
            items: [...state.items, newItem],
            selectedItem: newItem,
            isLoading: false
          }));
          return newItem;
        } else {
          set({ error: response.error || 'Failed to create item', isLoading: false });
          return null;
        }
      } catch (error) {
        set({ error: (error as Error).message || 'An unexpected error occurred', isLoading: false });
        return null;
      }
    },
    
    update: async (id, data) => {
      set({ isLoading: true, error: null });
      try {
        const response = await repository.update(id, data);
        if (response.data) {
          const updatedItem = response.data;
          set(state => ({
            items: state.items.map(item => 
              item.id === updatedItem.id ? updatedItem : item
            ),
            selectedItem: state.selectedItem?.id === updatedItem.id ? updatedItem : state.selectedItem,
            isLoading: false
          }));
          return updatedItem;
        } else {
          set({ error: response.error || 'Failed to update item', isLoading: false });
          return null;
        }
      } catch (error) {
        set({ error: (error as Error).message || 'An unexpected error occurred', isLoading: false });
        return null;
      }
    },
    
    remove: async (id) => {
      set({ isLoading: true, error: null });
      try {
        const response = await repository.delete(id);
        if (response.data) {
          set(state => ({
            items: state.items.filter(item => item.id !== id),
            selectedItem: state.selectedItem?.id === id ? null : state.selectedItem,
            isLoading: false
          }));
          return true;
        } else {
          set({ error: response.error || 'Failed to delete item', isLoading: false });
          return false;
        }
      } catch (error) {
        set({ error: (error as Error).message || 'An unexpected error occurred', isLoading: false });
        return false;
      }
    },
    
    setSelectedItem: (item) => {
      set({ selectedItem: item });
    },
    
    clearError: () => {
      set({ error: null });
    },
    
    reset: () => {
      set({
        items: [],
        selectedItem: null,
        isLoading: false,
        error: null,
        pagination: {
          page: 1,
          limit: 10,
          total: 0,
          totalPages: 0
        }
      });
    }
  }));
}
