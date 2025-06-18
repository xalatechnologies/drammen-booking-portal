
import { approvedBookings, pendingBookings, rejectedBookings } from './mockBookingData';
import { recurringBookings, municipalBookings } from './bookingScenarios';

// Combine all booking data
export const mockBookings = [
  ...approvedBookings,
  ...pendingBookings,
  ...rejectedBookings,
  ...recurringBookings,
  ...municipalBookings
];

// Export individual categories
export { approvedBookings, pendingBookings, rejectedBookings } from './mockBookingData';
export { recurringBookings, municipalBookings } from './bookingScenarios';

// Export helper functions
export * from './bookingHelpers';

// Legacy exports for backwards compatibility
export const getBookingsByFacilityId = (facilityId: string) => 
  mockBookings.filter(booking => booking.facilityId === facilityId);

export const getBookingsByUserId = (userId: string) => 
  mockBookings.filter(booking => booking.userId === userId);

export const getBookingsByStatus = (status: string) => 
  mockBookings.filter(booking => booking.status === status);

export const getBookingsByZoneId = (zoneId: string) => 
  mockBookings.filter(booking => booking.zoneId === zoneId);

export const getBookingsByDateRange = (startDate: Date, endDate: Date) => 
  mockBookings.filter(booking => 
    booking.startDate >= startDate && booking.startDate <= endDate
  );

export const getRecurringBookings = () => 
  mockBookings.filter(booking => booking.isRecurring);

export const getPendingApprovalBookings = () => 
  mockBookings.filter(booking => 
    booking.status === 'pending-approval' && booking.approvalStatus === 'pending'
  );
