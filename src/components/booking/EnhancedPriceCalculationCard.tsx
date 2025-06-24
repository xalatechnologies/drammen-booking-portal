
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calculator, TrendingUp, DollarSign } from 'lucide-react';
import { SelectedTimeSlot } from '@/utils/recurrenceEngine';
import { ActorType } from '@/types/pricing';
import { PricingModeSelector } from './PricingModeSelector';

interface PriceBreakdown {
  basePrice: number;
  totalHours: number;
  subtotal: number;
  actorTypeMultiplier: number;
  timeSlotMultiplier: number;
  dayTypeMultiplier: number;
  discountAmount: number;
  surchargeAmount: number;
  finalPrice: number;
}

interface EnhancedPriceCalculationCardProps {
  selectedSlots: SelectedTimeSlot[];
  facilityId: string;
  actorType: ActorType | '';
  activityType?: string;
  hidePricingModeSelector?: boolean;
}

export function EnhancedPriceCalculationCard({
  selectedSlots,
  facilityId,
  actorType,
  activityType,
  hidePricingModeSelector = false
}: EnhancedPriceCalculationCardProps) {
  // Mock price calculation
  const calculateMockPrice = (): PriceBreakdown => {
    const basePrice = 450; // NOK per hour
    const totalHours = selectedSlots.reduce((sum, slot) => sum + (slot.duration || 1), 0);
    const subtotal = basePrice * totalHours;
    
    // Apply multipliers based on actor type
    let actorTypeMultiplier = 1.0;
    if (actorType) {
      switch (actorType) {
        case 'private-person':
          actorTypeMultiplier = 1.0;
          break;
        case 'lag-foreninger':
          actorTypeMultiplier = 0.8;
          break;
        case 'private-firma':
          actorTypeMultiplier = 1.5;
          break;
      }
    }
    
    const timeSlotMultiplier = 1.0; // Normal hours
    const dayTypeMultiplier = 1.0; // Weekday
    const discountAmount = 0;
    const surchargeAmount = 0;
    
    const finalPrice = subtotal * actorTypeMultiplier * timeSlotMultiplier * dayTypeMultiplier - discountAmount + surchargeAmount;
    
    return {
      basePrice,
      totalHours,
      subtotal,
      actorTypeMultiplier,
      timeSlotMultiplier,
      dayTypeMultiplier,
      discountAmount,
      surchargeAmount,
      finalPrice
    };
  };

  if (selectedSlots.length === 0) {
    return ();
  }

  const priceBreakdown = calculateMockPrice();

  return (
    <Card>
      <CardContent className="space-y-4 pt-5">
        {/* Price Breakdown */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Grunnpris</span>
            <span className="font-medium">{priceBreakdown.basePrice} NOK</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Subtotal</span>
            <span className="font-medium">{priceBreakdown.subtotal} NOK</span>
          </div>
          
          {priceBreakdown.actorTypeMultiplier !== 1.0 && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Aktørtype justering</span>
              <Badge variant={priceBreakdown.actorTypeMultiplier < 1.0 ? "default" : "secondary"}>
                {priceBreakdown.actorTypeMultiplier < 1.0 ? '-' : '+'}{Math.abs((1 - priceBreakdown.actorTypeMultiplier) * 100).toFixed(0)}%
              </Badge>
            </div>
          )}
          
          <hr className="my-3" />
          
          <div className="flex justify-between items-center text-lg font-bold">
            <span className="flex items-center gap-2">
              Totalt å betale
            </span>
            <span className="text-navy-600">{Math.round(priceBreakdown.finalPrice)} NOK</span>
          </div>
        </div>          
      </CardContent>
    </Card>
  );
}
