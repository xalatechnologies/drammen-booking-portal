
import { useState } from 'react';
import { BookingService, BookingServiceParams } from '@/services/BookingService';

export function useBooking() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const addToCart = async (params: BookingServiceParams) => {
    setIsSubmitting(true);
    setErrors([]);

    try {
      const result = await BookingService.addToCart(params);
      
      if (!result.success) {
        setErrors([result.message || 'Unknown error']);
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
        setErrors([result.message || 'Unknown error']);
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

  const calculatePricing = async (bookingData: any) => {
    return BookingService.calculateTotalPricing(bookingData);
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
