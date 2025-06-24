
import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/contexts/LanguageContext";
import { serviceCategories } from "@/data/additionalServices/serviceCategories";
import { ActorType } from "@/types/pricing";

interface ServiceFilters {
  category?: string;
  priceRange?: [number, number];
}

interface PaginationParams {
  page: number;
  limit: number;
}

interface UseAdditionalServicesParams {
  pagination: PaginationParams;
  filters?: ServiceFilters;
}

export function useAdditionalServices({
  pagination,
  filters
}: UseAdditionalServicesParams) {
  const { language } = useLanguage();

  const {
    data: services,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['additionalServices', language, pagination, filters],
    queryFn: () => {
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

      return filteredServices;
    },
    staleTime: 0,
    gcTime: 30 * 1000,
  });

  return {
    services: services || [],
    pagination: {
      page: pagination.page,
      limit: pagination.limit,
      total: services?.length || 0,
      totalPages: Math.ceil((services?.length || 0) / pagination.limit),
      hasNext: false,
      hasPrev: false
    },
    isLoading,
    error: error?.message || null,
    refetch,
  };
}

export function useAdditionalService(id: string) {
  const { language } = useLanguage();

  const {
    data: service,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['additionalService', id, language],
    queryFn: () => {
      // Find service across all categories
      for (const category of serviceCategories) {
        const item = category.items.find(item => item.id === id);
        if (item) {
          return {
            id: item.id,
            name: item.name,
            description: item.description,
            price: item.basePrice,
            unit: item.unit,
            category: category.id
          };
        }
      }
      return null;
    },
    enabled: !!id,
    staleTime: 0,
    gcTime: 30 * 1000,
  });

  return {
    service,
    isLoading,
    error: error?.message || null,
    refetch,
  };
}

export function useServicePricing() {
  const calculateServicePrice = async (
    serviceId: string,
    quantity: number,
    actorType: ActorType,
    attendees?: number,
    timeSlot?: string,
    date?: Date
  ) => {
    // Find the service
    let service = null;
    for (const category of serviceCategories) {
      const item = category.items.find(item => item.id === serviceId);
      if (item) {
        service = item;
        break;
      }
    }
    
    if (!service) return 0;
    
    let basePrice = service.basePrice * quantity;
    
    // Apply actor type discounts
    switch (actorType) {
      case 'lag-foreninger':
        basePrice *= 0.9; // 10% discount
        break;
      case 'paraply':
        basePrice *= 0.8; // 20% discount
        break;
    }
    
    return basePrice;
  };

  return {
    calculateServicePrice
  };
}
