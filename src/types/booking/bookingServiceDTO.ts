/**
 * DTO types for booking services
 * Follows Single Responsibility Principle by focusing only on service-related data transfer objects
 */

import { BookingService } from './bookingPricing';

/**
 * Lightweight DTO for booking service requests
 * Used in BookingCreateRequest and BookingUpdateRequest
 */
export interface BookingServiceDTO {
  serviceId: string;
  quantity?: number;
  notes?: string;
}

/**
 * Maps BookingServiceDTO array to BookingService array
 * Used when converting from request DTOs to domain objects
 * @param serviceDTOs Array of service DTOs from request
 * @returns Array of full BookingService objects
 */
export function mapToBookingServices(serviceDTOs: BookingServiceDTO[]): BookingService[] {
  // In a real implementation, this would likely fetch service details from a service catalog
  return serviceDTOs.map(dto => ({
    serviceId: dto.serviceId,
    serviceName: 'Service name would be fetched', // Would be fetched from service catalog
    quantity: dto.quantity || 1,
    unitPrice: 0, // Would be fetched from service catalog
    totalPrice: 0, // Would be calculated based on quantity and unitPrice
    description: dto.notes
  }));
}

/**
 * Maps BookingService array to BookingServiceDTO array
 * Used when converting from domain objects to request DTOs
 * @param services Array of domain BookingService objects
 * @returns Array of lightweight BookingServiceDTO objects for requests
 */
export function mapToBookingServiceDTOs(services: BookingService[]): BookingServiceDTO[] {
  return services.map(service => ({
    serviceId: service.serviceId,
    quantity: service.quantity,
    notes: service.description
  }));
}
