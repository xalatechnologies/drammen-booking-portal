
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Calculator, Clock, Users } from 'lucide-react';
import { PricingModeSelector, PricingMode } from './PricingModeSelector';
import { SelectedTimeSlot } from '@/utils/recurrenceEngine';
import { ActorType } from '@/types/pricing';
import { usePricing } from '@/hooks/usePricing';

interface EnhancedPriceCalculationCardProps {
  selectedSlots: SelectedTimeSlot[];
  facilityId: string;
  actorType: ActorType;
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
  const [pricingMode, setPricingMode] = useState<PricingMode>('hourly');
  
  const { calculatePrice, isLoading } = usePricing();
  const [pricing, setPricing] = useState({
    basePrice: 0,
    discountAmount: 0,
    totalPrice: 0,
    pricePerHour: 450,
    totalHours: 0
  });

  useEffect(() => {
    if (selectedSlots.length > 0) {
      const totalHours = selectedSlots.reduce((sum, slot) => sum + (slot.duration || 1), 0);
      const basePrice = totalHours * pricing.pricePerHour;
      
      // Apply actor type discounts
      let discountMultiplier = 1;
      switch (actorType) {
        case 'lag-foreninger':
        case 'paraply':
          discountMultiplier = 0.8; // 20% discount
          break;
        case 'private-firma':
          discountMultiplier = 0.9; // 10% discount
          break;
        case 'kommunale-enheter':
          discountMultiplier = 0.85; // 15% discount
          break;
        default:
          discountMultiplier = 1; // No discount for private persons
      }
      
      const totalPrice = basePrice * discountMultiplier;
      const discountAmount = basePrice - totalPrice;
      
      setPricing({
        basePrice,
        discountAmount,
        totalPrice,
        pricePerHour: pricing.pricePerHour,
        totalHours
      });
    }
  }, [selectedSlots, actorType, pricing.pricePerHour]);

  const getActorTypeLabel = () => {
    switch (actorType) {
      case 'private-person': return 'Privatperson';
      case 'lag-foreninger': return 'Lag/Foreninger';
      case 'paraply': return 'Paraplyorganisasjon';
      case 'private-firma': return 'Privat firma';
      case 'kommunale-enheter': return 'Kommunale enheter';
      default: return 'Ukjent';
    }
  };

  if (selectedSlots.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          Prisberegning
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Pricing Mode Selector - only show if not hidden */}
        {!hidePricingModeSelector && (
          <PricingModeSelector
            selectedMode={pricingMode}
            onModeChange={setPricingMode}
          />
        )}

        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-sm text-gray-600 mb-1">
              <Clock className="h-4 w-4" />
              Timer totalt
            </div>
            <div className="text-lg font-semibold">{pricing.totalHours}</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-sm text-gray-600 mb-1">
              <Users className="h-4 w-4" />
              Aktørtype
            </div>
            <Badge variant="outline" className="text-xs">
              {getActorTypeLabel()}
            </Badge>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-600 mb-1">Pris per time</div>
            <div className="text-lg font-semibold">{pricing.pricePerHour} kr</div>
          </div>
        </div>

        <Separator />

        {/* Price Breakdown */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Grunnpris ({pricing.totalHours} timer)</span>
            <span className="font-medium">{pricing.basePrice.toLocaleString('no-NO')} kr</span>
          </div>

          {pricing.discountAmount > 0 && (
            <div className="flex justify-between items-center text-green-600">
              <span className="text-sm">Rabatt ({getActorTypeLabel()})</span>
              <span className="font-medium">-{pricing.discountAmount.toLocaleString('no-NO')} kr</span>
            </div>
          )}

          <Separator />

          <div className="flex justify-between items-center text-lg font-semibold">
            <span>Totalt å betale</span>
            <span className="text-blue-600">{pricing.totalPrice.toLocaleString('no-NO')} kr</span>
          </div>
        </div>

        {/* Additional Info */}
        {activityType && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <div className="text-sm text-blue-800">
              <span className="font-medium">Aktivitet:</span> {activityType}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
