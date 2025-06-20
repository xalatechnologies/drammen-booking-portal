
import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { ActorTypeSelector } from '../ActorTypeSelector';
import { usePriceCalculation } from '@/hooks/usePriceCalculation';
import { ActorType } from '@/types/pricing';
import { SelectedTimeSlot } from '@/utils/recurrenceEngine';

interface BookingStepPricingDetailsProps {
  formData: {
    purpose: string;
    attendees: number;
    activityType: string;
    additionalInfo: string;
    actorType: ActorType;
    termsAccepted: boolean;
  };
  updateFormData: (updates: any) => void;
  selectedSlots: SelectedTimeSlot[];
  facilityId: string;
}

export function BookingStepPricingDetails({ 
  formData, 
  updateFormData, 
  selectedSlots, 
  facilityId 
}: BookingStepPricingDetailsProps) {
  const firstSlot = selectedSlots[0];
  const { calculation, isLoading } = usePriceCalculation({
    facilityId,
    zoneId: firstSlot?.zoneId,
    startDate: firstSlot?.date,
    customerType: formData.actorType,
    timeSlot: firstSlot?.timeSlot,
    eventType: formData.activityType,
  });

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">
        Detaljer og prising
      </h3>

      {/* Additional Information */}
      <div className="space-y-2">
        <Label htmlFor="additionalInfo" className="text-base font-medium">
          Tilleggsopplysninger
        </Label>
        <Textarea
          id="additionalInfo"
          placeholder="Tilleggsinformasjon om reservasjonen (valgfritt)..."
          value={formData.additionalInfo}
          onChange={(e) => updateFormData({ additionalInfo: e.target.value })}
          className="min-h-[80px] text-base"
        />
      </div>

      {/* Actor Type Selection */}
      <div className="space-y-3">
        <Label className="text-base font-medium">
          Aktør type <span className="text-red-500">*</span>
        </Label>
        <ActorTypeSelector
          value={formData.actorType}
          onChange={(actorType) => updateFormData({ actorType })}
        />
      </div>

      {/* Price Calculation */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <h4 className="text-lg font-semibold text-blue-900 mb-3">
            Prisberegning
          </h4>
          
          {isLoading ? (
            <div className="text-blue-700">Beregner pris...</div>
          ) : calculation ? (
            <div className="space-y-2 text-blue-800">
              <div className="flex justify-between text-base">
                <span>Antall tidspunkt:</span>
                <span>{selectedSlots.length}</span>
              </div>
              <div className="flex justify-between text-base">
                <span>Grunnpris:</span>
                <span>{calculation.basePrice} kr</span>
              </div>
              {calculation.discounts.length > 0 && (
                <div className="flex justify-between text-base text-green-700">
                  <span>Rabatt ({formData.actorType}):</span>
                  <span>-{calculation.discounts.reduce((sum, d) => sum + d.amount, 0)} kr</span>
                </div>
              )}
              <div className="flex justify-between text-base">
                <span>MVA (25%):</span>
                <span>{Math.round(calculation.totalPrice * 0.25)} kr</span>
              </div>
              <hr className="border-blue-300" />
              <div className="flex justify-between text-lg font-bold">
                <span>Total:</span>
                <span>{calculation.totalPrice + Math.round(calculation.totalPrice * 0.25)} kr</span>
              </div>
            </div>
          ) : (
            <div className="text-blue-700">Ingen prisberegning tilgjengelig</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
