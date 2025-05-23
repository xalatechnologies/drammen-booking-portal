
import { z } from "zod";

// Booking form schema used for validation
export const bookingFormSchema = z.object({
  bookingMode: z.enum(['one-time', 'date-range', 'recurring']),
  date: z.date({
    required_error: "Velg en dato for reservasjonen.",
  }),
  endDate: z.date().optional(),
  timeSlot: z.string({
    required_error: "Velg et tidsintervall.",
  }),
  purpose: z.string().min(10, {
    message: "Formålet må være minst 10 tegn.",
  }).max(500, {
    message: "Formålet kan ikke være mer enn 500 tegn."
  }),
  attendees: z.coerce.number().min(1, {
    message: "Antall deltakere må være minst 1.",
  }).max(1000, {
    message: "Antall deltakere kan ikke være mer enn 1000.",
  }),
  contactName: z.string().min(2, {
    message: "Navnet må være minst 2 tegn.",
  }),
  contactEmail: z.string().email({
    message: "Skriv inn en gyldig e-postadresse.",
  }),
  contactPhone: z.string().min(8, {
    message: "Telefonnummeret må være minst 8 tall.",
  }).regex(/^[0-9+\s]+$/, {
    message: "Telefonnummeret kan bare inneholde tall, '+' og mellomrom.",
  }),
  organization: z.string().optional(),
  
  // Recurring booking fields - now as a nested object
  recurrence: z.object({
    frequency: z.enum(['daily', 'weekly', 'monthly']).optional(),
    interval: z.number().min(1).max(30).optional(),
    count: z.number().min(1).max(100).optional(),
    until: z.date().optional()
  }).optional(),
});

// Type for form values based on the schema
export type BookingFormValues = z.infer<typeof bookingFormSchema>;

// Type for the booking data passed to BookingConfirmStep
export interface BookingData {
  date: Date;
  bookingMode: "one-time" | "date-range" | "recurring";
  timeSlot: string;
  purpose: string;
  attendees: number;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  organization?: string;
  endDate?: Date;
  recurrenceRule?: string;
  recurrenceDescription?: string;
}

// Step type definitions
export type BookingStep = 'details' | 'contact' | 'confirm';
