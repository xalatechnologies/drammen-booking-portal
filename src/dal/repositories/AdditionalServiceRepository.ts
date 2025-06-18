
import { BaseRepository } from '../BaseRepository';
import { AdditionalService, ServiceFilters, ServiceBooking } from '@/types/additionalServices';
import { mockAdditionalServices } from '@/data/additionalServices';
import { ActorType } from '@/types/pricing';

export class AdditionalServiceRepository extends BaseRepository<AdditionalService, ServiceFilters, any, any> {
  constructor() {
    super([...mockAdditionalServices]);
  }

  protected getId(service: AdditionalService): string {
    return service.id;
  }

  protected applyFilters(services: AdditionalService[], filters: ServiceFilters): AdditionalService[] {
    return services.filter(service => {
      if (filters.category && service.category !== filters.category) return false;
      if (filters.facilityId && !service.facilityIds.includes(filters.facilityId)) return false;
      if (filters.zoneId && service.zoneIds && !service.zoneIds.includes(filters.zoneId)) return false;
      if (filters.isActive !== undefined && service.isActive !== filters.isActive) return false;

      if (filters.searchTerm && filters.searchTerm.trim() !== "") {
        const searchLower = filters.searchTerm.toLowerCase();
        const matchesSearch = 
          service.name.toLowerCase().includes(searchLower) ||
          service.description.toLowerCase().includes(searchLower) ||
          service.metadata.tags.some(tag => tag.toLowerCase().includes(searchLower));
        if (!matchesSearch) return false;
      }

      if (filters.priceRange) {
        if (service.pricing.basePrice < filters.priceRange.min) return false;
        if (service.pricing.basePrice > filters.priceRange.max) return false;
      }

      if (filters.availableDate && filters.availableTimeSlot) {
        // Check service availability for specific date/time
        if (!service.availability.isAlwaysAvailable && service.availability.availableTimeSlots) {
          const dayOfWeek = filters.availableDate.getDay();
          const hasAvailableSlot = service.availability.availableTimeSlots.some(slot => 
            slot.dayOfWeek === dayOfWeek
          );
          if (!hasAvailableSlot) return false;
        }
      }

      return true;
    });
  }

  protected createEntity(request: any): AdditionalService {
    throw new Error('Creating new services not implemented in mock repository');
  }

  protected updateEntity(existing: AdditionalService, request: any): AdditionalService {
    return { ...existing, ...request, updatedAt: new Date() };
  }

  // Service-specific methods
  async getServicesByCategory(category: string, facilityId?: string) {
    try {
      const filters: ServiceFilters = { 
        category: category as any,
        facilityId,
        isActive: true
      };
      
      const result = await this.findAll({ page: 1, limit: 100 }, filters);
      return result;
    } catch (error) {
      return { 
        success: false, 
        error: { message: 'Failed to fetch services by category', details: error } 
      };
    }
  }

  async getServicesByFacility(facilityId: string) {
    try {
      const filters: ServiceFilters = { 
        facilityId,
        isActive: true
      };
      
      const result = await this.findAll({ page: 1, limit: 100 }, filters);
      return result;
    } catch (error) {
      return { 
        success: false, 
        error: { message: 'Failed to fetch services by facility', details: error } 
      };
    }
  }

  async calculateServicePrice(
    serviceId: string, 
    quantity: number, 
    actorType: ActorType,
    attendees?: number
  ) {
    try {
      const service = this.data.find(s => s.id === serviceId);
      if (!service) {
        return {
          success: false,
          error: { message: 'Service not found' }
        };
      }

      const multiplier = service.pricing.actorTypeMultipliers[actorType] || 1.0;
      let basePrice = service.pricing.basePrice;
      
      // Apply pricing type calculations
      let totalPrice = 0;
      switch (service.pricing.pricingType) {
        case 'per-person':
          if (!attendees) {
            return {
              success: false,
              error: { message: 'Attendees count required for per-person pricing' }
            };
          }
          totalPrice = basePrice * attendees * quantity * multiplier;
          break;
        case 'per-item':
          totalPrice = basePrice * quantity * multiplier;
          break;
        case 'hourly':
        case 'daily':
        case 'flat':
        default:
          totalPrice = basePrice * quantity * multiplier;
          break;
      }

      // Apply minimum charge if specified
      if (service.pricing.minimumCharge && totalPrice < service.pricing.minimumCharge) {
        totalPrice = service.pricing.minimumCharge;
      }

      // Apply maximum charge if specified
      if (service.pricing.maximumCharge && totalPrice > service.pricing.maximumCharge) {
        totalPrice = service.pricing.maximumCharge;
      }

      return {
        success: true,
        data: {
          serviceId,
          serviceName: service.name,
          quantity,
          unitPrice: basePrice,
          multiplier,
          totalPrice: Math.round(totalPrice),
          currency: service.pricing.currency,
          pricingType: service.pricing.pricingType
        }
      };
    } catch (error) {
      return {
        success: false,
        error: { message: 'Failed to calculate service price', details: error }
      };
    }
  }

  async checkServiceAvailability(
    serviceId: string, 
    date: Date, 
    timeSlot: string
  ) {
    try {
      const service = this.data.find(s => s.id === serviceId);
      if (!service) {
        return {
          success: false,
          error: { message: 'Service not found' }
        };
      }

      // Check if service is always available
      if (service.availability.isAlwaysAvailable) {
        return {
          success: true,
          data: { available: true, reason: 'Always available' }
        };
      }

      // Check day-of-week availability
      if (service.availability.availableTimeSlots) {
        const dayOfWeek = date.getDay();
        const availableSlot = service.availability.availableTimeSlots.find(slot => 
          slot.dayOfWeek === dayOfWeek
        );
        
        if (!availableSlot) {
          return {
            success: true,
            data: { available: false, reason: 'Not available on this day of week' }
          };
        }
        
        // TODO: Add time slot validation against available time slots
      }

      // Check blackout periods
      const isBlackedOut = service.availability.blackoutPeriods.some(period => 
        date >= period.startDate && date <= period.endDate
      );

      if (isBlackedOut) {
        return {
          success: true,
          data: { available: false, reason: 'Service unavailable during blackout period' }
        };
      }

      // Check lead time
      const now = new Date();
      const leadTimeMs = service.availability.leadTimeHours * 60 * 60 * 1000;
      const minBookingTime = new Date(now.getTime() + leadTimeMs);
      
      if (date < minBookingTime) {
        return {
          success: true,
          data: { 
            available: false, 
            reason: `Requires ${service.availability.leadTimeHours} hours lead time` 
          }
        };
      }

      // Check advance booking limit
      const maxAdvanceMs = service.availability.maxAdvanceBookingDays * 24 * 60 * 60 * 1000;
      const maxBookingTime = new Date(now.getTime() + maxAdvanceMs);
      
      if (date > maxBookingTime) {
        return {
          success: true,
          data: { 
            available: false, 
            reason: `Cannot book more than ${service.availability.maxAdvanceBookingDays} days in advance` 
          }
        };
      }

      return {
        success: true,
        data: { available: true, reason: 'Service available' }
      };
    } catch (error) {
      return {
        success: false,
        error: { message: 'Failed to check service availability', details: error }
      };
    }
  }
}
