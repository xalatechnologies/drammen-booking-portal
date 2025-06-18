
import { useQuery } from '@tanstack/react-query';
import { AdditionalServicesService } from '@/services/AdditionalServicesService';
import { ServiceCategory, AdditionalService } from '@/types/additionalServices';
import { ActorType } from '@/types/pricing';

export function useAdditionalServices(facilityId: string, category?: ServiceCategory) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['additional-services', facilityId, category],
    queryFn: async () => {
      if (category) {
        const result = await AdditionalServicesService.getServicesByCategory(category, facilityId);
        if (result.success) {
          return result.data || [];
        }
        throw new Error(result.error?.message || 'Failed to fetch services');
      } else {
        const result = await AdditionalServicesService.getServices(
          { page: 1, limit: 100 },
          { facilityId, isActive: true }
        );
        if (result.success) {
          return result.data?.items || [];
        }
        throw new Error(result.error?.message || 'Failed to fetch services');
      }
    },
    enabled: !!facilityId
  });

  return {
    services: data || [],
    isLoading,
    error
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
    return AdditionalServicesService.calculateServicePrice(
      serviceId,
      quantity,
      actorType,
      attendees,
      timeSlot,
      date
    );
  };

  const validateServiceAvailability = async (
    serviceId: string,
    requestedDate: Date,
    timeSlot?: string
  ) => {
    return AdditionalServicesService.validateServiceAvailability(
      serviceId,
      requestedDate,
      timeSlot
    );
  };

  return {
    calculateServicePrice,
    validateServiceAvailability
  };
}

export function usePopularServices(facilityId: string, limit?: number) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['popular-services', facilityId, limit],
    queryFn: async () => {
      const result = await AdditionalServicesService.getPopularServices(facilityId, limit);
      if (result.success) {
        return result.data || [];
      }
      throw new Error(result.error?.message || 'Failed to fetch popular services');
    },
    enabled: !!facilityId
  });

  return {
    services: data || [],
    isLoading,
    error
  };
}
