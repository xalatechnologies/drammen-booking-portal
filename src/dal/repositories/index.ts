
/**
 * Main repository exports file
 * Following Single Responsibility Principle by organizing repositories by domain feature
 * Each feature has its own folder with dedicated repositories
 */

// Export all base repositories
export * from './base';

// Export all facility-related repositories
export * from './facility';

// Legacy exports maintained for backward compatibility
// These should eventually be refactored to use the new structure
export { facilityBlackoutRepository } from './FacilityBlackoutRepository';

// Booking repositories
export { BookingRepository } from './BookingRepository';
export { AdditionalServiceRepository } from './AdditionalServiceRepository';
export { ServiceBookingRepository } from './ServiceBookingRepository';

// Create and export singleton instances for services that need them
// Note: Ideally these should be moved to a dependency injection system
import { BookingRepository } from './BookingRepository';
import { AdditionalServiceRepository } from './AdditionalServiceRepository';
import { ServiceBookingRepository } from './ServiceBookingRepository';

export const bookingRepository = new BookingRepository();
export const additionalServiceRepository = new AdditionalServiceRepository();
export const serviceBookingRepository = new ServiceBookingRepository();
