
import { SupabaseRepository } from '../SupabaseRepository';
import { ServiceBooking } from '@/types/serviceBooking';
import { RepositoryResponse } from '@/types/api';

export class ServiceBookingRepository extends SupabaseRepository<ServiceBooking> {
  protected tableName = 'service_bookings';

  constructor() {
    super();
  }

  async createServiceBooking(data: Omit<ServiceBooking, 'id' | 'createdAt'>): Promise<RepositoryResponse<ServiceBooking>> {
    return {
      data: null,
      error: "ServiceBookingRepository methods not implemented - use hooks instead"
    };
  }

  async getServiceBookingsByBookingId(bookingId: string): Promise<RepositoryResponse<ServiceBooking[]>> {
    return {
      data: [],
      error: "ServiceBookingRepository methods not implemented - use hooks instead"
    };
  }

  async updateServiceBooking(id: string, data: Partial<ServiceBooking>): Promise<RepositoryResponse<ServiceBooking>> {
    return {
      data: null,
      error: "ServiceBookingRepository methods not implemented - use hooks instead"
    };
  }

  async deleteServiceBooking(id: string): Promise<RepositoryResponse<boolean>> {
    return {
      data: false,
      error: "ServiceBookingRepository methods not implemented - use hooks instead"
    };
  }
}
