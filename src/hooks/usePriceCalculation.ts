
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
    if (!facilityId || !zoneId || !startDate) {
      setCalculation(null);
      return;
    }

    setIsLoading(true);
    
    // Simulate API delay
    const timer = setTimeout(() => {
      const finalEndDate = endDate || new Date(startDate.getTime() + 2 * 60 * 60 * 1000); // Default 2 hours
      
      const result = pricingEngine.calculatePrice(
        facilityId,
        zoneId,
        startDate,
        finalEndDate,
        customerType,
        timeSlot || '',
        bookingMode
      );
      
      setCalculation(result);
      setIsLoading(false);
    }, 300);

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
