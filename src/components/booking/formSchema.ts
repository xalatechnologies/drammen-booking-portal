
import { z } from "zod";

export const bookingFormSchema = z.object({
  bookingMode: z.enum(['one-time', 'date-range', 'recurring']).default('one-time'),
  customerType: z.enum(['private', 'nonprofit', 'business', 'youth', 'senior'], {
    required_error: "Velg prisgruppe"
  }).default('private'),
  date: z.date({
    required_error: "Velg dato"
  }),
  endDate: z.date().optional(),
  timeSlot: z.string().min(1, "Velg tidspunkt").default(""),
  zoneId: z.string().min(1, "Velg område").default(""),
  purpose: z.string().min(3, "Beskriv formålet (minimum 3 tegn)").default(""),
  eventType: z.enum(['training', 'competition', 'meeting', 'celebration', 'other'], {
    required_error: "Velg type arrangement"
  }).default('other'),
  attendees: z.number().min(1, "Minimum 1 deltaker").max(1000, "Maksimum 1000 deltakere").default(1),
  ageGroup: z.enum(['mixed', 'under-20', 'over-20', 'children', 'adults'], {
    required_error: "Velg aldersgruppe"
  }).default('mixed'),
  contactName: z.string().min(2, "Navn må være minst 2 tegn").default(""),
  contactEmail: z.string().email("Ugyldig e-postadresse").default(""),
  contactPhone: z.string().min(8, "Telefonnummer må være minst 8 siffer").default(""),
  organization: z.string().optional(),
  specialServices: z.array(z.string()).optional()
});

export type BookingFormValues = z.infer<typeof bookingFormSchema>;
