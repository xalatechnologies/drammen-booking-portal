
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
              <SelectValue placeholder="Velg type aktivitet" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sport">Sport og trening</SelectItem>
              <SelectItem value="meeting">Møte og konferanse</SelectItem>
              <SelectItem value="course">Kurs og utdanning</SelectItem>
              <SelectItem value="cultural">Kulturell aktivitet</SelectItem>
              <SelectItem value="celebration">Fest og feiring</SelectItem>
              <SelectItem value="exhibition">Utstilling</SelectItem>
              <SelectItem value="competition">Konkurranse og turnering</SelectItem>
              <SelectItem value="other">Annet</SelectItem>
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
            Formål med reservasjonen *
          </Label>
          <Textarea
            value={purpose}
            onChange={(e) => onPurposeChange(e.target.value)}
            placeholder="Beskriv kort hva lokalet skal brukes til (f.eks. fotballtrening, møte, arrangement)..."
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
              Prising
            </CardTitle>
          </CardHeader>
          <CardContent>
            <PriceBreakdown calculation={calculation} />
            <div className="mt-3 pt-3 border-t">
              <div className="flex justify-between items-center font-medium text-lg">
                <span>Total ({selectedSlots.length} tidspunkt):</span>
                <span className="text-xl text-blue-600">
                  {totalPrice === 0 ? 'GRATIS' : `${totalPrice} kr`}
                </span>
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
