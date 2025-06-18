import { RRule } from 'rrule';
import { addMinutes, parseISO, format } from 'date-fns';

interface TimeSlot {
  start: Date;
  end: Date;
}

interface BookingEntry {
  id: string;
  facilityId: string;
  startDateTime: Date;
  endDateTime: Date;
  recurrenceRule?: string;
}

// Convert a time string (e.g., "14:00-16:00") to start and end times on a given date
export const parseTimeSlot = (date: Date, timeSlot: string): TimeSlot | null => {
  const [startStr, endStr] = timeSlot.split('-');
  if (!startStr || !endStr) return null;
  
  const [startHours, startMinutes] = startStr.split(':').map(Number);
  const [endHours, endMinutes] = endStr.split(':').map(Number);
  
  const startDate = new Date(date);
  startDate.setHours(startHours || 0, startMinutes || 0, 0, 0);
  
  const endDate = new Date(date);
  endDate.setHours(endHours || 0, endMinutes || 0, 0, 0);
  
  return { start: startDate, end: endDate };
};

// Generate occurrences for a recurring booking
const generateOccurrences = (
  startDate: Date, 
  timeSlot: string, 
  recurrenceRule: string, 
  until: Date
): TimeSlot[] => {
  try {
    // Parse the time slot to get duration in minutes
    const slot = parseTimeSlot(startDate, timeSlot);
    if (!slot) return [];
    
    const durationMinutes = (slot.end.getTime() - slot.start.getTime()) / (1000 * 60);
    
    // Create an RRule
    let ruleOptions = RRule.parseString(recurrenceRule);
    ruleOptions = {
      ...ruleOptions,
      dtstart: startDate,
      until: until
    };
    
    const rule = new RRule(ruleOptions);
    
    // Generate all occurrences
    const occurrenceDates = rule.all();
    
    // Convert to TimeSlot objects
    return occurrenceDates.map(date => ({
      start: date,
      end: addMinutes(date, durationMinutes)
    }));
  } catch (error) {
    console.error('Error generating occurrences:', error);
    console.log('Parameters:', { startDate: format(startDate, 'yyyy-MM-dd'), timeSlot, recurrenceRule, until: format(until, 'yyyy-MM-dd') });
    return [];
  }
};

// Check if two time slots overlap
const doSlotsOverlap = (slot1: TimeSlot, slot2: TimeSlot): boolean => {
  return slot1.start < slot2.end && slot2.start < slot1.end;
};

// Check if any slots in the arrays overlap
const doAnyOverlap = (slots1: TimeSlot[], slots2: TimeSlot[]): boolean => {
  for (const slot1 of slots1) {
    for (const slot2 of slots2) {
      if (doSlotsOverlap(slot1, slot2)) {
        return true;
      }
    }
  }
  return false;
};

/**
 * Check if a proposed booking conflicts with existing bookings
 * @param facilityId ID of the facility to check
 * @param startDate Start date of the booking
 * @param timeSlot Time slot string (e.g., "14:00-16:00")
 * @param bookingMode Type of booking (one-time, date-range, recurring)
 * @param endDate End date for date-range or recurring bookings
 * @param recurrenceRule iCal RRULE for recurring bookings
 * @param existingBookings Array of existing bookings to check against
 * @returns Object with conflict status and details
 */
