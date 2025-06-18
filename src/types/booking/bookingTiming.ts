
export interface BookingTiming {
  startDate: Date;
  endDate: Date;
  duration: number; // Minutes
  timeSlot: string;
  isRecurring: boolean;
  recurrencePattern?: RecurrencePattern;
}

export interface RecurrencePattern {
  type: 'daily' | 'weekly' | 'monthly' | 'custom';
  interval: number; // Every N days/weeks/months
  daysOfWeek?: number[]; // For weekly patterns
  dayOfMonth?: number; // For monthly patterns
  endDate?: Date;
  occurrences?: number;
  exceptions: Date[]; // Dates to skip
}
