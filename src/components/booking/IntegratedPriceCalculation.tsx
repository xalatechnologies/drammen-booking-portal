
import React from 'react';
import { SelectedTimeSlot } from '@/utils/recurrenceEngine';
import { ActorType, BookingType } from '@/types/pricing';
import { PriceBreakdown } from './PriceBreakdown';
import { usePriceCalculation } from '@/hooks/usePriceCalculation';
import { Calculator } from 'lucide-react';

interface IntegratedPriceCalculationProps {
  selectedSlots: SelectedTimeSlot[];
  facilityId: string;
  actorType: ActorType;
  bookingType: BookingType;
}

export function IntegratedPriceCalculation({
  selectedSlots,
  facilityId,
  actorType,
  bookingType
}: IntegratedPriceCalculationProps) {
  // Calculate pricing for the first slot as a representative sample
  const firstSlot = selectedSlots[0];
  
  const { calculation, isLoading } = usePriceCalculation({
    facilityId,
    zoneId: firstSlot?.zoneId,
    startDate: firstSlot?.date,
    customerType: actorType,
    timeSlot: firstSlot?.timeSlot,
    bookingMode: bookingType === 'fastlan' ? 'recurring' : 'one-time'
  });

  // Calculate total price for all slots
  const totalPrice = calculation ? calculation.finalPrice * selectedSlots.length : 0;

  if (!firstSlot) {
    return null;
  }

  return (
    <div className="border-2 border-blue-200 bg-blue-50 rounded-xl">
      <div className="p-4">
        <div className="flex items-center gap-2 text-blue-900 mb-4">
          <Calculator className="h-5 w-5" />
          <h3 className="text-lg font-semibold">Prisberegning</h3>
        </div>
        
        {calculation && (
          <>
            <PriceBreakdown 
              calculation={calculation}
              isLoading={isLoading}
              showDetailed={true}
            />
            
            {selectedSlots.length > 1 && (
              <div className="mt-4 pt-4 border-t border-blue-200">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-blue-800">
                    {selectedSlots.length} tidspunkt × {calculation.finalPrice} kr
                  </span>
                  <span className="text-xl font-bold text-blue-900">
                    {totalPrice} kr totalt
                  </span>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
