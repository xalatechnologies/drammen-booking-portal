
import { useState } from 'react';
import { BookingService, BookingFormData, BookingServiceParams } from '@/services/BookingService';
import { SelectedTimeSlot } from '@/utils/recurrenceEngine';
import { Zone } from '@/components/booking/types';

export function useBooking() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const addToCart = async (params: BookingServiceParams) => {
    setIsSubmitting(true);
    setErrors([]);

    try {
      const result = await BookingService.addToCart(params);
      
      if (!result.success) {
        setErrors([result.message]);
      }
      
      return result;
    } catch (error) {
      const errorMessage = 'An unexpected error occurred';
      setErrors([errorMessage]);
      return { success: false, message: errorMessage };
    } finally {
      setIsSubmitting(false);
    }
  };

  const completeBooking = async (params: BookingServiceParams) => {
    setIsSubmitting(true);
    setErrors([]);

    try {
      const result = await BookingService.completeBooking(params);
      
      if (!result.success) {
        setErrors([result.message]);
      }
      
      return result;
    } catch (error) {
      const errorMessage = 'An unexpected error occurred';
      setErrors([errorMessage]);
      return { success: false, message: errorMessage };
    } finally {
      setIsSubmitting(false);
    }
  };

  const validateBooking = (params: BookingServiceParams) => {
    return BookingService.validateBookingData(params);
  };

  const calculatePricing = (selectedSlots: SelectedTimeSlot[], zones: Zone[] = []) => {
    return BookingService.calculateTotalPricing(selectedSlots, zones);
  };

  return {
    addToCart,
    completeBooking,
    validateBooking,
    calculatePricing,
    isSubmitting,
    errors,
    clearErrors: () => setErrors([])
  };
}
