export const DAYS_OF_WEEK = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;

export type Day = (typeof DAYS_OF_WEEK)[number];

export interface TimeSlot {
  from: string; // "HH:mm"
  to: string;   // "HH:mm"
}

export interface OpeningHours {
  day: Day;
  slots: TimeSlot[];
  isOpen: boolean;
}

export interface BlackoutPeriod {
  id: string;
  title: string;
  startDate: Date;
  endDate: Date;
  isRecurring: boolean;
} 