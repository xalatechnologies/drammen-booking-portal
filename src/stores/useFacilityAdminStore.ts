
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Facility, FacilityFilters } from '@/types/facility';
import { PaginationParams } from '@/types/api';
import { FacilityService } from '@/services/facilityService';

export type FacilityAdminViewMode = 'table' | 'grid' | 'list' | 'map';
export type FacilityAdminFormMode = 'create' | 'edit' | 'view';

interface FacilityAdminState {
  facilities: Facility[];
  currentFacility: Facility | null;
  totalCount: number;
  isLoading: boolean;
  error: string | null;
  filters: FacilityFilters;
  pagination: PaginationParams;
  viewMode: FacilityAdminViewMode;
  isFormOpen: boolean;
  formMode: FacilityAdminFormMode;
  // Actions
  loadFacilities: (filters?: FacilityFilters) => Promise<void>;
  createFacility: (data: Partial<Facility>) => Promise<{ success: boolean; data?: Facility; error?: string }>;
  updateFacility: (id: string, data: Partial<Facility>) => Promise<{ success: boolean; data?: Facility; error?: string }>;
  deleteFacility: (id: string) => Promise<void>;
  setCurrentFacility: (facility: Facility | null) => void;
  setFilters: (filters: Partial<FacilityFilters>) => void;
  setPagination: (pagination: Partial<PaginationParams>) => void;
  setViewMode: (mode: FacilityAdminViewMode) => void;
  openForm: (mode: FacilityAdminFormMode, facility?: Facility) => void;
  closeForm: () => void;
  clearError: () => void;
}

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

export const useFacilityAdminStore = create<FacilityAdminState>()(
  persist(
    (set, get) => ({
      facilities: [],
      currentFacility: null,
      totalCount: 0,
      isLoading: false,
      error: null,
      filters: initialFilters,
      pagination: { page: 1, limit: 20 },
      viewMode: 'table',
      isFormOpen: false,
      formMode: 'view',
      // Actions
      loadFacilities: async (filters) => {
        set({ isLoading: true, error: null });
        try {
          const { pagination } = get();
          const result = await FacilityService.getFacilities(
            pagination,
            filters || get().filters,
            undefined
          );
          if (result.success && result.data) {
            set({
              facilities: result.data.data,
              totalCount: result.data.pagination.total,
              isLoading: false,
              error: null,
            });
          } else {
            set({ 
              facilities: [], 
              totalCount: 0, 
              isLoading: false, 
              error: typeof result.error === 'string' ? result.error : result.error?.message || 'Failed to load facilities'
            });
          }
        } catch (error: any) {
          set({ facilities: [], totalCount: 0, isLoading: false, error: error.message || 'Failed to load facilities' });
        }
      },
      createFacility: async (data) => {
        set({ isLoading: true, error: null });
        try {
          const result = await FacilityService.createFacility(data);
          if (result.success && result.data) {
            set(state => ({
              facilities: [result.data!, ...state.facilities],
              isLoading: false,
              error: null,
              isFormOpen: false,
            }));
            await get().loadFacilities();
            return { success: true, data: result.data };
          } else {
            const errorMsg = typeof result.error === 'string' ? result.error : result.error?.message || 'Failed to create facility';
            set({ isLoading: false, error: errorMsg });
            return { success: false, error: errorMsg };
          }
        } catch (error: any) {
          const errorMsg = error.message || 'Failed to create facility';
          set({ isLoading: false, error: errorMsg });
          return { success: false, error: errorMsg };
        }
      },
      updateFacility: async (id, data) => {
        set({ isLoading: true, error: null });
        try {
          const result = await FacilityService.updateFacility(id, data);
          if (result.success && result.data) {
            set(state => ({
              facilities: state.facilities.map(f => f.id.toString() === id ? result.data! : f),
              isLoading: false,
              error: null,
              isFormOpen: false,
            }));
            await get().loadFacilities();
            return { success: true, data: result.data };
          } else {
            const errorMsg = typeof result.error === 'string' ? result.error : result.error?.message || 'Failed to update facility';
            set({ isLoading: false, error: errorMsg });
            return { success: false, error: errorMsg };
          }
        } catch (error: any) {
          const errorMsg = error.message || 'Failed to update facility';
          set({ isLoading: false, error: errorMsg });
          return { success: false, error: errorMsg };
        }
      },
      deleteFacility: async (id) => {
        set({ isLoading: true, error: null });
        try {
          const result = await FacilityService.deleteFacility(id);
          if (result.success) {
            set(state => ({
              facilities: state.facilities.filter(f => f.id.toString() !== id),
              isLoading: false,
              error: null,
            }));
            await get().loadFacilities();
          } else {
            const errorMsg = typeof result.error === 'string' ? result.error : result.error?.message || 'Failed to delete facility';
            set({ isLoading: false, error: errorMsg });
          }
        } catch (error: any) {
          set({ isLoading: false, error: error.message || 'Failed to delete facility' });
        }
      },
      setCurrentFacility: (facility) => set({ currentFacility: facility }),
      setFilters: (filters) => set(state => ({ filters: { ...state.filters, ...filters }, pagination: { ...state.pagination, page: 1 } })),
      setPagination: (pagination) => set(state => ({ pagination: { ...state.pagination, ...pagination } })),
      setViewMode: (mode) => set({ viewMode: mode }),
      openForm: (mode, facility) => set({ isFormOpen: true, formMode: mode, currentFacility: facility || null }),
      closeForm: () => set({ isFormOpen: false, formMode: 'view', currentFacility: null }),
      clearError: () => set({ error: null }),
    }),
    {
      name: 'facility-admin-storage',
      partialize: (state) => ({
        filters: state.filters,
        pagination: state.pagination,
        viewMode: state.viewMode,
      }),
    }
  )
);
