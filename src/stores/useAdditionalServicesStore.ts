
import { create } from 'zustand';
import { AdditionalService, ServiceFilters } from '@/types/additionalServices';
import { PaginationParams, ApiResponse, PaginatedResponse } from '@/types/api';
import { additionalServiceRepository } from '@/dal/repositories/AdditionalServiceRepository';

interface AdditionalServicesState {
  services: AdditionalService[];
  selectedService: AdditionalService | null;
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  
  // Actions
  fetchServices: (pagination?: PaginationParams, filters?: ServiceFilters) => Promise<void>;
  fetchServiceById: (id: string) => Promise<void>;
  createService: (serviceData: Omit<AdditionalService, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateService: (id: string, serviceData: Partial<AdditionalService>) => Promise<void>;
  deleteService: (id: string) => Promise<void>;
  setSelectedService: (service: AdditionalService | null) => void;
  clearError: () => void;
}

export const useAdditionalServicesStore = create<AdditionalServicesState>((set, get) => ({
  services: [],
  selectedService: null,
  loading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },

  fetchServices: async (pagination, filters) => {
    set({ loading: true, error: null });
    
    try {
      const result = await additionalServiceRepository.findAllWithFilters(pagination, filters);
      
      if (result.error) {
        set({ 
          error: typeof result.error === 'string' ? result.error : result.error.message,
          loading: false 
        });
        return;
      }

      set({
        services: result.data || [],
        loading: false,
        pagination: {
          page: pagination?.page || 1,
          limit: pagination?.limit || 10,
          total: result.data?.length || 0,
          totalPages: 1,
        }
      });
    } catch (error) {
      set({ 
        error: 'Failed to fetch services',
        loading: false 
      });
    }
  },

  fetchServiceById: async (id) => {
    set({ loading: true, error: null });
    
    try {
      const result = await additionalServiceRepository.findById(id);
      
      if (result.error) {
        set({ 
          error: typeof result.error === 'string' ? result.error : result.error.message,
          loading: false 
        });
        return;
      }

      set({
        selectedService: result.data || null,
        loading: false
      });
    } catch (error) {
      set({ 
        error: 'Failed to fetch service',
        loading: false 
      });
    }
  },

  createService: async (serviceData) => {
    set({ loading: true, error: null });
    
    try {
      const dataWithTimestamps = {
        ...serviceData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const result = await additionalServiceRepository.create(dataWithTimestamps);
      
      if (result.error) {
        set({ 
          error: typeof result.error === 'string' ? result.error : result.error.message,
          loading: false 
        });
        return;
      }

      // Refresh services list
      await get().fetchServices();
    } catch (error) {
      set({ 
        error: 'Failed to create service',
        loading: false 
      });
    }
  },

  updateService: async (id, serviceData) => {
    set({ loading: true, error: null });
    
    try {
      const result = await additionalServiceRepository.update(id, {
        ...serviceData,
        updated_at: new Date().toISOString(),
      });
      
      if (result.error) {
        set({ 
          error: typeof result.error === 'string' ? result.error : result.error.message,
          loading: false 
        });
        return;
      }

      // Refresh services list
      await get().fetchServices();
    } catch (error) {
      set({ 
        error: 'Failed to update service',
        loading: false 
      });
    }
  },

  deleteService: async (id) => {
    set({ loading: true, error: null });
    
    try {
      const result = await additionalServiceRepository.delete(id);
      
      if (result.error) {
        set({ 
          error: typeof result.error === 'string' ? result.error : result.error.message,
          loading: false 
        });
        return;
      }

      // Refresh services list
      await get().fetchServices();
    } catch (error) {
      set({ 
        error: 'Failed to delete service',
        loading: false 
      });
    }
  },

  setSelectedService: (service) => {
    set({ selectedService: service });
  },

  clearError: () => {
    set({ error: null });
  },
}));
