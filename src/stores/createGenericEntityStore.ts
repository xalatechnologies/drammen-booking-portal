
import { create } from 'zustand';
import { PaginationParams, RepositoryResponse, PaginatedResponse } from '@/types/api';

export interface EntityStore<T> {
  items: T[];
  entities: T[]; // Add this alias for backward compatibility
  currentItem: T | null;
  currentEntity: T | null; // Add this alias for backward compatibility
  isLoading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  
  fetchAll: (params?: PaginationParams) => Promise<void>;
  fetchById: (id: string) => Promise<void>;
  create: (data: Partial<T>) => Promise<void>;
  createEntity: (data: Partial<T>) => Promise<void>; // Add this alias
  update: (id: string, data: Partial<T>) => Promise<void>;
  updateEntity: (id: string, data: Partial<T>) => Promise<void>; // Add this alias
  delete: (id: string) => Promise<void>;
  deleteEntity: (id: string) => Promise<void>; // Add this alias
  clearError: () => void;
  setError: (error: string | null) => void; // Add this method
  setCurrentItem: (item: T | null) => void;
  setCurrentEntity: (item: T | null) => void; // Add this alias
}

export function createGenericEntityStore<T extends { id: string }>(
  name: string
): () => EntityStore<T> {
  return create<EntityStore<T>>((set, get) => ({
    items: [],
    get entities() { return get().items; }, // Getter for backward compatibility
    currentItem: null,
    get currentEntity() { return get().currentItem; }, // Getter for backward compatibility
    isLoading: false,
    error: null,
    pagination: {
      page: 1,
      limit: 10,
      total: 0,
      totalPages: 0,
      hasNext: false,
      hasPrev: false,
    },

    fetchAll: async (params) => {
      set({ isLoading: true, error: null });
      try {
        // Use hooks instead of repository
        set({ 
          items: [], 
          pagination: params ? {
            page: params.page,
            limit: params.limit,
            total: 0,
            totalPages: 0,
            hasNext: false,
            hasPrev: false,
          } : get().pagination,
          isLoading: false 
        });
      } catch (error) {
        set({ error: `Failed to fetch ${name}`, isLoading: false });
      }
    },

    fetchById: async (id) => {
      set({ isLoading: true, error: null });
      try {
        // Use hooks instead of repository
        set({ currentItem: null, isLoading: false });
      } catch (error) {
        set({ error: `Failed to fetch ${name}`, isLoading: false });
      }
    },

    create: async (data) => {
      set({ isLoading: true, error: null });
      try {
        // Use hooks instead of repository
        set({ isLoading: false });
      } catch (error) {
        set({ error: `Failed to create ${name}`, isLoading: false });
      }
    },

    createEntity: async (data) => {
      return get().create(data);
    },

    update: async (id, data) => {
      set({ isLoading: true, error: null });
      try {
        // Use hooks instead of repository
        set({ isLoading: false });
      } catch (error) {
        set({ error: `Failed to update ${name}`, isLoading: false });
      }
    },

    updateEntity: async (id, data) => {
      return get().update(id, data);
    },

    delete: async (id) => {
      set({ isLoading: true, error: null });
      try {
        // Use hooks instead of repository
        set({ 
          items: get().items.filter(item => item.id !== id),
          isLoading: false 
        });
      } catch (error) {
        set({ error: `Failed to delete ${name}`, isLoading: false });
      }
    },

    deleteEntity: async (id) => {
      return get().delete(id);
    },

    clearError: () => set({ error: null }),
    setError: (error) => set({ error }),
    setCurrentItem: (item) => set({ currentItem: item }),
    setCurrentEntity: (item) => set({ currentItem: item }),
  }));
}
