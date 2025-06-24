
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { SelectedTimeSlot } from '@/utils/recurrenceEngine';
import { ActorType, BookingType } from '@/types/pricing';

interface IntegratedPriceCalculationProps {
  selectedSlots: SelectedTimeSlot[];
  facilityId: string;
  actorType: ActorType;
  bookingType?: BookingType;
  basePricePerHour?: number;
  actorTypeMultiplier?: number;
  servicesPrice?: number;
  discounts?: number;
}

export function IntegratedPriceCalculation({
  selectedSlots,
  facilityId,
  actorType,
  bookingType = 'engangs',
  basePricePerHour = 450,
  actorTypeMultiplier = 1,
  servicesPrice = 0,
  discounts = 0
}: IntegratedPriceCalculationProps) {
  const totalHours = selectedSlots.reduce((total, slot) => total + (slot.duration || 1), 0);
  const basePrice = basePricePerHour * totalHours;
  const adjustedPrice = basePrice * actorTypeMultiplier;
  const totalPrice = adjustedPrice + servicesPrice - discounts;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Prisberegning</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex justify-between">
          <span>Grunnpris ({totalHours}t × {basePricePerHour} kr)</span>
          <span>{basePrice.toFixed(0)} kr</span>
        </div>
        
        {actorTypeMultiplier !== 1 && (
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Aktørtype justering (×{actorTypeMultiplier})</span>
            <span>{(adjustedPrice - basePrice).toFixed(0)} kr</span>
          </div>
        )}
        
        {servicesPrice > 0 && (
          <div className="flex justify-between">
            <span>Tilleggstjenester</span>
            <span>{servicesPrice.toFixed(0)} kr</span>
          </div>
        )}
        
        {discounts > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Rabatter</span>
            <span>-{discounts.toFixed(0)} kr</span>
          </div>
        )}
        
        <Separator />
        
        <div className="flex justify-between font-semibold text-lg">
          <span>Totalt</span>
          <span>{totalPrice.toFixed(0)} kr</span>
        </div>
      </CardContent>
    </Card>
  );
}
