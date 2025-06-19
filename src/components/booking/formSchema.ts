import { z } from "zod";

// Helper function to get validation messages
const getValidationMessage = (key: string, fallback: string) => {
  // This will be enhanced when we integrate with the translation system
  // For now, keeping Norwegian as default for backward compatibility
  const messages: Record<string, string> = {
    selectCustomerType: "Velg prisgruppe",
    selectDate: "Velg dato",
    selectTime: "Velg tidspunkt",
    selectZone: "Velg område",
    purposeMinLength: "Beskriv formålet (minimum 3 tegn)",
    selectEventType: "Velg type arrangement",
    attendeesMin: "Minimum 1 deltaker",
    attendeesMax: "Maksimum 1000 deltakere",
    selectAgeGroup: "Velg aldersgruppe",
    nameMinLength: "Navn må være minst 2 tegn",
    invalidEmail: "Ugyldig e-postadresse",
    phoneMinLength: "Telefonnummer må være minst 8 siffer"
  };
  return messages[key] || fallback;
};

export const bookingFormSchema = z.object({
  bookingMode: z.enum(['one-time', 'date-range', 'recurring']).default('one-time'),
  customerType: z.enum(['private', 'nonprofit', 'business', 'youth', 'senior'], {
    required_error: getValidationMessage('selectCustomerType', "Velg prisgruppe")
  }).default('private'),
  date: z.date({
    required_error: getValidationMessage('selectDate', "Velg dato")
  }),
  endDate: z.date().optional(),
  timeSlot: z.string().min(1, getValidationMessage('selectTime', "Velg tidspunkt")).default(""),
  zoneId: z.string().min(1, getValidationMessage('selectZone', "Velg område")).default(""),
  purpose: z.string().min(3, getValidationMessage('purposeMinLength', "Beskriv formålet (minimum 3 tegn)")).default(""),
  eventType: z.enum(['training', 'competition', 'meeting', 'celebration', 'other'], {
    required_error: getValidationMessage('selectEventType', "Velg type arrangement")
  }).default('other'),
  attendees: z.number().min(1, getValidationMessage('attendeesMin', "Minimum 1 deltaker")).max(1000, getValidationMessage('attendeesMax', "Maksimum 1000 deltakere")).default(1),
  ageGroup: z.enum(['mixed', 'under-20', 'over-20', 'children', 'adults'], {
    required_error: getValidationMessage('selectAgeGroup', "Velg aldersgruppe")
  }).default('mixed'),
  contactName: z.string().min(2, getValidationMessage('nameMinLength', "Navn må være minst 2 tegn")).default(""),
  contactEmail: z.string().email(getValidationMessage('invalidEmail', "Ugyldig e-postadresse")).default(""),
  contactPhone: z.string().min(8, getValidationMessage('phoneMinLength', "Telefonnummer må være minst 8 siffer")).default(""),
  organization: z.string().optional(),
  specialServices: z.array(z.string()).optional().default([])
});

export type BookingFormValues = z.infer<typeof bookingFormSchema>;
