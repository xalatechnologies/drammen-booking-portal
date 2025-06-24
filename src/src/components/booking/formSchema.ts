
import { z } from 'zod';

export const bookingFormSchema = z.object({
  purpose: z.string().min(1, 'Formål er påkrevd'),
  attendees: z.number().min(1, 'Antall deltakere må være minst 1'),
  activityType: z.string().min(1, 'Aktivitetstype er påkrevd'),
  additionalInfo: z.string().optional(),
  actorType: z.string().min(1, 'Aktørtype er påkrevd'),
  termsAccepted: z.boolean().refine(val => val === true, 'Du må akseptere vilkårene'),
});

export type BookingFormData = z.infer<typeof bookingFormSchema>;
