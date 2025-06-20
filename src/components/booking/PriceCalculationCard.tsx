
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

export function PriceCalculationCard({
  selectedSlots,
  facilityId,
  actorType,
  activityType
}: PriceCalculationCardProps) {
  const firstSlot = selectedSlots[0];

  // Calculate total hours from all slots
  const totalHours = selectedSlots.length;

  const {
    calculation,
    isLoading
  } = usePriceCalculation({
    facilityId,
    zoneId: firstSlot?.zoneId,
    startDate: firstSlot?.date,
    customerType: actorType as ActorType,
    timeSlot: firstSlot?.timeSlot,
    eventType: activityType
  });

  console.log('PriceCalculationCard - calculation:', calculation, 'selectedSlots:', selectedSlots.length, 'actorType:', actorType);

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
        ) : calculation ? (
          <div className="space-y-2 text-navy-800">
            <div className="flex justify-between text-lg">
              <span>Grunnpris per time:</span>
              <span>{Math.round(calculation.basePrice / (calculation.totalHours || 1))} kr</span>
            </div>
            
            <div className="flex justify-between text-lg">
              <span>Totalt før rabatt:</span>
              <span>{Math.round(calculation.basePrice * totalHours / (calculation.totalHours || 1))} kr</span>
            </div>

            {calculation.discounts.length > 0 && (
              <div className="flex justify-between text-lg text-green-700">
                <span>Rabatt ({actorTypes.find(a => a.value === actorType)?.label}):</span>
                <span>-{Math.round(calculation.discounts.reduce((sum, d) => sum + d.amount, 0) * totalHours / (calculation.totalHours || 1))} kr</span>
              </div>
            )}

            <div className="flex justify-between text-lg">
              <span>MVA (25%):</span>
              <span>{Math.round(calculation.totalPrice * totalHours / (calculation.totalHours || 1) * 0.25)} kr</span>
            </div>

            <hr className="border-navy-300" />
            <div className="flex justify-between font-bold text-xl">
              <span>Total inkl. MVA:</span>
              <span>{Math.round(calculation.totalPrice * totalHours / (calculation.totalHours || 1) * 1.25)} kr</span>
            </div>
          </div>
        ) : (
          <div className="text-navy-700 text-lg">Ingen prisberegning tilgjengelig</div>
        )}
      </CardContent>
    </Card>
  );
}
