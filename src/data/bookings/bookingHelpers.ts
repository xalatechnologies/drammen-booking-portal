
import { Booking, BookingStatus } from '@/types/booking';

export const getBookingsByFacilityId = (bookings: Booking[], facilityId: string): Booking[] => {
  return bookings.filter(booking => booking.facilityId === facilityId);
};

export const getBookingsByUserId = (bookings: Booking[], userId: string): Booking[] => {
  return bookings.filter(booking => booking.userId === userId);
};

export const getBookingsByStatus = (bookings: Booking[], status: BookingStatus): Booking[] => {
  return bookings.filter(booking => booking.status === status);
};

export const getBookingsByZoneId = (bookings: Booking[], zoneId: string): Booking[] => {
  return bookings.filter(booking => booking.zoneId === zoneId);
};

export const getBookingsByDateRange = (bookings: Booking[], startDate: Date, endDate: Date): Booking[] => {
  return bookings.filter(booking => 
    booking.startDate >= startDate && booking.startDate <= endDate
  );
};

export const getRecurringBookings = (bookings: Booking[]): Booking[] => {
  return bookings.filter(booking => booking.isRecurring);
};

export const getPendingApprovalBookings = (bookings: Booking[]): Booking[] => {
  return bookings.filter(booking => 
    booking.status === 'pending-approval' && booking.approvalStatus === 'pending'
  );
};

export const getBookingsRequiringPayment = (bookings: Booking[]): Booking[] => {
  return bookings.filter(booking => 
    booking.status === 'approved' && 
    booking.pricing.totalPrice > 0 &&
    !booking.notes?.some(note => note.content.includes('betalt'))
  );
};

export const getBookingsByOrganization = (bookings: Booking[], organizationId: string): Booking[] => {
  return bookings.filter(booking => booking.organizationId === organizationId);
};

export const getConflictingBookings = (
  bookings: Booking[], 
  zoneId: string, 
  startDate: Date, 
  endDate: Date,
  excludeBookingId?: string
): Booking[] => {
  return bookings.filter(booking => 
    booking.zoneId === zoneId &&
    booking.id !== excludeBookingId &&
    booking.status !== 'cancelled' &&
    booking.status !== 'rejected' &&
    booking.startDate < endDate && 
    booking.endDate > startDate
  );
};
