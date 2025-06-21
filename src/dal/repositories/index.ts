
export { facilityRepository } from './FacilityRepository';
export { zoneRepository } from './ZoneRepository';
export { supabaseFacilityRepository } from './SupabaseFacilityRepository';
export { facilityBlackoutRepository } from './FacilityBlackoutRepository';

// Note: BookingRepository and AdditionalServiceRepository export both classes and singleton instances
export { BookingRepository } from './BookingRepository';
export { AdditionalServiceRepository } from './AdditionalServiceRepository';

// Create and export singleton instances for services that need them
import { BookingRepository } from './BookingRepository';
import { AdditionalServiceRepository } from './AdditionalServiceRepository';

export const bookingRepository = new BookingRepository();
export const additionalServiceRepository = new AdditionalServiceRepository();
