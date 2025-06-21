
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AdditionalService, ServiceFilters } from '@/types/additionalServices';
import { PaginationParams } from '@/types/api';
import { AdditionalServicesService } from '@/services/AdditionalServicesService';

interface AdditionalServicesState {
  // Services data
  services: AdditionalService[];
  currentService: AdditionalService | null;
  totalCount: number;
  pagination: PaginationParams;
  filters: ServiceFilters;
  
  // UI state
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setServices: (services: AdditionalService[], total: number) => void;
  setCurrentService: (service: AdditionalService | null) => void;
  addService: (service: AdditionalService) => void;
  updateService: (serviceId: string, updates: Partial<AdditionalService>) => void;
  removeService: (serviceId: string) => void;
  setFilters: (filters: Partial<ServiceFilters>) => void;
  setPagination: (pagination: Partial<PaginationParams>) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  // Async actions
  fetchServices: () => Promise<void>;
  fetchServiceById: (id: string) => Promise<void>;
  fetchServicesByCategory: (category: string, facilityId?: string) => Promise<void>;
  createService: (serviceData: Partial<AdditionalService>) => Promise<void>;
  updateServiceAsync: (id: string, serviceData: Partial<AdditionalService>) => Promise<void>;
  deleteService: (id: string) => Promise<void>;
  
  reset: () => void;
}

const initialFilters: ServiceFilters = {
  searchTerm: undefined,
  category: undefined,
  isActive: undefined,
  facilityId: undefined,
  priceRange: undefined
};

export const useAdditionalServicesStore = create<AdditionalServicesState>()(
  persist(
    (set, get) => ({
      // Initial state
      services: [],
      currentService: null,
      totalCount: 0,
      pagination: { page: 1, limit: 20 },
      filters: initialFilters,
      isLoading: false,
      error: null,

      // Actions
      setServices: (services, total) => {
        set({ services, totalCount: total, isLoading: false, error: null });
      },

      setCurrentService: (service) => {
        set({ currentService: service });
      },

      addService: (service) => {
        set(state => ({
          services: [...state.services, service],
          totalCount: state.totalCount + 1
        }));
      },

      updateService: (serviceId, updates) => {
        set(state => ({
          services: state.services.map(service =>
            service.id === serviceId ? { ...service, ...updates } : service
          ),
          currentService: state.currentService?.id === serviceId
            ? { ...state.currentService, ...updates }
            : state.currentService
        }));
      },

      removeService: (serviceId) => {
        set(state => ({
          services: state.services.filter(service => service.id !== serviceId),
          totalCount: state.totalCount - 1,
          currentService: state.currentService?.id === serviceId ? null : state.currentService
        }));
      },

      setFilters: (newFilters) => {
        set(state => ({
          filters: { ...state.filters, ...newFilters },
          pagination: { ...state.pagination, page: 1 }
        }));
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

      // Async actions
      fetchServices: async () => {
        const { setLoading, setError, setServices, pagination, filters } = get();
        setLoading(true);
        setError(null);

        try {
          const result = await AdditionalServicesService.getServices(pagination, filters);
          if (result.data) {
            setServices(result.data.data || [], result.data.pagination?.total || 0);
          } else {
            setError(result.error || 'Failed to fetch services');
          }
        } catch (error) {
          setError('Failed to fetch services');
        } finally {
          setLoading(false);
        }
      },

      fetchServiceById: async (id) => {
        const { setLoading, setError, setCurrentService } = get();
        setLoading(true);
        setError(null);

        try {
          const result = await AdditionalServicesService.getServiceById(id);
          if (result.data) {
            setCurrentService(result.data);
          } else {
            setError(result.error || 'Failed to fetch service');
          }
        } catch (error) {
          setError('Failed to fetch service');
        } finally {
          setLoading(false);
        }
      },

      fetchServicesByCategory: async (category, facilityId) => {
        const { setLoading, setError, setServices } = get();
        setLoading(true);
        setError(null);

        try {
          const result = await AdditionalServicesService.getServicesByCategory(category, facilityId);
          if (result.success && result.data) {
            setServices(result.data, result.data.length);
          } else {
            setError(result.error?.message || 'Failed to fetch services');
          }
        } catch (error) {
          setError('Failed to fetch services');
        } finally {
          setLoading(false);
        }
      },

      createService: async (serviceData) => {
        const { setLoading, setError, addService } = get();
        setLoading(true);
        setError(null);

        try {
          const result = await AdditionalServicesService.createService(serviceData);
          if (result.data) {
            addService(result.data);
          } else {
            setError(result.error || 'Failed to create service');
          }
        } catch (error) {
          setError('Failed to create service');
        } finally {
          setLoading(false);
        }
      },

      updateServiceAsync: async (id, serviceData) => {
        const { setLoading, setError, updateService } = get();
        setLoading(true);
        setError(null);

        try {
          const result = await AdditionalServicesService.updateService(id, serviceData);
          if (result.data) {
            updateService(id, result.data);
          } else {
            setError(result.error || 'Failed to update service');
          }
        } catch (error) {
          setError('Failed to update service');
        } finally {
          setLoading(false);
        }
      },

      deleteService: async (id) => {
        const { setLoading, setError, removeService } = get();
        setLoading(true);
        setError(null);

        try {
          const result = await AdditionalServicesService.deleteService(id);
          if (result.data) {
            removeService(id);
          } else {
            setError(result.error || 'Failed to delete service');
          }
        } catch (error) {
          setError('Failed to delete service');
        } finally {
          setLoading(false);
        }
      },

      reset: () => {
        set({
          services: [],
          currentService: null,
          totalCount: 0,
          pagination: { page: 1, limit: 20 },
          filters: initialFilters,
          isLoading: false,
          error: null
        });
      }
    }),
    {
      name: 'additional-services-storage',
      partialize: (state) => ({
        filters: state.filters,
        pagination: state.pagination
      }),
    }
  )
);
