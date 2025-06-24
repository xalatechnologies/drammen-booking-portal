
import { BookingFormData, BookingValidationErrors } from './types';
import { SelectedTimeSlot } from '@/utils/recurrenceEngine';

export const validateFormData = (formData: BookingFormData): BookingValidationErrors => {
  const errors: BookingValidationErrors = {};

  if (!formData.contactName || formData.contactName.trim().length < 2) {
    errors.contactName = 'Navn må være minst 2 tegn';
  }

  if (!formData.contactEmail || !/\S+@\S+\.\S+/.test(formData.contactEmail)) {
    errors.contactEmail = 'Ugyldig e-postadresse';
  }

  if (!formData.contactPhone || formData.contactPhone.replace(/\D/g, '').length < 8) {
    errors.contactPhone = 'Telefonnummer må være minst 8 siffer';
  }

  if (formData.purpose && formData.purpose.trim().length < 3) {
    errors.purpose = 'Formål må være minst 3 tegn';
  }

  if (formData.attendees && (formData.attendees < 1 || formData.attendees > 1000)) {
    errors.attendees = 'Antall deltakere må være mellom 1 og 1000';
  }

  return errors;
};

export const isFormValid = (formData: BookingFormData, selectedSlots: SelectedTimeSlot[]): boolean => {
  const errors = validateFormData(formData);
  return Object.keys(errors).length === 0 && selectedSlots.length > 0;
};
