
import { SimpleRepository } from './SimpleRepository';

export class BookingRepository extends SimpleRepository {
  constructor() {
    super('app_bookings');
  }

  async getAllBookings(filters?: any) {
    console.log("BookingRepository.getAllBookings - Using simplified approach", { filters });
    return this.getAll();
  }

  async getBookingById(id: string) {
    console.log("BookingRepository.getBookingById - Using simplified approach", { id });
    return this.getById(id);
  }

  async createBooking(bookingData: any) {
    console.log("BookingRepository.createBooking - Using simplified approach", { bookingData });
    return this.create(bookingData);
  }

  async updateBooking(id: string, bookingData: any) {
    console.log("BookingRepository.updateBooking - Using simplified approach", { id, bookingData });
    return this.update(id, bookingData);
  }

  async deleteBooking(id: string) {
    console.log("BookingRepository.deleteBooking - Using simplified approach", { id });
    return this.delete(id);
  }

  async checkBookingConflicts(bookingData: any) {
    console.log("BookingRepository.checkBookingConflicts - Using simplified approach", { bookingData });
    return {
      data: {
        hasConflict: false,
        conflictingBookings: [],
        availableAlternatives: []
      },
      error: null
    };
  }
}

export const bookingRepository = new BookingRepository();
