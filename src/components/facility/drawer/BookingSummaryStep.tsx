
import React from 'react';
import { Calendar, CreditCard, MapPin, MessageSquare, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SelectedTimeSlot } from '@/utils/recurrenceEngine';
import { CustomerType } from '@/types/pricing';
import { Zone } from '@/components/booking/types';
import { PriceBreakdown } from '@/components/booking/PriceBreakdown';
import { CustomerTypeSelector } from '@/components/booking/CustomerTypeSelector';
import { format } from 'date-fns';
import { nb } from 'date-fns/locale';

interface BookingSummaryStepProps {
  selectedSlots: SelectedTimeSlot[];
  facilityName: string;
  zones: Zone[];
  customerType: CustomerType;
  onCustomerTypeChange: (type: CustomerType) => void;
  purpose: string;
  onPurposeChange: (purpose: string) => void;
  calculation: any;
  totalPrice: number;
  onContinue: () => void;
}

export function BookingSummaryStep({
  selectedSlots,
  facilityName,
  zones,
  customerType,
  onCustomerTypeChange,
  purpose,
  onPurposeChange,
  calculation,
  totalPrice,
  onContinue
}: BookingSummaryStepProps) {
  const [activityType, setActivityType] = React.useState<string>('');
  
  // Helper function to get zone name from zoneId
  const getZoneName = (zoneId: string) => {
    const foundZone = zones.find((z: any) => z.id === zoneId);
    return foundZone ? foundZone.name : 'Ukjent sone';
  };

  // Group slots by zone for better display
  const slotsByZone = selectedSlots.reduce((acc, slot) => {
    const zoneName = getZoneName(slot.zoneId);
    if (!acc[zoneName]) {
      acc[zoneName] = [];
    }
    acc[zoneName].push(slot);
    return acc;
  }, {} as Record<string, SelectedTimeSlot[]>);

  // Validation
  const isValid = purpose.trim().length > 0 && activityType.length > 0;

  return (
    <>
      {/* Booking Summary */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Booking oversikt
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="font-medium text-lg flex items-center gap-2">
              <MapPin className="h-4 w-4 text-blue-600" />
              {facilityName}
            </p>
            <p className="text-base text-gray-600">{selectedSlots.length} tidspunkt valgt</p>
          </div>
          
          {/* Display slots grouped by zone */}
          <div className="space-y-3 max-h-40 overflow-auto">
            {Object.entries(slotsByZone).map(([zoneName, slots]) => (
              <div key={zoneName} className="border-l-2 border-blue-200 pl-3">
                <h5 className="text-base font-medium text-blue-900 mb-2">{zoneName}</h5>
                <div className="space-y-2">
                  {slots.slice(0, 3).map((slot, index) => (
                    <div key={index} className="flex items-center justify-between text-base">
                      <span>{format(slot.date, 'EEE dd.MM', { locale: nb })}</span>
                      <Badge variant="outline" className="text-sm">
                        {slot.timeSlot}
                      </Badge>
                    </div>
                  ))}
                  {slots.length > 3 && (
                    <p className="text-sm text-gray-500">
                      + {slots.length - 3} flere tidspunkt i denne sonen
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Customer Type Selection */}
      <Card>
        <CardContent className="p-4">
          <CustomerTypeSelector
            value={customerType}
            onChange={onCustomerTypeChange}
          />
        </CardContent>
      </Card>

      {/* Activity Type Selection */}
      <Card>
        <CardContent className="p-4 space-y-3">
          <Label className="text-base font-semibold text-gray-900 flex items-center gap-2">
            <Trophy className="h-5 w-5 text-slate-600" />
            Type aktivitet *
          </Label>
          <Select value={activityType} onValueChange={setActivityType}>
            <SelectTrigger className="h-11 border-gray-300 focus:border-slate-700">
              <SelectValue placeholder="Velg" />
            </SelectTrigger>
            <SelectContent className="bg-white border border-gray-200 shadow-lg z-50">
              <SelectItem value="velg">Velg</SelectItem>
              <SelectItem value="møter-foredrag">Møter, foredrag eller liknende</SelectItem>
              <SelectItem value="øving">Øving (kor, korps, teater eller liknende)</SelectItem>
              <SelectItem value="konsert-forestilling">Konsert eller forestilling</SelectItem>
              <SelectItem value="annen-aktivitet">Annen aktivitet - beskriv under</SelectItem>
            </SelectContent>
          </Select>
          {activityType.length === 0 && (
            <p className="text-sm text-red-600">Dette feltet er påkrevd</p>
          )}
        </CardContent>
      </Card>

      {/* Purpose Field */}
      <Card>
        <CardContent className="p-4 space-y-3">
          <Label className="text-base font-semibold text-gray-900 flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-slate-600" />
            Formål med bookingen *
          </Label>
          <Textarea
            value={purpose}
            onChange={(e) => onPurposeChange(e.target.value)}
            placeholder="Beskriv kort hva lokalet skal brukes til..."
            className="resize-none h-24 border-gray-300 focus:border-slate-700 text-base"
          />
          {purpose.trim().length === 0 && (
            <p className="text-sm text-red-600">Dette feltet er påkrevd</p>
          )}
        </CardContent>
      </Card>

      {/* Price Breakdown */}
      {calculation && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Leiepriser
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="text-sm text-blue-600 underline cursor-pointer">
                Se hvordan prisen er beregnet på dine dager
              </div>
              <PriceBreakdown calculation={calculation} />
              <div className="mt-3 pt-3 border-t">
                <div className="flex justify-between items-center">
                  <span className="text-base">Sum:</span>
                  <span className="text-xl font-medium text-blue-600">
                    {totalPrice === 0 ? '0*' : `${totalPrice}`} ,-
                  </span>
                </div>
                <div className="text-xs text-gray-600 mt-1">
                  * Prisen er et resultat av følgende prisfaktorer:
                </div>
                <div className="text-xs text-gray-600">
                  {customerType === 'nonprofit' ? 
                    '• Kommersielle aktører og private arrangement: Høyere pris' :
                    '• Ikke-kommersielle aktører: Standard pris'
                  }
                </div>
                {calculation?.breakdown?.some((item: any) => item.description.includes('torsdag')) && (
                  <div className="text-xs text-gray-600">
                    • Torsdag regnes timespris: {totalPrice} ,-
                  </div>
                )}
                <div className="text-xs text-gray-600">
                  • 0% MVA på booket tid
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Button 
        onClick={onContinue} 
        className="w-full text-lg py-6" 
        size="lg"
        disabled={!isValid}
      >
        Fortsett til kontaktdetaljer
      </Button>
    </>
  );
}
