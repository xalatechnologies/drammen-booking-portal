
import { useState, useEffect } from 'react';
import { PriceCalculation, CustomerType } from '@/types/pricing';
import { pricingEngine } from '@/utils/pricingEngine';

interface UsePriceCalculationProps {
  facilityId?: string;
  zoneId?: string;
  startDate?: Date;
  endDate?: Date;
  timeSlot?: string;
  customerType?: CustomerType;
  bookingMode?: 'one-time' | 'date-range' | 'recurring';
}

export function usePriceCalculation({
  facilityId,
  zoneId,
  startDate,
  endDate,
  timeSlot,
  customerType = 'private',
  bookingMode = 'one-time'
}: UsePriceCalculationProps) {
  const [calculation, setCalculation] = useState<PriceCalculation | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    console.log('usePriceCalculation effect triggered:', {
      facilityId,
      zoneId,
      startDate,
      timeSlot,
      bookingMode
    });

    // Reset calculation if missing required parameters
    if (!facilityId || !zoneId || !startDate || !timeSlot) {
      console.log('Missing required parameters for price calculation');
      setCalculation(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    
    // Simulate API delay but make it shorter for better UX
    const timer = setTimeout(() => {
      try {
        const finalEndDate = endDate || new Date(startDate.getTime() + 2 * 60 * 60 * 1000); // Default 2 hours
        
        console.log('Calculating price with:', {
          facilityId,
          zoneId,
          startDate,
          finalEndDate,
          customerType,
          timeSlot,
          bookingMode
        });

        const result = pricingEngine.calculatePrice(
          facilityId,
          zoneId,
          startDate,
          finalEndDate,
          customerType,
          timeSlot,
          bookingMode
        );
        
        console.log('Price calculation result:', result);
        setCalculation(result);
      } catch (error) {
        console.error('Error calculating price:', error);
        setCalculation(null);
      } finally {
        setIsLoading(false);
      }
    }, 150); // Reduced delay for better responsiveness

    return () => clearTimeout(timer);
  }, [facilityId, zoneId, startDate, endDate, timeSlot, customerType, bookingMode]);

  const applyOverride = (amount: number, reason: string) => {
    if (calculation) {
      const updated = pricingEngine.applyOverride(calculation, amount, reason);
      setCalculation(updated);
    }
  };

  return {
    calculation,
    isLoading,
    applyOverride
  };
}
