
import { BaseRepository } from '../BaseRepository';
import { ServiceBooking, ServiceBookingStatus } from '@/types/additionalServices';
import { ApiResponse } from '@/types/api';

interface ServiceBookingFilters {
  bookingId?: string;
  serviceId?: string;
  status?: ServiceBookingStatus;
  startDate?: Date;
  endDate?: Date;
}

interface ServiceBookingCreateRequest {
  bookingId: string;
  serviceId: string;
  quantity: number;
  startTime?: Date;
  endTime?: Date;
  specialInstructions?: string;
  deliveryLocation?: string;
  pricing: {
    unitPrice: number;
    totalPrice: number;
    discounts: number;
    surcharges: number;
  };
}

interface ServiceBookingUpdateRequest extends Partial<ServiceBookingCreateRequest> {
  status?: ServiceBookingStatus;
  assignedStaff?: string[];
}

export class ServiceBookingRepository extends BaseRepository<
  ServiceBooking,
  ServiceBookingFilters,
  ServiceBookingCreateRequest,
  ServiceBookingUpdateRequest
> {
  constructor() {
    super([]);
  }

  protected getId(serviceBooking: ServiceBooking): string {
    return serviceBooking.id;
  }

  protected applyFilters(serviceBookings: ServiceBooking[], filters: ServiceBookingFilters): ServiceBooking[] {
    return serviceBookings.filter(serviceBooking => {
      if (filters.bookingId && serviceBooking.bookingId !== filters.bookingId) return false;
      if (filters.serviceId && serviceBooking.serviceId !== filters.serviceId) return false;
      if (filters.status && serviceBooking.status !== filters.status) return false;
      if (filters.startDate && serviceBooking.startTime && serviceBooking.startTime < filters.startDate) return false;
      if (filters.endDate && serviceBooking.startTime && serviceBooking.startTime > filters.endDate) return false;
      return true;
    });
  }

  protected createEntity(request: ServiceBookingCreateRequest): ServiceBooking {
    const newId = `service-booking-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    return {
      id: newId,
      bookingId: request.bookingId,
      serviceId: request.serviceId,
      quantity: request.quantity,
      startTime: request.startTime,
      endTime: request.endTime,
      specialInstructions: request.specialInstructions,
      status: 'pending',
      assignedStaff: [],
      deliveryLocation: request.deliveryLocation,
      pricing: request.pricing,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  protected updateEntity(existing: ServiceBooking, request: ServiceBookingUpdateRequest): ServiceBooking {
    return {
      ...existing,
      ...request,
      updatedAt: new Date()
    };
  }

  async getServiceBookingsByBooking(bookingId: string): Promise<ApiResponse<ServiceBooking[]>> {
    try {
      const serviceBookings = this.data.filter(sb => sb.bookingId === bookingId);
      return { success: true, data: serviceBookings };
    } catch (error) {
      return {
        success: false,
        error: { message: 'Failed to fetch service bookings', details: error }
      };
    }
  }

  async updateServiceBookingStatus(
    serviceBookingId: string,
    status: ServiceBookingStatus,
    assignedStaff?: string[]
  ): Promise<ApiResponse<ServiceBooking>> {
    try {
      const existing = this.data.find(sb => sb.id === serviceBookingId);
      if (!existing) {
        return {
          success: false,
          error: { message: 'Service booking not found' }
        };
      }

      const updated = {
        ...existing,
        status,
        assignedStaff: assignedStaff || existing.assignedStaff,
        updatedAt: new Date()
      };

      const index = this.data.findIndex(sb => sb.id === serviceBookingId);
      this.data[index] = updated;

      return { success: true, data: updated };
    } catch (error) {
      return {
        success: false,
        error: { message: 'Failed to update service booking status', details: error }
      };
    }
  }
}
