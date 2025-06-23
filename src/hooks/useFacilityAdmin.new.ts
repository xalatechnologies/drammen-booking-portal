import { create } from 'zustand';
import { toast } from 'sonner';
import { Facility } from '@/types/facility';
import { FacilityApi } from '@/stores/api/facilityApi';
import { createGenericStore } from '@/stores/createGenericStore';
import { combineMiddleware, createLogger, createPerformanceMonitor } from '@/middleware';

// Create a UI state store for facility management
interface FacilityUIState {
  viewMode: 'table' | 'grid' | 'list';
  filters: {
    search?: string;
    category?: string;
    status?: string;
  };
  formState: {
    isOpen: boolean;
    mode: 'create' | 'edit' | 'view';
  };
  
  // UI actions
  setViewMode: (mode: 'table' | 'grid' | 'list') => void;
  setFilters: (filters: Partial<FacilityUIState['filters']>) => void;
  setSearchFilter: (search: string) => void;
  setStatusFilter: (status: string) => void;
  setCategoryFilter: (category: string) => void;
  resetFilters: () => void;
  openCreateForm: () => void;
  openEditForm: () => void;
  closeForm: () => void;
}

// Create the base facility store using the generic store creator
const createBaseFacilityStore = () => {
  const api = new FacilityApi();
  return createGenericStore<Facility>(api);
};

// Create the facility UI store
const useFacilityUIStore = create<FacilityUIState>()(
  (set) => ({
    viewMode: 'table',
    filters: {
      search: '',
      category: 'all',
      status: 'all',
    },
    formState: {
      isOpen: false,
      mode: 'view',
    },
    
    setViewMode: (mode) => set({ viewMode: mode }),
    setFilters: (filters) => set((state) => ({ 
      filters: { ...state.filters, ...filters } 
    })),
    setSearchFilter: (search) => set((state) => ({ 
      filters: { ...state.filters, search } 
    })),
    setStatusFilter: (status) => set((state) => ({ 
      filters: { ...state.filters, status } 
    })),
    setCategoryFilter: (category) => set((state) => ({ 
      filters: { ...state.filters, category } 
    })),
    resetFilters: () => set({ 
      filters: { search: '', category: 'all', status: 'all' } 
    }),
    openCreateForm: () => set({ 
      formState: { isOpen: true, mode: 'create' } 
    }),
    openEditForm: () => set({ 
      formState: { isOpen: true, mode: 'edit' } 
    }),
    closeForm: () => set({ 
      formState: { isOpen: false, mode: 'view' } 
    }),
  })
);

// Create the facility store with middleware
export const useFacilityStore = create<ReturnType<typeof createBaseFacilityStore>>(
  combineMiddleware(
    createLogger('FacilityStore'),
    createPerformanceMonitor({ storeName: 'FacilityStore' })
  )(
    (set, get) => ({
      ...createBaseFacilityStore(),
    })
  )
);

/**
 * Facility Admin Hook
 * 
 * This custom hook combines the facility store with the UI-specific state,
 * providing a unified interface for components to interact with.
 * 
 * It follows the pattern of separating data and UI concerns while providing convenient
 * access to both through a single hook.
 */
export function useFacilityAdmin() {
  // Entity state and actions from the facility store
  const {
    items: facilities,
    selectedItem: selectedFacility,
    isLoading,
    error,
    fetchList,
    fetchById,
    create,
    update,
    remove: deleteEntity,
    setSelectedItem,
    clearError,
  } = useFacilityStore();
  
  // UI state and actions from the UI store
  const {
    viewMode,
    filters,
    formState,
    setViewMode,
    setFilters,
    setSearchFilter,
    setStatusFilter,
    setCategoryFilter,
    resetFilters,
    openCreateForm,
    openEditForm,
    closeForm,
  } = useFacilityUIStore();
  
  // Combined actions that interact with both stores
  const handleFacilitySelect = (facility: Facility) => {
    setSelectedItem(facility);
    openEditForm();
  };
  
  const fetchFacilities = async (params = {}) => {
    // Combine UI filters with any additional params
    const queryParams = {
      ...filters,
      ...params,
    };
    
    // Convert 'all' values to undefined so they don't filter the results
    Object.keys(queryParams).forEach(key => {
      if (queryParams[key] === 'all') {
        delete queryParams[key];
      }
    });
    
    return fetchList({ filters: queryParams });
  };
  
  const createFacility = async (data: Partial<Facility>) => {
    try {
      const result = await create(data);
      if (result) {
        toast.success('Facility created successfully');
        closeForm();
        return result;
      }
      return null;
    } catch (error) {
      toast.error(`Error creating facility: ${error.message}`);
      throw error;
    }
  };
  
  const updateFacility = async (id: string, data: Partial<Facility>) => {
    try {
      const result = await update(id, data);
      if (result) {
        toast.success('Facility updated successfully');
        closeForm();
        return result;
      }
      return null;
    } catch (error) {
      toast.error(`Error updating facility: ${error.message}`);
      throw error;
    }
  };
  
  const deleteFacility = async (id: string) => {
    try {
      const result = await deleteEntity(id);
      if (result) {
        toast.success('Facility deleted successfully');
        closeForm();
        return true;
      }
      return false;
    } catch (error) {
      toast.error(`Error deleting facility: ${error.message}`);
      throw error;
    }
  };
  
  return {
    // Entity state
    facilities,
    selectedFacility,
    isLoading,
    error,
    
    // UI state
    viewMode,
    filters,
    formState,
    
    // Entity actions
    fetchFacilities,
    fetchFacilityById: fetchById,
    createFacility,
    updateFacility,
    deleteFacility,
    setSelectedFacility: setSelectedItem,
    clearError,
    
    // UI actions
    setViewMode,
    setFilters,
    setSearchFilter,
    setStatusFilter,
    setCategoryFilter,
    resetFilters,
    openCreateForm,
    openEditForm,
    closeForm,
    
    // Combined actions
    handleFacilitySelect,
  };
}
