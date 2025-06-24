
import { TimeSlotManager } from './TimeSlotManager';
import { RecurrenceManager } from './RecurrenceManager';
import { ConflictResolver } from './ConflictResolver';

interface BookingEntry {
  id: string;
  facilityId: string;
  startDateTime: Date;
  endDateTime: Date;
  recurrenceRule?: string;
}

export class ConflictDetector {
  private timeSlotManager: TimeSlotManager;
  private recurrenceManager: RecurrenceManager;
  private conflictResolver: ConflictResolver;

  constructor() {
    this.timeSlotManager = new TimeSlotManager();
    this.recurrenceManager = new RecurrenceManager();
    this.conflictResolver = new ConflictResolver();
  }

  async checkBookingConflict(
    facilityId: string,
    startDate: Date,
    timeSlot: string,
    bookingMode: "one-time" | "date-range" | "recurring",
    endDate?: Date,
    recurrenceRule?: string,
    existingBookings: BookingEntry[] = []
  ): Promise<{hasConflict: boolean, conflictingDates?: Date[]}> {
    // Filter bookings for this facility
    const facilityBookings = existingBookings.filter(
      booking => booking.facilityId === facilityId
    );
    
    if (facilityBookings.length === 0) {
      return { hasConflict: false };
    }
    
    // Generate proposed time slots based on booking mode
    const proposedSlots = this.generateProposedSlots(
      startDate, 
      timeSlot, 
      bookingMode, 
      endDate, 
      recurrenceRule
    );

    if (proposedSlots.length === 0) {
      return { hasConflict: false };
    }

    // Check each existing booking against our proposed slots
    for (const booking of facilityBookings) {
      const existingSlots = this.generateExistingSlots(booking, endDate || startDate);
      
      if (this.timeSlotManager.doAnyOverlap(proposedSlots, existingSlots)) {
        return { 
          hasConflict: true,
          conflictingDates: existingSlots.map(slot => slot.start)
        };
      }
    }
    
    return { hasConflict: false };
  }

  private generateProposedSlots(
    startDate: Date,
    timeSlot: string,
    bookingMode: string,
    endDate?: Date,
    recurrenceRule?: string
  ) {
    const timeSlotObj = this.timeSlotManager.parseTimeSlot(startDate, timeSlot);
    if (!timeSlotObj) return [];

    const proposedSlots = [];

    if (bookingMode === "one-time") {
      proposedSlots.push(timeSlotObj);
    } 
    else if (bookingMode === "date-range" && endDate) {
      let currentDate = new Date(startDate);
      while (currentDate <= endDate) {
        const slot = this.timeSlotManager.parseTimeSlot(currentDate, timeSlot);
        if (slot) proposedSlots.push(slot);
        currentDate.setDate(currentDate.getDate() + 1);
      }
    } 
    else if (bookingMode === "recurring" && recurrenceRule && endDate) {
      const occurrences = this.recurrenceManager.generateOccurrences(
        startDate,
        timeSlot,
        recurrenceRule,
        endDate
      );
      proposedSlots.push(...occurrences);
    }

    return proposedSlots;
  }

  private generateExistingSlots(booking: BookingEntry, endDate: Date) {
    const existingSlots = [];

    if (booking.recurrenceRule) {
      const existingTimeSlot = `${booking.startDateTime.getHours()}:${booking.startDateTime.getMinutes()}-${booking.endDateTime.getHours()}:${booking.endDateTime.getMinutes()}`;
      const occurrences = this.recurrenceManager.generateOccurrences(
        booking.startDateTime,
        existingTimeSlot,
        booking.recurrenceRule,
        endDate
      );
      existingSlots.push(...occurrences);
    } else {
      existingSlots.push({
        start: booking.startDateTime,
        end: booking.endDateTime
      });
    }

    return existingSlots;
  }
}
