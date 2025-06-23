import { create } from 'zustand';
import { supabase } from '@/integrations/supabase/client';
import { PaginationParams } from '@/types/api';

/**
 * Generic store state interface for direct Supabase access
 */
export interface DirectStoreState<T extends Record<string, any>> {
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
  fetchList: (params?: {
    pagination?: PaginationParams;
    filters?: Record<string, any>;
    orderBy?: string;
    orderDirection?: 'asc' | 'desc';
  }) => Promise<void>;
  fetchById: (id: string | number) => Promise<void>;
  create: (data: Omit<T, 'id' | 'created_at' | 'updated_at'>) => Promise<T | null>;
  update: (id: string | number, data: Partial<Omit<T, 'id' | 'created_at'>>) => Promise<T | null>;
  remove: (id: string | number) => Promise<boolean>;
  setSelectedItem: (item: T | null) => void;
  clearError: () => void;
  reset: () => void;
}

/**
 * Create a Zustand store that directly accesses Supabase
 * This eliminates the need for repositories and DAL
 * 
 * @param table The database table name
 * @param options Configuration options
 * @returns A Zustand store with CRUD operations
 */
export function createDirectStore<T extends Record<string, any>>(
  table: string,
  options: {
    related?: string[];
    idField?: string;
    statusField?: string;
    activeValue?: string;
  } = {}
) {
  const idField = options.idField || 'id';
  const statusField = options.statusField;
  const activeValue = options.activeValue || 'active';
  const related = options.related || [];
  
  // Define the store
  return create<DirectStoreState<T>>((set, get) => ({
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
        const pagination = params.pagination || { page: 1, limit: 10 };
        const filters = params.filters || {};
        const orderBy = params.orderBy || 'created_at';
        const orderDirection = params.orderDirection || 'desc';
        
        // Calculate range for pagination
        const from = (pagination.page - 1) * pagination.limit;
        const to = from + pagination.limit - 1;
        
        // Build query
        let query = supabase.from(table);
        
        // Add related tables if specified
        if (related.length > 0) {
          query = query.select(`*, ${related.join(', ')}`);
        } else {
          query = query.select('*');
        }
        
        // Apply status filter if needed
        if (statusField) {
          query = query.eq(statusField, activeValue);
        }
        
        // Apply custom filters
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            if (typeof value === 'object') {
              // Handle range filters, etc.
              if ('gt' in value) query = query.gt(key, value.gt);
              if ('gte' in value) query = query.gte(key, value.gte);
              if ('lt' in value) query = query.lt(key, value.lt);
              if ('lte' in value) query = query.lte(key, value.lte);
              if ('in' in value) query = query.in(key, value.in);
              if ('contains' in value) query = query.ilike(key, `%${value.contains}%`);
            } else if (typeof value === 'string') {
              // String equality or pattern matching
              if (value.includes('*')) {
                // Use pattern matching for wildcards
                const pattern = value.replace(/\*/g, '%');
                query = query.ilike(key, pattern);
              } else {
                // Simple equality
                query = query.eq(key, value);
              }
            } else {
              // Simple equality for other types
              query = query.eq(key, value);
            }
          }
        });
        
        // Apply ordering
        query = query.order(orderBy, { ascending: orderDirection === 'asc' });
        
        // Apply pagination
        query = query.range(from, to);
        
        // Execute query
        const { data, error, count } = await query;
        
        if (error) throw error;
        
        // Update state with results
        set({
          items: data as T[],
          isLoading: false,
          pagination: {
            page: pagination.page,
            limit: pagination.limit,
            total: count || 0,
            totalPages: count ? Math.ceil(count / pagination.limit) : 0
          }
        });
      } catch (error) {
        console.error('Error fetching list:', error);
        set({ 
          error: (error as Error).message || 'Failed to fetch items', 
          isLoading: false 
        });
      }
    },
    
    fetchById: async (id) => {
      set({ isLoading: true, error: null });
      try {
        // Build query
        let query = supabase.from(table);
        
        // Add related tables if specified
        if (related.length > 0) {
          query = query.select(`*, ${related.join(', ')}`);
        } else {
          query = query.select('*');
        }
        
        // Filter by ID
        query = query.eq(idField, id);
        
        // Execute query
        const { data, error } = await query.single();
        
        if (error) throw error;
        
        // Update state with result
        set({
          selectedItem: data as T,
          isLoading: false
        });
      } catch (error) {
        console.error('Error fetching item:', error);
        set({ 
          error: (error as Error).message || 'Failed to fetch item', 
          isLoading: false 
        });
      }
    },
    
    create: async (data) => {
      set({ isLoading: true, error: null });
      try {
        // Execute insert
        const { data: newData, error } = await supabase
          .from(table)
          .insert(data)
          .select();
        
        if (error) throw error;
        
        if (newData && newData.length > 0) {
          const newItem = newData[0] as T;
          
          // Update state with new item
          set(state => ({
            items: [...state.items, newItem],
            selectedItem: newItem,
            isLoading: false
          }));
          
          return newItem;
        } else {
          throw new Error('No data returned after create');
        }
      } catch (error) {
        console.error('Error creating item:', error);
        set({ 
          error: (error as Error).message || 'Failed to create item', 
          isLoading: false 
        });
        return null;
      }
    },
    
    update: async (id, data) => {
      set({ isLoading: true, error: null });
      try {
        // Execute update
        const { data: updatedData, error } = await supabase
          .from(table)
          .update(data)
          .eq(idField, id)
          .select();
        
        if (error) throw error;
        
        if (updatedData && updatedData.length > 0) {
          const updatedItem = updatedData[0] as T;
          
          // Update state with updated item
          set(state => ({
            items: state.items.map(item => 
              item[idField] === updatedItem[idField] ? updatedItem : item
            ),
            selectedItem: state.selectedItem && state.selectedItem[idField] === updatedItem[idField] 
              ? updatedItem 
              : state.selectedItem,
            isLoading: false
          }));
          
          return updatedItem;
        } else {
          throw new Error('No data returned after update');
        }
      } catch (error) {
        console.error('Error updating item:', error);
        set({ 
          error: (error as Error).message || 'Failed to update item', 
          isLoading: false 
        });
        return null;
      }
    },
    
    remove: async (id) => {
      set({ isLoading: true, error: null });
      try {
        // Check if we should do a soft delete
        if (statusField) {
          // Soft delete - update status
          const { error } = await supabase
            .from(table)
            .update({ [statusField]: 'inactive' })
            .eq(idField, id);
          
          if (error) throw error;
        } else {
          // Hard delete
          const { error } = await supabase
            .from(table)
            .delete()
            .eq(idField, id);
          
          if (error) throw error;
        }
        
        // Update state
        set(state => ({
          items: state.items.filter(item => item[idField] !== id),
          selectedItem: state.selectedItem && state.selectedItem[idField] === id 
            ? null 
            : state.selectedItem,
          isLoading: false
        }));
        
        return true;
      } catch (error) {
        console.error('Error removing item:', error);
        set({ 
          error: (error as Error).message || 'Failed to remove item', 
          isLoading: false 
        });
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
