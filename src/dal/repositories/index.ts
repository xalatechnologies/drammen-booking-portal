
export { facilityRepository } from './FacilityRepository';
export { zoneRepository } from './ZoneRepository';
export { facilityBlackoutRepository } from './FacilityBlackoutRepository';

// Export repository classes and singleton instances
export { BookingRepository } from './BookingRepository';
export { AdditionalServiceRepository } from './AdditionalServiceRepository';
export { ServiceBookingRepository } from './ServiceBookingRepository';

// Create and export singleton instances for services that need them
import { BookingRepository } from './BookingRepository';
import { AdditionalServiceRepository } from './AdditionalServiceRepository';
import { ServiceBookingRepository } from './ServiceBookingRepository';

export const bookingRepository = new BookingRepository();
export const additionalServiceRepository = new AdditionalServiceRepository();
export const serviceBookingRepository = new ServiceBookingRepository();
