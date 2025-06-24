
import { create } from 'zustand';
import { serviceCategories } from '@/data/additionalServices/serviceCategories';

interface AdditionalService {
  id: string;
  name: string;
  description: string;
  price: number;
  unit: string;
  category: string;
}

interface ServiceFilters {
  category?: string;
  priceRange?: [number, number];
}

interface PaginationParams {
  page: number;
  limit: number;
}

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
      // Transform serviceCategories data to flat services array
      const allServices = serviceCategories.flatMap(category => 
        category.items.map(item => ({
          id: item.id,
          name: item.name,
          description: item.description,
          price: item.basePrice,
          unit: item.unit,
          category: category.id
        }))
      );

      // Apply filters if provided
      let filteredServices = allServices;
      
      if (filters?.category) {
        filteredServices = filteredServices.filter(service => service.category === filters.category);
      }
      
      if (filters?.priceRange) {
        const [min, max] = filters.priceRange;
        filteredServices = filteredServices.filter(service => 
          service.price >= min && service.price <= max
        );
      }

      set({
        services: filteredServices,
        loading: false,
        pagination: {
          page: pagination?.page || 1,
          limit: pagination?.limit || 10,
          total: filteredServices.length,
          totalPages: Math.ceil(filteredServices.length / (pagination?.limit || 10)),
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
      // Find service across all categories
      let foundService = null;
      for (const category of serviceCategories) {
        const item = category.items.find(item => item.id === id);
        if (item) {
          foundService = {
            id: item.id,
            name: item.name,
            description: item.description,
            price: item.basePrice,
            unit: item.unit,
            category: category.id
          };
          break;
        }
      }

      set({
        selectedService: foundService,
        loading: false
      });
    } catch (error) {
      set({ 
        error: 'Failed to fetch service',
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
