
import { AdditionalService, ServiceBooking, ServiceCategory } from '@/types/additionalServices';
import { PaginatedResponse, PaginationParams, ApiResponse } from '@/types/api';
import { additionalServiceRepository } from '@/dal/repositories';
import { ServicePricingEngine, ServicePriceCalculation } from '@/utils/servicePricingEngine';
import { ActorType } from '@/types/pricing';

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export class AdditionalServicesService {
  static async getServices(
    pagination: PaginationParams,
    filters?: {
      category?: ServiceCategory;
      facilityId?: string;
      zoneId?: string;
      isActive?: boolean;
      searchTerm?: string;
    }
  ): Promise<ApiResponse<PaginatedResponse<AdditionalService>>> {
    try {
      await delay(200);
      const result = await additionalServiceRepository.findAll(pagination, filters, 'name', 'asc');
      return result;
    } catch (error) {
      return {
        success: false,
        error: { message: "Failed to fetch additional services", details: error },
      };
    }
  }

  static async getServiceById(id: string): Promise<ApiResponse<AdditionalService>> {
    try {
      await delay(150);
      const result = await additionalServiceRepository.findById(id);
      return result;
    } catch (error) {
      return {
        success: false,
        error: { message: "Failed to fetch service", details: error },
      };
    }
  }

  static async getServicesByCategory(
    category: ServiceCategory,
    facilityId?: string
  ): Promise<ApiResponse<AdditionalService[]>> {
    try {
      await delay(200);
      
      const filters = {
        category,
        facilityId,
        isActive: true
      };
      
      const result = await additionalServiceRepository.findAll(
        { page: 1, limit: 100 },
        filters,
        'name',
        'asc'
      );
      
      if (result.success && result.data) {
        return { success: true, data: result.data.data };
      }
      
      return result as any;
    } catch (error) {
      return {
        success: false,
        error: { message: "Failed to fetch services by category", details: error },
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
  ): Promise<ApiResponse<ServicePriceCalculation>> {
    try {
      await delay(100);
      
      const serviceResult = await this.getServiceById(serviceId);
      if (!serviceResult.success || !serviceResult.data) {
        return {
          success: false,
          error: { message: "Service not found" }
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
      
      return calculation;
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
  ): Promise<ApiResponse<{ available: boolean; conflicts?: string[] }>> {
    try {
      await delay(100);
      
      const serviceResult = await this.getServiceById(serviceId);
      if (!serviceResult.success || !serviceResult.data) {
        return {
          success: false,
          error: { message: "Service not found" }
        };
      }
      
      const service = serviceResult.data;
      const conflicts: string[] = [];
      
      // Check if service is available on requested date
      if (!service.availability.isAlwaysAvailable) {
        const dayOfWeek = requestedDate.getDay();
        const availableSlot = service.availability.availableTimeSlots?.find(
          slot => slot.dayOfWeek === dayOfWeek
        );
        
        if (!availableSlot) {
          conflicts.push(`Service not available on ${requestedDate.toLocaleDateString()}`);
        }
      }
      
      // Check blackout periods
      const isBlackedOut = service.availability.blackoutPeriods.some(
        period => requestedDate >= period.startDate && requestedDate <= period.endDate
      );
      
      if (isBlackedOut) {
        conflicts.push("Service is not available during this period");
      }
      
      // Check lead time
      const leadTimeMs = service.availability.leadTimeHours * 60 * 60 * 1000;
      const minimumBookingTime = new Date(Date.now() + leadTimeMs);
      
      if (requestedDate < minimumBookingTime) {
        conflicts.push(`Service requires ${service.availability.leadTimeHours} hours advance notice`);
      }
      
      // Check maximum advance booking
      const maxAdvanceMs = service.availability.maxAdvanceBookingDays * 24 * 60 * 60 * 1000;
      const maxBookingTime = new Date(Date.now() + maxAdvanceMs);
      
      if (requestedDate > maxBookingTime) {
        conflicts.push(`Service can only be booked ${service.availability.maxAdvanceBookingDays} days in advance`);
      }
      
      return {
        success: true,
        data: {
          available: conflicts.length === 0,
          conflicts: conflicts.length > 0 ? conflicts : undefined
        }
      };
    } catch (error) {
      return {
        success: false,
        error: { message: "Failed to validate service availability", details: error },
      };
    }
  }

  static async getPopularServices(
    facilityId: string,
    limit: number = 6
  ): Promise<ApiResponse<AdditionalService[]>> {
    try {
      await delay(150);
      
      const result = await additionalServiceRepository.findAll(
        { page: 1, limit },
        { facilityId, isActive: true },
        'name',
        'asc'
      );
      
      if (result.success && result.data) {
        // Filter by popular services (mock implementation)
        const popularServices = result.data.data.filter(service => 
          service.metadata.tags.includes('popular') || 
          service.category === 'cleaning' || 
          service.category === 'equipment'
        );
        
        return { success: true, data: popularServices.slice(0, limit) };
      }
      
      return result as any;
    } catch (error) {
      return {
        success: false,
        error: { message: "Failed to fetch popular services", details: error },
      };
    }
  }
}
