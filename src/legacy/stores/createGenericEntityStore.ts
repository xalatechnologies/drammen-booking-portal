import { create } from 'zustand';
import { GenericEntityService } from '@/services/GenericEntityService';

/**
 * Create a generic entity store factory
 * 
 * This function creates a Zustand store for any entity type,
 * following our pattern of having repositories, DAL, and Zustand for all DB interactions.
 * 
 * @param table The database table name
 * @param options Configuration options
 */
export function createGenericEntityStore<T extends { id: number | string }>(
  table: string,
  options?: {
    related?: string[];
    idField?: string;
    statusField?: string;
    activeValue?: string;
  }
) {
  // Create the service for this entity type
  const service = new GenericEntityService<T>(table, options);
  
  // Define the store state type
  type State = {
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
    fetchList: (params?: any) => Promise<void>;
    fetchById: (id: string) => Promise<void>;
    create: (data: Partial<T>) => Promise<T | null>;
    update: (id: string | number, data: Partial<T>) => Promise<T | null>;
    delete: (id: string | number) => Promise<boolean>;
    setSelectedItem: (item: T | null) => void;
    clearError: () => void;
  };
  
  // Create and return the store
  return create<State>((set, get) => ({
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
    fetchList: async (params = {}) => {
      set({ isLoading: true, error: null });
      try {
        const response = await service.getList(params);
        if (response.data) {
          // Update the items with the response data
          set({
            items: response.data,
            isLoading: false
          });
          
          // If pagination info is available in params, update that too
          if (params.page) {
            set(state => ({
              pagination: {
                ...state.pagination,
                page: params.page || 1,
                limit: params.limit || 10
              }
            }));
          }
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
        const response = await service.getById(id);
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
        const response = await service.create(data);
        if (response.data) {
          // Add the new item to the list and update selected item
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
        const response = await service.update(String(id), data);
        if (response.data) {
          // Update the item in the list and the selected item
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
    
    delete: async (id) => {
      set({ isLoading: true, error: null });
      try {
        const response = await service.delete(String(id));
        if (response.data) {
          // Remove the item from the list and clear selected item if it was deleted
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
    }
  }));
}
