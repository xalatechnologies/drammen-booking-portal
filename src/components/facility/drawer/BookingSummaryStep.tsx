
import React from 'react';
import { Calendar, CreditCard, MapPin, MessageSquare, Trophy, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SelectedTimeSlot } from '@/utils/recurrenceEngine';
import { ActorType, BookingType } from '@/types/pricing';
import { Zone } from '@/components/booking/types';
import { PriceBreakdown } from '@/components/booking/PriceBreakdown';
import { EnhancedCustomerTypeSelector } from '@/components/booking/EnhancedCustomerTypeSelector';
import { BookingTypeSelector } from '@/components/booking/BookingTypeSelector';
import { format } from 'date-fns';
import { nb } from 'date-fns/locale';

interface BookingSummaryStepProps {
  selectedSlots: SelectedTimeSlot[];
  facilityName: string;
  zones: Zone[];
  actorType: ActorType;
  onActorTypeChange: (type: ActorType) => void;
  bookingType: BookingType;
  onBookingTypeChange: (type: BookingType) => void;
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
  actorType,
  onActorTypeChange,
  bookingType,
  onBookingTypeChange,
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

  // Check if booking requires approval
  const requiresApproval = calculation?.requiresApproval || 
    ['lag-foreninger', 'paraply'].includes(actorType);

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

      {/* Actor Type Selection */}
      <Card>
        <CardContent className="p-4">
          <EnhancedCustomerTypeSelector
            value={actorType}
            onChange={onActorTypeChange}
          />
        </CardContent>
      </Card>

      {/* Booking Type Selection */}
      <Card>
        <CardContent className="p-4">
          <BookingTypeSelector
            value={bookingType}
            onChange={onBookingTypeChange}
          />
        </CardContent>
      </Card>

      {/* Approval Notice */}
      {requiresApproval && (
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-amber-900">Krever godkjenning</h4>
                <p className="text-sm text-amber-700">
                  Denne bookingen krever godkjenning fra kommunen på grunn av aktørtype eller spesielle betingelser. 
                  Du vil motta en bekreftelse når bookingen er behandlet.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

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
                
                {/* Enhanced pricing factors display */}
                <div className="text-xs text-gray-600 mt-2 space-y-1">
                  <div>* Prisen er et resultat av følgende faktorer:</div>
                  <div>• Aktørtype: {actorType === 'lag-foreninger' ? 'Lag og foreninger (gratis/redusert)' :
                                     actorType === 'paraply' ? 'Paraplyorganisasjon (spesiell rabatt)' :
                                     actorType === 'private-firma' ? 'Privat firma (full pris)' :
                                     actorType === 'kommunale-enheter' ? 'Kommunal enhet (redusert pris)' :
                                     'Privatperson (standard pris)'}</div>
                  <div>• Bookingtype: {bookingType === 'fastlan' ? 'Fastlån (kan gi rabatt)' : 'Engangslån'}</div>
                  {calculation?.breakdown?.some((item: any) => item.description.includes('Kveld')) && (
                    <div>• Kveldsleie: Tillegg for kveldstimer</div>
                  )}
                  {calculation?.breakdown?.some((item: any) => item.description.includes('helg')) && (
                    <div>• Helgetillegg: Ekstra kostnad for helger</div>
                  )}
                  <div>• 0% MVA på booket tid</div>
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
        {requiresApproval ? 'Send inn til godkjenning' : 'Fortsett til kontaktdetaljer'}
      </Button>
    </>
  );
}
