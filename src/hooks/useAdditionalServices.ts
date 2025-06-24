
import { useQuery } from "@tanstack/react-query";
import { AdditionalServicesService } from "@/services/AdditionalServicesService";
import { ServiceFilters } from "@/types/additionalServices";
import { PaginationParams } from "@/types/api";
import { useLanguage } from "@/contexts/LanguageContext";
import { ActorType } from "@/types/pricing";

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
    data: response,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['additionalServices', language, pagination, filters],
    queryFn: () => AdditionalServicesService.getServices(pagination, filters),
    staleTime: 0,
    gcTime: 30 * 1000,
  });

  const services = response?.success ? response.data?.data || [] : [];
  const paginationInfo = response?.success ? {
    page: response.data?.pagination?.page || pagination.page,
    limit: response.data?.pagination?.limit || pagination.limit,
    total: response.data?.pagination?.total || 0,
    totalPages: response.data?.pagination?.totalPages || 0,
    hasNext: response.data?.pagination?.hasNext || false,
    hasPrev: response.data?.pagination?.hasPrev || false
  } : null;

  return {
    services: services || [],
    pagination: paginationInfo,
    isLoading,
    error: response?.success === false ? (response.error?.message || "Failed to fetch services") : (error?.message || null),
    refetch,
  };
}

export function useAdditionalService(id: string) {
  const { language } = useLanguage();

  const {
    data: response,
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
    service: response?.success ? response.data : null,
    isLoading,
    error: response?.success === false ? (response.error?.message || "Failed to fetch service") : (error?.message || null),
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
