
import { Booking } from '@/types/booking';
import { addDays, isSameDay } from 'date-fns';

export class RecurringBookingRepository {
  constructor(private bookings: Booking[]) {}

  async generateRecurringBookings(
    baseBooking: Booking,
    pattern: Booking['recurrencePattern']
  ): Promise<{ success: boolean; data?: Booking[]; error?: any }> {
    try {
      if (!pattern || !pattern.endDate) {
        return { success: false, error: { message: 'Invalid recurrence pattern' } };
      }

      const generatedBookings: Booking[] = [];
      let currentDate = new Date(baseBooking.startDate);
      const endDate = pattern.endDate;
      
      while (currentDate <= endDate) {
        // Skip exceptions
        if (pattern.exceptions.some(exception => isSameDay(exception, currentDate))) {
          currentDate = this.incrementDate(currentDate, pattern);
          continue;
        }

        // Check day of week for weekly patterns
        if (pattern.type === 'weekly' && pattern.daysOfWeek) {
          if (!pattern.daysOfWeek.includes(currentDate.getDay())) {
            currentDate = addDays(currentDate, 1);
            continue;
          }
        }

        // Create booking for this date
        const bookingStart = new Date(currentDate);
        bookingStart.setHours(baseBooking.startDate.getHours(), baseBooking.startDate.getMinutes());
        
        const bookingEnd = new Date(currentDate);
        bookingEnd.setHours(baseBooking.endDate.getHours(), baseBooking.endDate.getMinutes());

        const newBooking: Booking = {
          ...baseBooking,
          id: `${baseBooking.id}-recur-${currentDate.getTime()}`,
          startDate: bookingStart,
          endDate: bookingEnd,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        generatedBookings.push(newBooking);

        currentDate = this.incrementDate(currentDate, pattern);
      }

      return { success: true, data: generatedBookings };
    } catch (error) {
      return { success: false, error: { message: 'Failed to generate recurring bookings', details: error } };
    }
  }

  private incrementDate(date: Date, pattern: Booking['recurrencePattern']): Date {
    if (!pattern) return date;
    
    const newDate = new Date(date);
    
    switch (pattern.type) {
      case 'daily':
        return addDays(newDate, pattern.interval);
      case 'weekly':
        return addDays(newDate, pattern.interval * 7);
      case 'monthly':
        newDate.setMonth(newDate.getMonth() + pattern.interval);
        return newDate;
      default:
        return addDays(newDate, 1);
    }
  }
}
