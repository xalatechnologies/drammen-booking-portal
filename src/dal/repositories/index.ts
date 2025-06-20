
import { BookingRepository } from './BookingRepository';
import { AdditionalServiceRepository } from './AdditionalServiceRepository';
import { ServiceBookingRepository } from './ServiceBookingRepository';
import { FacilityRepository, facilityRepository } from './FacilityRepository';
import { ZoneRepository, zoneRepository } from './ZoneRepository';

// Create singleton instances for other repositories
const bookingRepository = new BookingRepository();
const additionalServiceRepository = new AdditionalServiceRepository();
const serviceBookingRepository = new ServiceBookingRepository();

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
