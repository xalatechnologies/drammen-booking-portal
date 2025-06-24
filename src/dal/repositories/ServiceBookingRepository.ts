
import { SimpleRepository } from './SimpleRepository';

export class ServiceBookingRepository extends SimpleRepository {
  constructor() {
    super('service_bookings');
  }

  async createServiceBooking(data: any) {
    console.log("ServiceBookingRepository.createServiceBooking - Using simplified approach", { data });
    return this.create(data);
  }

  async getServiceBookingsByBookingId(bookingId: string) {
    console.log("ServiceBookingRepository.getServiceBookingsByBookingId - Using simplified approach", { bookingId });
    return this.getAll();
  }

  async updateServiceBooking(id: string, data: any) {
    console.log("ServiceBookingRepository.updateServiceBooking - Using simplified approach", { id, data });
    return this.update(id, data);
  }

  async deleteServiceBooking(id: string) {
    console.log("ServiceBookingRepository.deleteServiceBooking - Using simplified approach", { id });
    return this.delete(id);
  }
}

export const serviceBookingRepository = new ServiceBookingRepository();
