
import { useQuery } from "@tanstack/react-query";
import { AdditionalServicesService } from "@/services/AdditionalServicesService";
import { useLanguage } from "@/contexts/LanguageContext";
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
    queryFn: () => AdditionalServicesService.getServices(),
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
    queryFn: () => AdditionalServicesService.getServiceById(id),
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

// Add the missing useServicePricing hook
export function useServicePricing() {
  const calculateServicePrice = async (
    serviceId: string,
    quantity: number,
    actorType: ActorType,
    attendees?: number,
    timeSlot?: string,
    date?: Date
  ) => {
    return await AdditionalServicesService.calculateServicePrice(
      serviceId,
      quantity,
      actorType,
      attendees,
      timeSlot,
      date
    );
  };

  return {
    calculateServicePrice
  };
}
