
import { BookingRepository } from './BookingRepository';
import { AdditionalServiceRepository } from './AdditionalServiceRepository';
import { ServiceBookingRepository } from './ServiceBookingRepository';
import { FacilityRepository, facilityRepository } from './FacilityRepository';
import { ZoneRepository, zoneRepository } from './ZoneRepository';

// Export singleton instances
export { 
  facilityRepository,
  zoneRepository,
  bookingRepository,
  additionalServiceRepository,
  serviceBookingRepository
};

// Export for dependency injection or testing
export {
  FacilityRepository,
  ZoneRepository,
  BookingRepository,
  AdditionalServiceRepository,
  ServiceBookingRepository
};

// Create singleton instances for other repositories
export const bookingRepository = new BookingRepository();
export const additionalServiceRepository = new AdditionalServiceRepository();
export const serviceBookingRepository = new ServiceBookingRepository();
