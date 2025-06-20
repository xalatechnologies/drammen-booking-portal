import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ActorType } from '@/types/pricing';
import { usePriceCalculation } from '@/hooks/usePriceCalculation';
import { SelectedTimeSlot } from '@/utils/recurrenceEngine';

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

// Discount percentages for each actor type
const actorTypeDiscounts = {
  'lag-foreninger': 50,      // 50% discount
  'paraply': 70,             // 70% discount
  'private-firma': -20,      // 20% surcharge (negative discount)
  'kommunale-enheter': 30,   // 30% discount
  'private-person': 0        // No discount
};

export function PriceCalculationCard({
  selectedSlots,
  facilityId,
  actorType,
  activityType
}: PriceCalculationCardProps) {
  console.log('PriceCalculationCard - selectedSlots:', selectedSlots);
  console.log('PriceCalculationCard - actorType:', actorType);
  console.log('PriceCalculationCard - facilityId:', facilityId);

  const firstSlot = selectedSlots[0];
  const totalSlots = selectedSlots.length;

  const {
    calculation,
    isLoading
  } = usePriceCalculation({
    facilityId,
    zoneId: firstSlot?.zoneId,
    startDate: firstSlot?.date,
    customerType: actorType as ActorType,
    timeSlot: firstSlot?.timeSlot,
    eventType: activityType,
    bookingMode: totalSlots > 1 ? 'recurring' : 'one-time'
  });

  console.log('PriceCalculationCard - calculation result:', calculation);
  console.log('PriceCalculationCard - isLoading:', isLoading);

  // Calculate total pricing for all selected slots
  const totalCalculation = calculation ? {
    ...calculation,
    basePrice: calculation.basePrice * totalSlots,
    finalPrice: calculation.finalPrice * totalSlots,
    totalPrice: calculation.totalPrice * totalSlots,
    discounts: calculation.discounts.map(discount => ({
      ...discount,
      amount: discount.amount * totalSlots
    })),
    surcharges: calculation.surcharges.map(surcharge => ({
      ...surcharge,
      amount: surcharge.amount * totalSlots
    }))
  } : null;

  const actorTypeLabel = actorTypes.find(a => a.value === actorType)?.label || '';
  const discountPercentage = actorType ? actorTypeDiscounts[actorType as keyof typeof actorTypeDiscounts] : 0;

  console.log('PriceCalculationCard - totalCalculation:', totalCalculation);

  return (
    <Card className="bg-navy-50 border-navy-200">
      <CardContent className="p-4">
        <h4 className="font-semibold text-navy-900 mb-3 text-lg">
          Prisberegning
        </h4>
        
        {!actorType ? (
          <div className="text-navy-700 text-lg">
            Velg aktør type for å beregne pris
          </div>
        ) : isLoading ? (
          <div className="text-navy-700 text-lg">
            Beregner pris...
          </div>
        ) : totalCalculation ? (
          <div className="space-y-2 text-navy-800">
            <div className="flex justify-between text-lg">
              <span>Grunnpris per time:</span>
              <span>{Math.round(calculation.basePrice / (calculation.totalHours || 1))} kr</span>
            </div>
            
            <div className="flex justify-between text-lg">
              <span>Totalt før rabatt:</span>
              <span>{Math.round(totalCalculation.basePrice)} kr</span>
            </div>

            {/* Discount Information */}
            {actorType && discountPercentage !== 0 && (
              <div className={`flex justify-between text-lg ${discountPercentage > 0 ? 'text-green-700' : 'text-orange-700'}`}>
                <span>
                  {discountPercentage > 0 ? 'Rabatt' : 'Tillegg'} ({actorTypeLabel}):
                  <br />
                  <span className="text-sm">
                    {discountPercentage > 0 ? `${discountPercentage}% rabatt` : `${Math.abs(discountPercentage)}% tillegg`}
                  </span>
                </span>
                <span>
                  {discountPercentage > 0 ? '-' : '+'}
                  {Math.round(totalCalculation.basePrice * Math.abs(discountPercentage) / 100)} kr
                </span>
              </div>
            )}

            {totalCalculation.surcharges.length > 0 && (
              <div className="flex justify-between text-lg text-orange-700">
                <span>Andre tillegg:</span>
                <span>+{Math.round(totalCalculation.surcharges.reduce((sum, s) => sum + s.amount, 0))} kr</span>
              </div>
            )}

            <div className="flex justify-between text-lg">
              <span>MVA (25%):</span>
              <span>{Math.round(totalCalculation.totalPrice * 0.25)} kr</span>
            </div>

            <hr className="border-navy-300" />
            <div className="flex justify-between font-bold text-xl">
              <span>Total inkl. MVA:</span>
              <span>{Math.round(totalCalculation.totalPrice * 1.25)} kr</span>
            </div>

            {/* Additional info for special actor types */}
            {(actorType === 'lag-foreninger' || actorType === 'paraply') && (
              <div className="mt-3 p-2 bg-blue-100 rounded text-sm text-blue-800">
                ℹ️ Booking krever godkjenning for {actorTypeLabel.toLowerCase()}
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
