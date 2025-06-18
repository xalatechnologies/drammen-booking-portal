
import { AdditionalService, ServiceCategory, ServiceFilters } from '@/types/additionalServices';
import { ActorType } from '@/types/pricing';
import { PaginatedResponse, PaginationParams, ApiResponse } from '@/types/api';
import { additionalServiceRepository } from '@/dal/repositories';
import { ServicePricingEngine } from '@/utils/servicePricingEngine';

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export class AdditionalServicesService {
  static async getServices(
    pagination: PaginationParams,
    filters?: ServiceFilters
  ): Promise<ApiResponse<PaginatedResponse<AdditionalService>>> {
    try {
      await delay(200);
      const result = await additionalServiceRepository.findAll(pagination, filters);
      return result;
    } catch (error) {
      return {
        success: false,
        error: { message: "Failed to fetch services", details: error },
      };
    }
  }

  static async getServicesByCategory(
    category: ServiceCategory,
    facilityId?: string
  ): Promise<ApiResponse<AdditionalService[]>> {
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
        success: true,
        data: result.data?.data || []
      };
    } catch (error) {
      return {
        success: false,
        error: { message: "Failed to fetch services by category", details: error },
      };
    }
  }

  static async getPopularServices(
    facilityId: string,
    limit?: number
  ): Promise<ApiResponse<AdditionalService[]>> {
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
      const popularServices = (result.data?.data || []).filter(service =>
        service.metadata.tags.includes('popular')
      );
      
      return {
        success: true,
        data: popularServices
      };
    } catch (error) {
      return {
        success: false,
        error: { message: "Failed to fetch popular services", details: error },
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
  ) {
    try {
      await delay(50);
      
      const serviceResult = await additionalServiceRepository.findById(serviceId);
      if (!serviceResult.success || !serviceResult.data) {
        return {
          success: false,
          error: { message: "Service not found" }
        };
      }

      return ServicePricingEngine.calculateServicePrice(
        serviceResult.data,
        quantity,
        actorType,
        attendees,
        timeSlot,
        date
      );
    } catch (error) {
      return {
        success: false,
        error: { message: "Failed to calculate service price", details: error },
      };
    }
  }

  static async validateServiceAvailability(
    serviceId: string,
    requestedDate: Date,
    timeSlot?: string
  ): Promise<ApiResponse<boolean>> {
    try {
      await delay(100);
      
      const serviceResult = await additionalServiceRepository.findById(serviceId);
      if (!serviceResult.success || !serviceResult.data) {
        return {
          success: false,
          error: { message: "Service not found" }
        };
      }

      const service = serviceResult.data;
      
      // Check if service is always available
      if (service.availability.isAlwaysAvailable) {
        return { success: true, data: true };
      }

      // Check lead time
      const now = new Date();
      const leadTimeMs = service.availability.leadTimeHours * 60 * 60 * 1000;
      if (requestedDate.getTime() - now.getTime() < leadTimeMs) {
        return { success: true, data: false };
      }

      // Check max advance booking
      const maxAdvanceMs = service.availability.maxAdvanceBookingDays * 24 * 60 * 60 * 1000;
      if (requestedDate.getTime() - now.getTime() > maxAdvanceMs) {
        return { success: true, data: false };
      }

      // Check blackout periods
      const isBlackedOut = service.availability.blackoutPeriods.some(period =>
        requestedDate >= period.startDate && requestedDate <= period.endDate
      );
      
      if (isBlackedOut) {
        return { success: true, data: false };
      }

      // Check available time slots if specified
      if (service.availability.availableTimeSlots && timeSlot) {
        const dayOfWeek = requestedDate.getDay();
        const availableSlot = service.availability.availableTimeSlots.find(slot =>
          slot.dayOfWeek === dayOfWeek
        );
        
        if (!availableSlot) {
          return { success: true, data: false };
        }
        
        // TODO: Check if timeSlot falls within availableSlot time range
      }

      return { success: true, data: true };
    } catch (error) {
      return {
        success: false,
        error: { message: "Failed to validate service availability", details: error },
      };
    }
  }
}
