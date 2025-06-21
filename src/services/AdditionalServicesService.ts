import { AdditionalService, ServiceFilters } from '@/types/additionalServices';
import { PaginatedResponse, PaginationParams, RepositoryResponse } from '@/types/api';
import { LocalizedAdditionalServiceRepository } from '@/dal/repositories/LocalizedAdditionalServiceRepository';

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

  static calculateServicePrice(
    service: AdditionalService,
    quantity: number,
    actorType: string,
    timeSlot?: string
  ): number {
    const basePrice = service.base_price || service.pricing?.basePrice || 0;
    const multiplier = service.pricing?.actorTypeMultipliers?.[actorType as keyof typeof service.pricing.actorTypeMultipliers] || 1;
    
    return basePrice * quantity * multiplier;
  }
}
