import { create } from 'zustand';
import { BaseEntity, ApiResponse, PaginatedResponse, QueryParams } from '../types/entity';

/**
 * Generic store state interface
 */
export interface GenericStoreState<T extends BaseEntity> {
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
  fetchList: (params?: QueryParams) => Promise<PaginatedResponse<T> | null>;
  fetchById: (id: string | number) => Promise<T | null>;
  create: (data: Partial<T>) => Promise<T | null>;
  update: (id: string | number, data: Partial<T>) => Promise<T | null>;
  remove: (id: string | number) => Promise<boolean>;
  setSelectedItem: (item: T | null) => void;
  clearError: () => void;
  reset: () => void;
}

/**
 * Generic store API interface
 * This interface defines the methods that must be implemented by any API adapter
 */
export interface GenericStoreApi<T extends BaseEntity> {
  getList: (params?: QueryParams) => Promise<ApiResponse<PaginatedResponse<T>>>;
  getById: (id: string | number) => Promise<ApiResponse<T>>;
  create: (data: Partial<T>) => Promise<ApiResponse<T>>;
  update: (id: string | number, data: Partial<T>) => Promise<ApiResponse<T>>;
  remove: (id: string | number) => Promise<ApiResponse<boolean>>;
}

/**
 * Create a generic Zustand store for any entity type
 * 
 * @param api The API adapter that implements GenericStoreApi
 * @param options Additional options for the store
 * @returns A Zustand store with generic CRUD operations
 */
export function createGenericStore<T extends BaseEntity>(
  api: GenericStoreApi<T>,
  options?: {
    initialState?: Partial<Omit<GenericStoreState<T>, 'fetchList' | 'fetchById' | 'create' | 'update' | 'remove' | 'setSelectedItem' | 'clearError' | 'reset'>>;
    persistKey?: string;
  }
) {
  // Define the store
  return create<GenericStoreState<T>>((set, get) => ({
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
    ...(options?.initialState || {}),
    
    // Actions
    fetchList: async (params = {}) => {
      set({ isLoading: true, error: null });
      try {
        const response = await api.getList(params);
        if (response.data) {
          set({
            items: response.data.items,
            pagination: {
              page: response.data.page,
              limit: response.data.limit,
              total: response.data.total,
              totalPages: response.data.totalPages
            },
            isLoading: false
          });
          return response.data;
        } else {
          set({ error: response.error || 'Failed to fetch items', isLoading: false });
          return null;
        }
      } catch (error) {
        set({ error: (error as Error).message || 'An unexpected error occurred', isLoading: false });
        return null;
      }
    },
    
    fetchById: async (id) => {
      set({ isLoading: true, error: null });
      try {
        const response = await api.getById(id);
        if (response.data) {
          set({ selectedItem: response.data, isLoading: false });
          return response.data;
        } else {
          set({ error: response.error || 'Failed to fetch item', isLoading: false });
          return null;
        }
      } catch (error) {
        set({ error: (error as Error).message || 'An unexpected error occurred', isLoading: false });
        return null;
      }
    },
    
    create: async (data) => {
      set({ isLoading: true, error: null });
      try {
        const response = await api.create(data);
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
        const response = await api.update(id, data);
        if (response.data) {
          const updatedItem = response.data;
          set(state => ({
            items: state.items.map(item => item.id === updatedItem.id ? updatedItem : item),
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
        const response = await api.remove(id);
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
