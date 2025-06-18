
import { useState, useEffect } from 'react';
import { AdditionalService, ServiceFilters, ServiceCategory } from '@/types/additionalServices';
import { AdditionalServiceRepository } from '@/dal/repositories/AdditionalServiceRepository';
import { ActorType } from '@/types/pricing';

const serviceRepository = new AdditionalServiceRepository();

export function useAdditionalServices(facilityId?: string, category?: ServiceCategory) {
  const [services, setServices] = useState<AdditionalService[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchServices = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const filters: ServiceFilters = {
          facilityId,
          category,
          isActive: true
        };

        const result = await serviceRepository.findAll(
          { page: 1, limit: 100 },
          filters
        );

        if (result.success && result.data) {
          setServices(result.data.items);
        } else {
          setError(result.error?.message || 'Failed to fetch services');
        }
      } catch (err) {
        setError('An error occurred while fetching services');
        console.error('Error fetching services:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchServices();
  }, [facilityId, category]);

  return {
    services,
    isLoading,
    error,
    refetch: () => {
      const filters: ServiceFilters = { facilityId, category, isActive: true };
      return serviceRepository.findAll({ page: 1, limit: 100 }, filters);
    }
  };
}

export function useServicePricing() {
  const [isCalculating, setIsCalculating] = useState(false);

  const calculateServicePrice = async (
    serviceId: string,
    quantity: number,
    actorType: ActorType,
    attendees?: number
  ) => {
    setIsCalculating(true);
    
    try {
      const result = await serviceRepository.calculateServicePrice(
        serviceId,
        quantity,
        actorType,
        attendees
      );
      
      return result;
    } catch (error) {
      return {
        success: false,
        error: { message: 'Failed to calculate service price', details: error }
      };
    } finally {
      setIsCalculating(false);
    }
  };

  const checkServiceAvailability = async (
    serviceId: string,
    date: Date,
    timeSlot: string
  ) => {
    try {
      const result = await serviceRepository.checkServiceAvailability(
        serviceId,
        date,
        timeSlot
      );
      
      return result;
    } catch (error) {
      return {
        success: false,
        error: { message: 'Failed to check service availability', details: error }
      };
    }
  };

  return {
    calculateServicePrice,
    checkServiceAvailability,
    isCalculating
  };
}
