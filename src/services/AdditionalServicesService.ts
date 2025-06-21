
import { AdditionalService, ServiceCategory, ServiceFilters } from '@/types/additionalServices';
import { ActorType } from '@/types/pricing';
import { PaginatedResponse, PaginationParams, RepositoryResponse } from '@/types/api';
import { additionalServiceRepository } from '@/dal/repositories';
import { ServicePricingEngine } from '@/utils/servicePricingEngine';

// Simulate API delay for realistic UX
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export class AdditionalServicesService {
  static async getServices(
    pagination: PaginationParams,
    filters?: ServiceFilters
  ): Promise<RepositoryResponse<PaginatedResponse<AdditionalService>>> {
    try {
      await delay(200);
      const result = await additionalServiceRepository.findAll(pagination, filters);
      
      // Convert to paginated response format
      const paginatedResult: PaginatedResponse<AdditionalService> = {
        data: result.data || [],
        pagination: {
          page: pagination.page,
          limit: pagination.limit,
          total: (result.data || []).length,
          totalPages: Math.ceil((result.data || []).length / pagination.limit),
          hasNext: pagination.page * pagination.limit < (result.data || []).length,
          hasPrev: pagination.page > 1
        }
      };

      return {
        data: paginatedResult,
        error: result.error
      };
    } catch (error: any) {
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
        error: error.message
      };
    }
  }

  static async getServicesByCategory(
    category: ServiceCategory,
    facilityId?: string
  ): Promise<RepositoryResponse<AdditionalService[]>> {
    try {
      await delay(150);
      const filters: ServiceFilters = {
        category,
        isActive: true,
        ...(facilityId && { facilityId })
      };
      
      const result = await additionalServiceRepository.findAll(
        { page: 1, limit: 100 },
        filters
      );
      
      return {
        data: result.data || [],
        error: result.error
      };
    } catch (error: any) {
      return {
        data: [],
        error: error.message
      };
    }
  }

  static async getPopularServices(
    facilityId: string,
    limit?: number
  ): Promise<RepositoryResponse<AdditionalService[]>> {
    try {
      await delay(100);
      const filters: ServiceFilters = {
        facilityId,
        isActive: true
      };
      
      const result = await additionalServiceRepository.findAll(
        { page: 1, limit: limit || 10 },
        filters
      );
      
      // Filter popular services (those with 'popular' tag)
      const popularServices = (result.data || []).filter(service =>
        service.metadata.tags.includes('popular')
      );
      
      return {
        data: popularServices,
        error: result.error
      };
    } catch (error: any) {
      return {
        data: [],
        error: error.message
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
  ): Promise<RepositoryResponse<any>> {
    try {
      await delay(50);
      
      const serviceResult = await additionalServiceRepository.findById(serviceId);
      if (!serviceResult.data) {
        return {
          data: null,
          error: serviceResult.error || "Service not found"
        };
      }

      const calculation = ServicePricingEngine.calculateServicePrice(
        serviceResult.data,
        quantity,
        actorType,
        attendees,
        timeSlot,
        date
      );

      return {
        data: calculation.data,
        error: calculation.error
      };
    } catch (error: any) {
      return {
        data: null,
        error: error.message
      };
    }
  }

  static async validateServiceAvailability(
    serviceId: string,
    requestedDate: Date,
    timeSlot?: string
  ): Promise<RepositoryResponse<boolean>> {
    try {
      await delay(100);
      
      const serviceResult = await additionalServiceRepository.findById(serviceId);
      if (!serviceResult.data) {
        return {
          data: false,
          error: serviceResult.error || "Service not found"
        };
      }

      const service = serviceResult.data;
      
      // Check if service is always available
      if (service.availability.isAlwaysAvailable) {
        return { data: true };
      }

      // Check lead time
      const now = new Date();
      const leadTimeMs = service.availability.leadTimeHours * 60 * 60 * 1000;
      if (requestedDate.getTime() - now.getTime() < leadTimeMs) {
        return { data: false };
      }

      // Check max advance booking
      const maxAdvanceMs = service.availability.maxAdvanceBookingDays * 24 * 60 * 60 * 1000;
      if (requestedDate.getTime() - now.getTime() > maxAdvanceMs) {
        return { data: false };
      }

      // Check blackout periods
      const isBlackedOut = service.availability.blackoutPeriods.some(period =>
        requestedDate >= period.startDate && requestedDate <= period.endDate
      );
      
      if (isBlackedOut) {
        return { data: false };
      }

      return { data: true };
    } catch (error: any) {
      return {
        data: false,
        error: error.message
      };
    }
  }
}
