
import { useQuery } from '@tanstack/react-query';
import { AdditionalServicesService } from '@/services/AdditionalServicesService';
import { ServiceCategory } from '@/types/additionalServices';
import { ActorType } from '@/types/pricing';

export function useAdditionalServices(facilityId: string, category?: ServiceCategory) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['additional-services', facilityId, category],
    queryFn: async () => {
      if (category) {
        const result = await AdditionalServicesService.getServicesByCategory(category, facilityId);
        if (!result.success) {
          throw new Error(result.error?.message || 'Failed to fetch services');
        }
        return result.data || [];
      } else {
        const result = await AdditionalServicesService.getServices(
          { page: 1, limit: 100 },
          { facilityId, isActive: true }
        );
        if (result.error) {
          throw new Error(result.error);
        }
        return result.data?.data || [];
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
    attendees?: number
  ) => {
    const result = await AdditionalServicesService.calculateServicePrice(
      serviceId,
      quantity,
      actorType,
      attendees
    );
    
    return result; // Return the full API response with success/data structure
  };

  const validateServiceAvailability = async (
    serviceId: string,
    requestedDate: Date,
    timeSlot?: string
  ) => {
    const result = await AdditionalServicesService.validateServiceAvailability(
      serviceId,
      requestedDate,
      timeSlot
    );
    
    return result; // Return the full API response with success/data structure
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
      if (!result.success) {
        throw new Error(result.error?.message || 'Failed to fetch popular services');
      }
      return result.data || [];
    },
    enabled: !!facilityId
  });

  return {
    services: data || [],
    isLoading,
    error
  };
}
