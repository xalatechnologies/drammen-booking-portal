
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calculator } from 'lucide-react';
import { usePriceCalculation } from '@/hooks/usePriceCalculation';
import { PriceBreakdown } from '@/components/booking/PriceBreakdown';
import { ActorType } from '@/types/pricing';
import { SelectedTimeSlot } from '@/utils/recurrenceEngine';

interface BookingPriceCalculationProps {
  selectedSlots: SelectedTimeSlot[];
  facilityId: string;
  actorType: ActorType;
  onActorTypeChange: (type: ActorType) => void;
}

export function BookingPriceCalculation({
  selectedSlots,
  facilityId,
  actorType,
  onActorTypeChange
}: BookingPriceCalculationProps) {
  console.log('BookingPriceCalculation - selectedSlots:', selectedSlots);
  console.log('BookingPriceCalculation - facilityId:', facilityId);
  console.log('BookingPriceCalculation - actorType:', actorType);

  const firstSlot = selectedSlots[0];
  
  const { data: calculation, isLoading } = usePriceCalculation({
    facilityId,
    zoneId: firstSlot?.zoneId,
    startDate: firstSlot?.date,
    customerType: actorType,
    timeSlot: firstSlot?.timeSlot,
    bookingMode: selectedSlots.length > 1 ? 'recurring' : 'one-time'
  });

  console.log('BookingPriceCalculation - calculation result:', calculation);
  console.log('BookingPriceCalculation - isLoading:', isLoading);

  // Calculate total for all slots
  const totalCalculation = calculation ? {
    ...calculation,
    finalPrice: calculation.finalPrice * selectedSlots.length,
    totalPrice: calculation.totalPrice * selectedSlots.length,
    breakdown: calculation.breakdown.map(item => ({
      ...item,
      amount: item.amount * selectedSlots.length
    }))
  } : null;

  console.log('BookingPriceCalculation - totalCalculation:', totalCalculation);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Calculator className="h-5 w-5" />
          Prisberegning
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!firstSlot ? (
          <p className="text-gray-600">Velg tidspunkt for å se pris</p>
        ) : (
          <>
            {selectedSlots.length > 1 && (
              <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  {selectedSlots.length} tidspunkt valgt
                </p>
              </div>
            )}
            
            <PriceBreakdown 
              calculation={totalCalculation || {
                basePrice: 0,
                totalHours: selectedSlots.length * 2,
                totalDays: 1,
                actorTypeDiscount: 0,
                timeSlotMultiplier: 1,
                bookingTypeDiscount: 0,
                weekendSurcharge: 0,
                subtotal: 0,
                finalPrice: 0,
                requiresApproval: false,
                breakdown: [],
                discounts: [],
                surcharges: [],
                totalPrice: 0,
                currency: 'NOK'
              }}
              isLoading={isLoading}
              showDetailed={true}
            />
          </>
        )}
      </CardContent>
    </Card>
  );
}
