
import { AdditionalService, ServiceFilters } from '@/types/additionalServices';
import { PaginatedResponse, PaginationParams, RepositoryResponse, ApiResponse } from '@/types/api';
import { LocalizedAdditionalServiceRepository } from '@/dal/repositories/LocalizedAdditionalServiceRepository';
import { ActorType } from '@/types/pricing';

// Create singleton instance
const localizedAdditionalServiceRepository = new LocalizedAdditionalServiceRepository();

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export class AdditionalServicesService {
  static async getServices(
    pagination: PaginationParams,
    filters?: ServiceFilters
  ): Promise<RepositoryResponse<PaginatedResponse<AdditionalService>>> {
    try {
      await delay(300);

      const result = await localizedAdditionalServiceRepository.findAll(
        pagination,
        filters?.searchTerm,
        filters
      );

      return result;
    } catch (error) {
      return {
        data: {
          data: [],
          pagination: {
            page: pagination.page,
            limit: pagination.limit,
            total: 0,
            totalPages: 0,
            hasNext: false,
            hasPrev: false
          }
        },
        error: "Failed to fetch additional services"
      };
    }
  }

  static async getServicesByCategory(
    category: string,
    facilityId?: string
  ): Promise<ApiResponse<AdditionalService[]>> {
    try {
      await delay(200);
      const services = await localizedAdditionalServiceRepository.getServicesByCategory(category);
      
      // Filter by facility if provided
      const filteredServices = facilityId 
        ? services.filter(service => 
            service.facilityIds.length === 0 || service.facilityIds.includes(facilityId)
          )
        : services;

      return {
        success: true,
        data: filteredServices
      };
    } catch (error) {
      return {
        success: false,
        error: { message: "Failed to fetch services by category" }
      };
    }
  }

  static async getServiceById(id: string): Promise<RepositoryResponse<AdditionalService | null>> {
    try {
      await delay(200);

      const result = await localizedAdditionalServiceRepository.findById(id);
      return result;
    } catch (error) {
      return {
        data: null,
        error: "Failed to fetch additional service"
      };
    }
  }

  static async createService(serviceData: Partial<AdditionalService>): Promise<RepositoryResponse<AdditionalService>> {
    try {
      await delay(250);

      const result = await localizedAdditionalServiceRepository.create(serviceData);
      return result;
    } catch (error) {
      return {
        data: null,
        error: "Failed to create additional service"
      };
    }
  }

  static async updateService(id: string, serviceData: Partial<AdditionalService>): Promise<RepositoryResponse<AdditionalService>> {
    try {
      await delay(250);

      const result = await localizedAdditionalServiceRepository.update(id, serviceData);
      return result;
    } catch (error) {
      return {
        data: null,
        error: "Failed to update additional service"
      };
    }
  }

  static async deleteService(id: string): Promise<RepositoryResponse<boolean>> {
    try {
      await delay(200);

      const result = await localizedAdditionalServiceRepository.delete(id);
      return result;
    } catch (error) {
      return {
        data: false,
        error: "Failed to delete additional service"
      };
    }
  }

  static async calculateServicePrice(
    serviceId: string,
    quantity: number,
    actorType: ActorType,
    attendees?: number,
    timeSlot?: string,
    date?: Date
  ): Promise<ApiResponse<{ totalPrice: number; unitPrice: number }>> {
    try {
      await delay(100);
      
      const serviceResult = await localizedAdditionalServiceRepository.findById(serviceId);
      if (!serviceResult.data) {
        return {
          success: false,
          error: { message: "Service not found" }
        };
      }

      const service = serviceResult.data;
      const basePrice = service.pricing.basePrice;
      const multiplier = service.pricing.actorTypeMultipliers[actorType] || 1;
      const unitPrice = basePrice * multiplier;
      const totalPrice = unitPrice * quantity;

      return {
        success: true,
        data: {
          totalPrice,
          unitPrice
        }
      };
    } catch (error) {
      return {
        success: false,
        error: { message: "Failed to calculate service price" }
      };
    }
  }

  static async validateServiceAvailability(
    serviceId: string,
    requestedDate: Date,
    timeSlot?: string
  ): Promise<ApiResponse<{ isAvailable: boolean; reason?: string }>> {
    try {
      await delay(100);
      
      const serviceResult = await localizedAdditionalServiceRepository.findById(serviceId);
      if (!serviceResult.data) {
        return {
          success: false,
          error: { message: "Service not found" }
        };
      }

      // Simple availability check - always available for now
      return {
        success: true,
        data: {
          isAvailable: true
        }
      };
    } catch (error) {
      return {
        success: false,
        error: { message: "Failed to validate service availability" }
      };
    }
  }

  static async getPopularServices(
    facilityId: string,
    limit: number = 5
  ): Promise<ApiResponse<AdditionalService[]>> {
    try {
      await delay(200);
      
      const services = await localizedAdditionalServiceRepository.getAllServices();
      const facilityServices = services.filter(service => 
        service.facilityIds.length === 0 || service.facilityIds.includes(facilityId)
      );

      // Return first few services as "popular" for now
      const popularServices = facilityServices.slice(0, limit);

      return {
        success: true,
        data: popularServices
      };
    } catch (error) {
      return {
        success: false,
        error: { message: "Failed to fetch popular services" }
      };
    }
  }

  static calculateServicePrice(
    service: AdditionalService,
    quantity: number,
    actorType: string,
    timeSlot?: string
  ): number {
    const basePrice = service.pricing.basePrice;
    const multiplier = service.pricing.actorTypeMultipliers?.[actorType as keyof typeof service.pricing.actorTypeMultipliers] || 1;
    
    return basePrice * quantity * multiplier;
  }
}
