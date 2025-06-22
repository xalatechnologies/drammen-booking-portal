/**
 * Main services export file
 * Provides clean imports for all services in the application
 * Following Open/Closed principle by making services easily extensible without modification
 */

// Base service interfaces and implementations
export * from './interfaces/base';
export * from './implementation/base';

// Facility-related exports
export * from './interfaces/facility';
export * from './implementation/facility';

// Booking-related exports
export * from './interfaces/booking';
export * from './implementation/booking';

// Other domain exports would follow the same pattern
// export * from './interfaces/user';
// export * from './implementation/user';
