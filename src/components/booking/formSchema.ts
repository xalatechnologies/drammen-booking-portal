
import { z } from "zod";

export const bookingFormSchema = z.object({
  bookingMode: z.enum(['one-time', 'date-range', 'recurring']),
  customerType: z.enum(['private', 'nonprofit', 'business', 'youth', 'senior'], {
    required_error: "Velg prisgruppe"
  }),
  date: z.date({
    required_error: "Velg dato"
  }),
  endDate: z.date().optional(),
  timeSlot: z.string().min(1, "Velg tidspunkt"),
  zoneId: z.string().min(1, "Velg område"),
  purpose: z.string().min(3, "Beskriv formålet (minimum 3 tegn)"),
  eventType: z.enum(['training', 'competition', 'meeting', 'celebration', 'other'], {
    required_error: "Velg type arrangement"
  }),
  attendees: z.number().min(1, "Minimum 1 deltaker").max(1000, "Maksimum 1000 deltakere"),
  ageGroup: z.enum(['mixed', 'under-20', 'over-20', 'children', 'adults'], {
    required_error: "Velg aldersgruppe"
  }),
  contactName: z.string().min(2, "Navn må være minst 2 tegn"),
  contactEmail: z.string().email("Ugyldig e-postadresse"),
  contactPhone: z.string().min(8, "Telefonnummer må være minst 8 siffer"),
  organization: z.string().optional(),
  specialServices: z.array(z.string()).optional()
});

export type BookingFormValues = z.infer<typeof bookingFormSchema>;
