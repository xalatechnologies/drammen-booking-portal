
import { create } from 'zustand';

interface FacilityFilters {
  search?: string;
  status?: string;
  category?: string;
}

interface FacilityFormState {
  isOpen: boolean;
  mode: 'create' | 'edit' | 'view';
  facilityId?: string;
}

interface FacilityUIState {
  viewMode: 'table' | 'grid' | 'list' | 'map';
  filters: FacilityFilters;
  formState: FacilityFormState;
  
  // Actions
  setViewMode: (mode: 'table' | 'grid' | 'list' | 'map') => void;
  setFilters: (filters: Partial<FacilityFilters>) => void;
  setSearchFilter: (search: string) => void;
  setStatusFilter: (status: string) => void;
  setCategoryFilter: (category: string) => void;
  resetFilters: () => void;
  
  // Form actions
  openCreateForm: () => void;
  openEditForm: (facilityId?: string) => void;
  closeForm: () => void;
}

export const useFacilityUIStore = create<FacilityUIState>((set) => ({
  viewMode: 'table',
  filters: {
    search: '',
    status: 'all',
    category: 'all',
  },
  formState: {
    isOpen: false,
    mode: 'create',
  },
  
  setViewMode: (mode) => set({ viewMode: mode }),
  
  setFilters: (newFilters) => 
    set((state) => ({ 
      filters: { ...state.filters, ...newFilters } 
    })),
    
  setSearchFilter: (search) => 
    set((state) => ({ 
      filters: { ...state.filters, search } 
    })),
    
  setStatusFilter: (status) => 
    set((state) => ({ 
      filters: { ...state.filters, status } 
    })),
    
  setCategoryFilter: (category) => 
    set((state) => ({ 
      filters: { ...state.filters, category } 
    })),
    
  resetFilters: () => 
    set({ 
      filters: { search: '', status: 'all', category: 'all' } 
    }),
    
  openCreateForm: () => 
    set({ 
      formState: { isOpen: true, mode: 'create' } 
    }),
    
  openEditForm: (facilityId) => 
    set({ 
      formState: { isOpen: true, mode: 'edit', facilityId } 
    }),
    
  closeForm: () => 
    set({ 
      formState: { isOpen: false, mode: 'create' } 
    }),
}));

