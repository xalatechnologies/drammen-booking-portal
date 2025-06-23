import { create } from 'zustand';

/**
 * Facility UI State Store
 * 
 * This store manages UI-specific state for facility management,
 * separate from the data concerns which are handled by the generic entity store.
 * This separation follows the single responsibility principle and makes the code more maintainable.
 */
type FacilityUIState = {
  // UI State
  viewMode: 'list' | 'grid' | 'table';
  filters: {
    search: string;
    status: string;
    category: string;
  };
  formState: {
    isOpen: boolean;
    isEdit: boolean;
  };
  
  // UI Actions
  setViewMode: (mode: 'list' | 'grid' | 'table') => void;
  setFilters: (filters: Partial<FacilityUIState['filters']>) => void;
  setSearchFilter: (search: string) => void;
  setStatusFilter: (status: string) => void;
  setCategoryFilter: (category: string) => void;
  resetFilters: () => void;
  openCreateForm: () => void;
  openEditForm: () => void;
  closeForm: () => void;
};

export const useFacilityUIStore = create<FacilityUIState>((set) => ({
  // Initial UI State
  viewMode: 'list',
  filters: {
    search: '',
    status: 'all',
    category: 'all',
  },
  formState: {
    isOpen: false,
    isEdit: false,
  },
  
  // UI Actions
  setViewMode: (mode) => set({ viewMode: mode }),
  
  setFilters: (filters) => set((state) => ({
    filters: { ...state.filters, ...filters },
  })),
  
  setSearchFilter: (search) => set((state) => ({
    filters: { ...state.filters, search },
  })),
  
  setStatusFilter: (status) => set((state) => ({
    filters: { ...state.filters, status },
  })),
  
  setCategoryFilter: (category) => set((state) => ({
    filters: { ...state.filters, category },
  })),
  
  resetFilters: () => set({
    filters: {
      search: '',
      status: 'all',
      category: 'all',
    },
  }),
  
  openCreateForm: () => set({
    formState: {
      isOpen: true,
      isEdit: false,
    },
  }),
  
  openEditForm: () => set({
    formState: {
      isOpen: true,
      isEdit: true,
    },
  }),
  
  closeForm: () => set({
    formState: {
      isOpen: false,
      isEdit: false,
    },
  }),
}));
