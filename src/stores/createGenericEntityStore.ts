import { create } from 'zustand';
import { PaginationParams, RepositoryResponse, PaginatedResponse } from '@/types/api';

export interface EntityStore<T> {
  items: T[];
  currentItem: T | null;
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
  update: (id: string, data: Partial<T>) => Promise<void>;
  delete: (id: string) => Promise<void>;
  clearError: () => void;
  setCurrentItem: (item: T | null) => void;
}

export function createGenericEntityStore<T extends { id: string }>(
  name: string
): () => EntityStore<T> {
  return create<EntityStore<T>>((set, get) => ({
    items: [],
    currentItem: null,
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

    update: async (id, data) => {
      set({ isLoading: true, error: null });
      try {
        // Use hooks instead of repository
        set({ isLoading: false });
      } catch (error) {
        set({ error: `Failed to update ${name}`, isLoading: false });
      }
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

    clearError: () => set({ error: null }),
    setCurrentItem: (item) => set({ currentItem: item }),
  }));
}
