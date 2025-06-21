
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Facility, FacilityFilters, FacilitySortOptions } from '@/types/facility';
import { PaginationParams } from '@/types/api';

interface FacilityState {
  // Facilities data
  facilities: Facility[];
  currentFacility: Facility | null;
  totalCount: number;
  pagination: PaginationParams;
  
  // Filters and search
  filters: FacilityFilters;
  sortOptions: FacilitySortOptions;
  searchTerm: string;
  
  // UI state
  isLoading: boolean;
  error: string | null;
  viewMode: 'grid' | 'list' | 'map';
  
  // Actions
  setFacilities: (facilities: Facility[], total: number) => void;
  setCurrentFacility: (facility: Facility | null) => void;
  updateFacility: (facilityId: string, updates: Partial<Facility>) => void;
  setFilters: (filters: Partial<FacilityFilters>) => void;
  setSortOptions: (sort: FacilitySortOptions) => void;
  setSearchTerm: (term: string) => void;
  setPagination: (pagination: Partial<PaginationParams>) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setViewMode: (mode: 'grid' | 'list' | 'map') => void;
  clearFilters: () => void;
  reset: () => void;
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

const initialSortOptions: FacilitySortOptions = {
  field: 'name',
  direction: 'asc'
};

export const useFacilityStore = create<FacilityState>()(
  persist(
    (set, get) => ({
      // Initial state
      facilities: [],
      currentFacility: null,
      totalCount: 0,
      pagination: { page: 1, limit: 12 },
      filters: initialFilters,
      sortOptions: initialSortOptions,
      searchTerm: '',
      isLoading: false,
      error: null,
      viewMode: 'grid',

      // Actions
      setFacilities: (facilities, total) => {
        set({ facilities, totalCount: total, isLoading: false, error: null });
      },

      setCurrentFacility: (facility) => {
        set({ currentFacility: facility });
      },

      updateFacility: (facilityId, updates) => {
        set(state => ({
          facilities: state.facilities.map(facility =>
            facility.id.toString() === facilityId 
              ? { ...facility, ...updates }
              : facility
          ),
          currentFacility: state.currentFacility?.id.toString() === facilityId
            ? { ...state.currentFacility, ...updates }
            : state.currentFacility
        }));
      },

      setFilters: (newFilters) => {
        set(state => ({
          filters: { ...state.filters, ...newFilters },
          pagination: { ...state.pagination, page: 1 } // Reset to first page
        }));
      },

      setSortOptions: (sort) => {
        set({ sortOptions: sort });
      },

      setSearchTerm: (term) => {
        set({ 
          searchTerm: term,
          pagination: { ...get().pagination, page: 1 } // Reset to first page
        });
      },

      setPagination: (newPagination) => {
        set(state => ({
          pagination: { ...state.pagination, ...newPagination }
        }));
      },

      setLoading: (loading) => {
        set({ isLoading: loading });
      },

      setError: (error) => {
        set({ error, isLoading: false });
      },

      setViewMode: (mode) => {
        set({ viewMode: mode });
      },

      clearFilters: () => {
        set({
          filters: initialFilters,
          searchTerm: '',
          pagination: { page: 1, limit: 12 }
        });
      },

      reset: () => {
        set({
          facilities: [],
          currentFacility: null,
          totalCount: 0,
          pagination: { page: 1, limit: 12 },
          filters: initialFilters,
          sortOptions: initialSortOptions,
          searchTerm: '',
          isLoading: false,
          error: null,
          viewMode: 'grid'
        });
      }
    }),
    {
      name: 'facility-storage',
      partialize: (state) => ({
        viewMode: state.viewMode,
        filters: state.filters,
        sortOptions: state.sortOptions,
        pagination: state.pagination
      }),
    }
  )
);
