
import { BookingFormValues } from './formSchema';

export const getFieldsForStep = (step: number): (keyof BookingFormValues)[] => {
  switch (step) {
    case 0: // Details
      return ['bookingMode', 'customerType', 'date', 'timeSlot', 'zoneId', 'purpose', 'eventType', 'attendees', 'ageGroup'];
    case 1: // Services
      return []; // Services are optional
    case 2: // Contact
      return ['contactName', 'contactEmail', 'contactPhone'];
    case 3: // Confirm
      return [];
    default:
      return [];
  }
};

export const validateCurrentStep = async (
  form: any,
  currentStep: number
): Promise<boolean> => {
  const fieldsToValidate = getFieldsForStep(currentStep);
  const result = await form.trigger(fieldsToValidate);
  return result;
};

export const canContinueToNextStep = (
  form: any,
  currentStep: number
): boolean => {
  const fieldsToCheck = getFieldsForStep(currentStep);
  const errors = form.formState.errors;
  const watchedValues = form.watch();
  
  const hasErrors = fieldsToCheck.some(field => errors[field]);
  const hasValues = fieldsToCheck.every(field => {
    const value = watchedValues[field];
    return value !== "" && value !== undefined && value !== null;
  });
  
  return !hasErrors && hasValues;
};
