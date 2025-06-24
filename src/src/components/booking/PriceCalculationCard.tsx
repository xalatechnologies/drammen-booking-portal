
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ActorType } from '@/types/pricing';
import { SelectedTimeSlot } from '@/utils/recurrenceEngine';
import { enhancedPricingEngine } from '@/utils/enhancedPricingEngine';
import { PricingModeSelector, PricingMode } from './PricingModeSelector';

interface PriceCalculationCardProps {
  selectedSlots: SelectedTimeSlot[];
  facilityId: string;
  actorType: ActorType | '';
  activityType: string;
}

const actorTypes = [{
  value: 'private-person',
  label: 'Privatperson'
}, {
  value: 'lag-foreninger',
  label: 'Lag og foreninger'
}, {
  value: 'paraply',
  label: 'Paraplyorganisasjoner'
}, {
  value: 'private-firma',
  label: 'Private firma'
}, {
  value: 'kommunale-enheter',
  label: 'Kommunale enheter'
}];

export function PriceCalculationCard({
  selectedSlots,
  facilityId,
  actorType,
  activityType
}: PriceCalculationCardProps) {
  const firstSlot = selectedSlots[0];
  const [pricingMode, setPricingMode] = useState<PricingMode>('hourly');
  
  if (!firstSlot || !actorType) {
    return (
      <Card className="bg-navy-50 border-navy-200">
        <CardContent className="p-4">
          <h4 className="font-semibold text-navy-900 mb-3 text-lg">
            Prisberegning
          </h4>
          <div className="text-navy-700 text-lg">
            {!actorType ? 'Velg aktør type for å beregne pris' : 'Velg tidspunkt for å se pris'}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Get available pricing modes for this zone - only hourly for now
  const availableModes: PricingMode[] = ['hourly'];
  
  // Calculate pricing for all selected slots
  let totalCalculation = null;
  try {
    const endDate = new Date(firstSlot.date.getTime() + 24 * 60 * 60 * 1000); // Next day
    
    const calculation = enhancedPricingEngine.calculatePrice(
      facilityId,
      firstSlot.zoneId,
      firstSlot.date,
      endDate,
      actorType as ActorType,
      firstSlot.timeSlot,
      'hourly',
      selectedSlots.length > 1 ? 'fastlan' : 'engangs',
      activityType
    );

    // Multiply by number of slots for total calculation
    totalCalculation = {
      ...calculation,
      totalPrice: calculation.totalPrice * selectedSlots.length,
      finalPrice: calculation.finalPrice * selectedSlots.length,
      breakdown: calculation.breakdown.map(item => ({
        ...item,
        amount: item.amount * selectedSlots.length
      }))
    };
  } catch (error) {
    console.error('Error calculating enhanced pricing:', error);
  }

  const actorTypeLabel = actorTypes.find(a => a.value === actorType)?.label || '';

  return (
    <Card className="bg-navy-50 border-navy-200">
      <CardContent className="p-4 space-y-4">
        <h4 className="font-semibold text-navy-900 mb-3 text-lg">
          Prisberegning
        </h4>

        {/* Pricing Mode Selector */}
        <PricingModeSelector
          selectedMode={pricingMode}
          onModeChange={setPricingMode}
          availableModes={availableModes}
        />
        
        {totalCalculation ? (
          <div className="space-y-2 text-navy-800">
            {selectedSlots.length > 1 && (
              <div className="flex justify-between text-lg">
                <span>Antall tidspunkt:</span>
                <span>{selectedSlots.length}</span>
              </div>
            )}

            {/* Pricing breakdown */}
            {totalCalculation.breakdown.map((item, index) => (
              <div 
                key={index} 
                className={`flex justify-between text-lg ${
                  item.type === 'discount' ? 'text-green-700' : 
                  item.type === 'surcharge' ? 'text-orange-700' : ''
                }`}
              >
                <span>{item.description}:</span>
                <span>
                  {item.amount < 0 ? '' : item.type === 'discount' ? '-' : ''}
                  {Math.abs(Math.round(item.amount))} kr
                </span>
              </div>
            ))}

            <div className="flex justify-between text-lg">
              <span>MVA (25%):</span>
              <span>{Math.round(totalCalculation.totalPrice * 0.25)} kr</span>
            </div>

            <hr className="border-navy-300" />
            <div className="flex justify-between font-bold text-xl">
              <span>Total inkl. MVA:</span>
              <span>{Math.round(totalCalculation.totalPrice * 1.25)} kr</span>
            </div>

            {/* Special notices */}
            {totalCalculation.requiresApproval && (
              <div className="mt-3 p-2 bg-blue-100 rounded text-sm text-blue-800">
                ℹ️ Booking krever godkjenning for {actorTypeLabel.toLowerCase()}
              </div>
            )}

            {pricingMode === 'package' && (
              <div className="mt-3 p-2 bg-green-100 rounded text-sm text-green-800">
                💡 Pakke pris gjelder for hele perioden
              </div>
            )}
          </div>
        ) : (
          <div className="text-navy-700 text-lg">Ingen prisberegning tilgjengelig</div>
        )}
      </CardContent>
    </Card>
  );
}
