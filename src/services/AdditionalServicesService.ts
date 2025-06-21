
import { additionalServiceRepository } from '@/dal/repositories';
import { ServiceCategory, ServiceBookingStatus } from '@/types/additionalServices';
import { ActorType } from '@/types/pricing';
import { PaginationParams, ApiResponse } from '@/types/api';

interface ServiceFilters {
  facilityId?: string;
  category?: ServiceCategory;
  isActive?: boolean;
  searchTerm?: string;
  priceRange?: {
    min: number;
    max: number;
  };
}

export class AdditionalServicesService {
  static async getServices(
    pagination: PaginationParams,
    filters?: ServiceFilters
  ) {
    const result = await additionalServiceRepository.findAllWithFilters(pagination, filters);
    
    if (result.error) {
      return {
        success: false,
        error: { message: result.error }
      };
    }

    return {
      success: true,
      data: {
        data: result.data,
        pagination: {
          page: pagination.page,
          limit: pagination.limit,
          total: result.data.length,
          totalPages: Math.ceil(result.data.length / pagination.limit),
          hasNext: pagination.page * pagination.limit < result.data.length,
          hasPrev: pagination.page > 1
        }
      }
    };
  }

  static async getServiceById(serviceId: string) {
    const result = await additionalServiceRepository.findById(serviceId);
    
    if (result.error) {
      return {
        success: false,
        error: { message: result.error }
      };
    }

    return {
      success: true,
      data: result.data
    };
  }

  static async getServicesByCategory(
    category: ServiceCategory,
    facilityId?: string
  ) {
    const result = await additionalServiceRepository.findAllWithFilters(
      undefined,
      { category, facilityId, isActive: true }
    );
    
    if (result.error) {
      return {
        success: false,
        error: { message: result.error }
      };
    }

    return {
      success: true,
      data: result.data
    };
  }

  static async getPopularServices(
    facilityId: string,
    limit: number = 5
  ) {
    const result = await additionalServiceRepository.findAllWithFilters(
      { page: 1, limit },
      { facilityId, isActive: true }
    );
    
    if (result.error) {
      return {
        success: false,
        error: { message: result.error }
      };
    }

    return {
      success: true,
      data: result.data
    };
  }

  static async calculateServicePrice(
    serviceId: string,
    quantity: number,
    actorType: ActorType,
    attendees?: number,
    timeSlot?: string,
    date?: Date
  ) {
    const serviceResult = await additionalServiceRepository.findById(serviceId);
    
    if (serviceResult.error || !serviceResult.data) {
      return {
        success: false,
        error: { message: serviceResult.error || 'Service not found' }
      };
    }

    const service = serviceResult.data;
    
    // Use base_price from database model
    const basePrice = service.base_price || 0;
    const totalPrice = basePrice * quantity;

    return {
      success: true,
      data: {
        serviceId,
        quantity,
        basePrice,
        totalPrice,
        currency: 'NOK',
        calculatedAt: new Date()
      }
    };
  }

  static async validateServiceAvailability(
    serviceId: string,
    requestedDate: Date,
    timeSlot?: string
  ) {
    const serviceResult = await additionalServiceRepository.findById(serviceId);
    
    if (serviceResult.error || !serviceResult.data) {
      return {
        success: false,
        error: { message: serviceResult.error || 'Service not found' }
      };
    }

    // Basic availability check - this would be more complex in a real implementation
    return {
      success: true,
      data: {
        isAvailable: true,
        availableSlots: [],
        conflicts: []
      }
    };
  }
}
