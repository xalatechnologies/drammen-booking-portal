
import { Booking, BookingStatus } from '@/types/booking';

export class BookingValidationRepository {
  async updateBookingStatus(
    bookingRepo: any,
    bookingId: string, 
    status: BookingStatus, 
    notes?: string
  ) {
    try {
      const booking = await bookingRepo.findById(bookingId);
      if (!booking.success || !booking.data) {
        return { success: false, error: { message: 'Booking not found' } };
      }

      const updatedBooking = await bookingRepo.update(bookingId, { status });
      
      if (notes && updatedBooking.success && updatedBooking.data) {
        const newNote = {
          id: `note-${Date.now()}`,
          userId: 'current-user',
          userRole: 'system',
          content: notes,
          isInternal: true,
          createdAt: new Date()
        };
        
        updatedBooking.data.notes.push(newNote);
      }
      
      return updatedBooking;
    } catch (error) {
      return { success: false, error: { message: 'Failed to update booking status', details: error } };
    }
  }

  validateBookingRequest(request: any): { success: boolean; error?: any } {
    if (!request.facilityId || !request.zoneId) {
      return { success: false, error: { message: "Facility ID and Zone ID are required" } };
    }

    if (!request.startDate || !request.endDate) {
      return { success: false, error: { message: "Start date and end date are required" } };
    }

    if (request.startDate >= request.endDate) {
      return { success: false, error: { message: "End date must be after start date" } };
    }

    if (request.startDate < new Date()) {
      return { success: false, error: { message: "Cannot book in the past" } };
    }

    if (!request.contactName || !request.contactEmail || !request.contactPhone) {
      return { success: false, error: { message: "Contact information is required" } };
    }

    if (request.expectedAttendees < 1) {
      return { success: false, error: { message: "Expected attendees must be at least 1" } };
    }

    return { success: true };
  }
}
