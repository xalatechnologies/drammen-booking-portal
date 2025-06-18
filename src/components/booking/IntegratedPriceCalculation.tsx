
import React from 'react';
import { SelectedTimeSlot } from '@/utils/recurrenceEngine';
import { ActorType, BookingType } from '@/types/pricing';
import { PriceBreakdown } from './PriceBreakdown';
import { usePriceCalculation } from '@/hooks/usePriceCalculation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
    <Card className="border-2 border-blue-200 bg-blue-50">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2 text-blue-900">
          <Calculator className="h-5 w-5" />
          Prisberegning
        </CardTitle>
      </CardHeader>
      <CardContent>
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
      </CardContent>
    </Card>
  );
}
