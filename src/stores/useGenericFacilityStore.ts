import { Facility, FacilityFilters } from '@/types/facility';
import { createGenericEntityStore } from './createGenericEntityStore';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type FacilityAdminViewMode = 'table' | 'grid' | 'list' | 'map';
export type FacilityAdminFormMode = 'create' | 'edit' | 'view';

// Create the base generic entity store for facilities
const useBaseFacilityStore = createGenericEntityStore<Facility>('facilities', {
  related: ['facility_opening_hours', 'zones', 'facility_images'],
  statusField: 'status',
  activeValue: 'active'
});

// Extend the generic store with facility-specific functionality
interface FacilityAdminState {
  // UI state
  viewMode: FacilityAdminViewMode;
  isFormOpen: boolean;
  formMode: FacilityAdminFormMode;
  filters: FacilityFilters;
  
  // Actions
  setFilters: (filters: Partial<FacilityFilters>) => void;
  setViewMode: (mode: FacilityAdminViewMode) => void;
  openForm: (mode: FacilityAdminFormMode, facility?: Facility) => void;
  closeForm: () => void;
}

// Initial filters state
const initialFilters: FacilityFilters = {
  searchTerm: undefined,
  facilityType: undefined,
  location: undefined,
  accessibility: undefined,
  capacity: undefined,
  date: undefined,
  priceRange: undefined,
  availableNow: undefined,
  amenities: [],
};

// Create the extended store with UI-specific state and actions
export const useGenericFacilityStore = create<FacilityAdminState>()(
  persist(
    (set) => ({
      // UI state
      viewMode: 'table' as FacilityAdminViewMode,
      isFormOpen: false,
      formMode: 'view' as FacilityAdminFormMode,
      filters: initialFilters,
      
      // Actions
      setFilters: (filters) => set((state) => ({ 
        filters: { ...state.filters, ...filters } 
      })),
      
      setViewMode: (mode) => set({ viewMode: mode }),
      
      openForm: (mode, facility) => {
        // Get the base store's setSelectedItem function
        const { setSelectedItem } = useBaseFacilityStore.getState();
        
        // Set the selected facility in the base store
        if (facility) {
          setSelectedItem(facility);
        } else if (mode === 'create') {
          setSelectedItem(null);
        }
        
        // Update the UI state
        set({ 
          isFormOpen: true,
          formMode: mode
        });
      },
      
      closeForm: () => set({ isFormOpen: false }),
    }),
    {
      name: 'facility-admin-ui-storage',
      partialize: (state) => ({
        viewMode: state.viewMode,
        filters: state.filters,
      }),
    }
  )
);

// Create a combined hook that merges both stores for easier consumption
export const useFacilityStore = () => {
  const baseStore = useBaseFacilityStore();
  const uiStore = useGenericFacilityStore();
  
  return {
    // Data and state from base store
    items: baseStore.items,
    selectedItem: baseStore.selectedItem,
    isLoading: baseStore.isLoading,
    error: baseStore.error,
    pagination: baseStore.pagination,
    
    // UI state
    viewMode: uiStore.viewMode,
    isFormOpen: uiStore.isFormOpen,
    formMode: uiStore.formMode,
    filters: uiStore.filters,
    
    // Actions from base store
    fetchList: baseStore.fetchList,
    fetchById: baseStore.fetchById,
    create: baseStore.create,
    update: baseStore.update,
    delete: baseStore.delete,
    setSelectedItem: baseStore.setSelectedItem,
    clearError: baseStore.clearError,
    
    // Actions from UI store
    setFilters: uiStore.setFilters,
    setViewMode: uiStore.setViewMode,
    openForm: uiStore.openForm,
    closeForm: uiStore.closeForm,
    
    // Convenience methods that map to the old API
    loadFacilities: (filters?: FacilityFilters) => {
      if (filters) {
        uiStore.setFilters(filters);
      }
      
      const queryParams: Record<string, any> = {};
      
      // Map filters to query params
      if (uiStore.filters.searchTerm) {
        queryParams.name = uiStore.filters.searchTerm;
      }
      
      if (uiStore.filters.facilityType) {
        queryParams.type = uiStore.filters.facilityType;
      }
      
      if (uiStore.filters.location) {
        queryParams.area = uiStore.filters.location;
      }
      
      return baseStore.fetchList({
        ...queryParams,
        page: baseStore.pagination.page,
        limit: baseStore.pagination.limit,
        orderBy: 'name',
        orderDirection: 'asc'
      });
    },
    
    createFacility: baseStore.create,
    updateFacility: baseStore.update,
    deleteFacility: baseStore.delete,
    setCurrentFacility: baseStore.setSelectedItem,
    
    // Additional computed properties for compatibility
    facilities: baseStore.items,
    currentFacility: baseStore.selectedItem,
    totalCount: baseStore.pagination.total,
  };
};
