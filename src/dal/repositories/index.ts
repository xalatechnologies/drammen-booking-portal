
import { BookingRepository } from './BookingRepository';
import { AdditionalServiceRepository } from './AdditionalServiceRepository';
import { ServiceBookingRepository } from './ServiceBookingRepository';

// Create singleton instances
export const bookingRepository = new BookingRepository();
export const additionalServiceRepository = new AdditionalServiceRepository();
export const serviceBookingRepository = new ServiceBookingRepository();

// Export for dependency injection or testing
export {
  BookingRepository,
  AdditionalServiceRepository,
  ServiceBookingRepository
};
