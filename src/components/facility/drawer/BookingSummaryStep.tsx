
import React from 'react';
import { Calendar, CreditCard, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SelectedTimeSlot } from '@/utils/recurrenceEngine';
import { PriceBreakdown } from '@/components/booking/PriceBreakdown';
import { format } from 'date-fns';
import { nb } from 'date-fns/locale';

interface BookingSummaryStepProps {
  selectedSlots: SelectedTimeSlot[];
  facilityName: string;
  calculation: any;
  totalPrice: number;
  onContinue: () => void;
}

export function BookingSummaryStep({
  selectedSlots,
  facilityName,
  calculation,
  totalPrice,
  onContinue
}: BookingSummaryStepProps) {
  // Group slots by zone for better display
  const slotsByZone = selectedSlots.reduce((acc, slot) => {
    const zoneName = slot.zoneName || 'Ukjent sone';
    if (!acc[zoneName]) {
      acc[zoneName] = [];
    }
    acc[zoneName].push(slot);
    return acc;
  }, {} as Record<string, SelectedTimeSlot[]>);

  return (
    <>
      {/* Booking Summary */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Booking oversikt
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="font-medium flex items-center gap-2">
              <MapPin className="h-4 w-4 text-blue-600" />
              {facilityName}
            </p>
            <p className="text-sm text-gray-600">{selectedSlots.length} tidspunkt valgt</p>
          </div>
          
          {/* Display slots grouped by zone */}
          <div className="space-y-3 max-h-40 overflow-auto">
            {Object.entries(slotsByZone).map(([zoneName, slots]) => (
              <div key={zoneName} className="border-l-2 border-blue-200 pl-3">
                <h5 className="text-sm font-medium text-blue-900 mb-2">{zoneName}</h5>
                <div className="space-y-1">
                  {slots.slice(0, 3).map((slot, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <span>{format(slot.date, 'EEE dd.MM', { locale: nb })}</span>
                      <Badge variant="outline" className="text-xs">
                        {slot.timeSlot}
                      </Badge>
                    </div>
                  ))}
                  {slots.length > 3 && (
                    <p className="text-xs text-gray-500">
                      + {slots.length - 3} flere tidspunkt i denne sonen
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Price Breakdown */}
      {calculation && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Prising
            </CardTitle>
          </CardHeader>
          <CardContent>
            <PriceBreakdown calculation={calculation} />
            <div className="mt-3 pt-3 border-t">
              <div className="flex justify-between items-center font-medium">
                <span>Total ({selectedSlots.length} tidspunkt):</span>
                <span className="text-lg">{totalPrice} kr</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Button onClick={onContinue} className="w-full" size="lg">
        Fortsett til detaljer
      </Button>
    </>
  );
}
