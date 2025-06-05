
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
  eventType?: string;
  ageGroup?: string;
}

export function usePriceCalculation({
  facilityId,
  zoneId,
  startDate,
  endDate,
  timeSlot,
  customerType = 'private',
  bookingMode = 'one-time',
  eventType,
  ageGroup
}: UsePriceCalculationProps) {
  const [calculation, setCalculation] = useState<PriceCalculation | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    console.log('usePriceCalculation effect triggered:', {
      facilityId,
      zoneId,
      startDate,
      customerType,
      timeSlot,
      bookingMode
    });

    // Check if we have the minimum required information for pricing
    if (!facilityId || !zoneId || !startDate || !customerType) {
      console.log('Missing required parameters for price calculation:', {
        facilityId: !!facilityId,
        zoneId: !!zoneId,
        startDate: !!startDate,
        customerType: !!customerType
      });
      setCalculation(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    
    const timer = setTimeout(() => {
      try {
        const finalEndDate = endDate || new Date(startDate.getTime() + 2 * 60 * 60 * 1000);
        
        // Use a default timeSlot for calculation if none provided
        const calculationTimeSlot = timeSlot || '09:00 - 11:00';
        
        console.log('Calculating price with:', {
          facilityId,
          zoneId,
          startDate,
          finalEndDate,
          customerType,
          timeSlot: calculationTimeSlot,
          bookingMode,
          eventType,
          ageGroup
        });

        const result = pricingEngine.calculatePrice(
          facilityId,
          zoneId,
          startDate,
          finalEndDate,
          customerType,
          calculationTimeSlot,
          bookingMode,
          eventType,
          ageGroup
        );
        
        console.log('Price calculation result:', result);
        setCalculation(result);
      } catch (error) {
        console.error('Error calculating price:', error);
        setCalculation(null);
      } finally {
        setIsLoading(false);
      }
    }, 50); // Faster response

    return () => clearTimeout(timer);
  }, [facilityId, zoneId, startDate, endDate, timeSlot, customerType, bookingMode, eventType, ageGroup]);

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
