
import { useState, useEffect } from 'react';
import { PriceCalculation, ActorType, BookingType } from '@/types/pricing';
import { pricingEngine } from '@/utils/pricingEngine';

interface UsePriceCalculationProps {
  facilityId?: string;
  zoneId?: string;
  startDate?: Date;
  endDate?: Date;
  timeSlot?: string;
  customerType?: ActorType;
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
  customerType = 'private-person',
  bookingMode = 'one-time',
  eventType,
  ageGroup
}: UsePriceCalculationProps) {
  const [calculation, setCalculation] = useState<PriceCalculation | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    console.log('usePriceCalculation effect triggered with params:', {
      facilityId,
      zoneId,
      startDate,
      endDate,
      timeSlot,
      customerType,
      bookingMode,
      eventType,
      ageGroup
    });

    // Check if we have the minimum required information for pricing
    if (!facilityId || !zoneId || !startDate || !customerType) {
      console.log('Missing required parameters for price calculation. Details:', {
        facilityId: facilityId || 'MISSING',
        zoneId: zoneId || 'MISSING',
        startDate: startDate || 'MISSING',
        customerType: customerType || 'MISSING'
      });
      setCalculation(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    
    try {
      const finalEndDate = endDate || new Date(startDate.getTime() + 2 * 60 * 60 * 1000);
      
      // Use the actual timeSlot if provided, otherwise use default for estimate
      const calculationTimeSlot = timeSlot || '09:00-11:00';
      
      // Map bookingMode to BookingType
      const bookingType: BookingType = bookingMode === 'recurring' ? 'fastlan' : 'engangs';
      
      console.log('Calling pricingEngine.calculatePrice with:', {
        facilityId,
        zoneId,
        startDate,
        finalEndDate,
        customerType,
        timeSlot: calculationTimeSlot,
        bookingType,
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
        bookingType,
        eventType,
        ageGroup
      );
      
      console.log('pricingEngine.calculatePrice returned:', result);
      setCalculation(result);
    } catch (error) {
      console.error('Error calculating price:', error);
      setCalculation(null);
    } finally {
      setIsLoading(false);
    }
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
