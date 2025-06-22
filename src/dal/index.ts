/**
 * Main Data Access Layer (DAL) export file
 * Provides clean imports for all repository interfaces and implementations
 * Following Open/Closed principle by making repositories easily extensible without modification
 */

// Base interfaces and implementations
export * from './interfaces/base';
export * from './repositories/base';

// Facility-related exports
export * from './interfaces/facility';
export * from './repositories/facility';

// Booking-related exports
export * from './interfaces/booking';
export * from './repositories/booking';

// Other domain exports would follow the same pattern
// export * from './interfaces/user';
// export * from './repositories/user';