export const checkBookingConflict = async (
  facilityId: string,
  startDate: Date,
  timeSlot: string,
  bookingMode: "one-time" | "date-range" | "recurring",
  endDate?: Date,
  recurrenceRule?: string,
  existingBookings: BookingEntry[] = []
): Promise<{hasConflict: boolean, conflictingDates?: Date[]}> => {
  // Filter bookings for this facility
  const facilityBookings = existingBookings.filter(
    booking => booking.facilityId === facilityId
  );
  
  if (facilityBookings.length === 0) {
    // No existing bookings for this facility
    return { hasConflict: false };
  }
  
  // Generate proposed time slots based on booking mode
  const proposedSlots: TimeSlot[] = [];
  const conflictingDates: Date[] = [];
  
  const timeSlotObj = parseTimeSlot(startDate, timeSlot);
  if (!timeSlotObj) {
    return { hasConflict: false }; // Invalid time slot format
  }
  
  if (bookingMode === "one-time") {
    // Single booking
    proposedSlots.push(timeSlotObj);
  } 
  else if (bookingMode === "date-range" && endDate) {
    // Date range booking
    let currentDate = new Date(startDate);
    
    while (currentDate <= endDate) {
      const slot = parseTimeSlot(currentDate, timeSlot);
      if (slot) proposedSlots.push(slot);
      
      currentDate = new Date(currentDate);
      currentDate.setDate(currentDate.getDate() + 1);
    }
  } 
  else if (bookingMode === "recurring" && recurrenceRule && endDate) {
    // Recurring booking
    const occurrences = generateOccurrences(
      startDate,
      timeSlot,
      recurrenceRule,
      endDate
    );
    proposedSlots.push(...occurrences);
  }
  
  // Check each existing booking against our proposed slots
  for (const booking of facilityBookings) {
    const existingSlots: TimeSlot[] = [];
    
    if (booking.recurrenceRule) {
      // Existing booking is recurring
      const bookingEndDate = endDate || new Date(startDate.getTime() + 365 * 24 * 60 * 60 * 1000); // Default to 1 year if no end date
      
      // Create a time slot string from the existing booking
      const existingTimeSlot = `${booking.startDateTime.getHours()}:${booking.startDateTime.getMinutes()}-${booking.endDateTime.getHours()}:${booking.endDateTime.getMinutes()}`;
      
      const occurrences = generateOccurrences(
        booking.startDateTime,
        existingTimeSlot,
        booking.recurrenceRule,
        bookingEndDate
      );
      existingSlots.push(...occurrences);
    } 
    else {
      // Single booking or date range
      existingSlots.push({
        start: booking.startDateTime,
        end: booking.endDateTime
      });
    }
    
    // Check for overlaps
    if (doAnyOverlap(proposedSlots, existingSlots)) {
      return { 
        hasConflict: true,
        conflictingDates: existingSlots.map(slot => slot.start)
      };
    }
  }
  
  return { hasConflict: false };
};

// Convert a booking mode, recurrence frequency, and interval to a human-readable string
export const getRecurrenceDescription = (
  frequency: 'daily' | 'weekly' | 'monthly',
  interval: number = 1
): string => {
  switch (frequency) {
    case 'daily':
      return interval === 1 
        ? 'Hver dag' 
        : `Hver ${interval}. dag`;
    case 'weekly':
      return interval === 1 
        ? 'Hver uke' 
        : `Hver ${interval}. uke`;
    case 'monthly':
      return interval === 1 
        ? 'Hver måned' 
        : `Hver ${interval}. måned`;
    default:
      return 'Gjentakende';
  }
};

// Generate an iCal RRULE string from parameters
export const generateRecurrenceRule = (
  frequency: 'daily' | 'weekly' | 'monthly',
  interval: number = 1,
  weekdays: number[] = [],
  count?: number,
  until?: Date
): string => {
  let rule = `FREQ=${frequency.toUpperCase()};INTERVAL=${interval}`;
  
  // Add BYDAY for weekly/monthly patterns
  if ((frequency === 'weekly' || frequency === 'monthly') && weekdays.length > 0) {
    const dayMap = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'];
    const byDay = weekdays.map(day => dayMap[day]).join(',');
    rule += `;BYDAY=${byDay}`;
  }
  
  if (count) {
    rule += `;COUNT=${count}`;
  } else if (until) {
    const untilStr = until.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    rule += `;UNTIL=${untilStr}`;
  }
  
  return rule;
};

// Parse an RRULE string to get its properties
export const parseRecurrenceRule = (rrule: string): {
  frequency: 'daily' | 'weekly' | 'monthly',
  interval: number,
  count?: number,
  until?: Date
} => {
  const ruleObj = RRule.parseString(rrule);
  
  return {
    frequency: ruleObj.freq === RRule.DAILY 
      ? 'daily' 
      : ruleObj.freq === RRule.WEEKLY 
        ? 'weekly' 
        : 'monthly',
    interval: ruleObj.interval || 1,
    count: ruleObj.count,
    until: ruleObj.until
  };
};
