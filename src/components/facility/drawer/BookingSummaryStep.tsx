
import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { SelectedTimeSlot } from '@/utils/recurrenceEngine';
import { ActorType, BookingType } from '@/types/pricing';
import { Zone } from '@/components/booking/types';
import { PriceBreakdown } from '@/components/booking/PriceBreakdown';
import { BookingOverviewCard } from './BookingOverviewCard';
import { CustomerTypeSection } from './CustomerTypeSection';
import { BookingTypeSection } from './BookingTypeSection';
import { ActivityDetailsForm } from './ActivityDetailsForm';
import { PurposeForm } from './PurposeForm';

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
  const [attendees, setAttendees] = React.useState<number>(1);
  
  // Check if booking requires approval
  const requiresApproval = calculation?.requiresApproval || 
    ['lag-foreninger', 'paraply'].includes(actorType);

  // Validation
  const isValid = purpose.trim().length > 0 && activityType.length > 0 && attendees > 0;

  return (
    <>
      <BookingOverviewCard
        selectedSlots={selectedSlots}
        facilityName={facilityName}
        zones={zones}
      />

      <CustomerTypeSection
        value={actorType}
        onChange={onActorTypeChange}
      />

      <BookingTypeSection
        value={bookingType}
        onChange={onBookingTypeChange}
      />

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

      <ActivityDetailsForm
        activityType={activityType}
        onActivityTypeChange={setActivityType}
        attendees={attendees}
        onAttendeesChange={setAttendees}
      />

      <PurposeForm
        purpose={purpose}
        onPurposeChange={onPurposeChange}
      />

      {/* Price Breakdown */}
      {calculation && (
        <Card>
          <CardContent className="p-4">
            <PriceBreakdown calculation={calculation} />
            <div className="mt-3 pt-3 border-t">
              <div className="flex justify-between items-center">
                <span className="text-base">Sum:</span>
                <span className="text-xl font-medium text-blue-600">
                  {totalPrice === 0 ? '0*' : `${totalPrice}`} ,-
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
        {requiresApproval ? 'Send inn til godkjenning' : 'Fortsett til kontaktdetaljer'}
      </Button>
    </>
  );
}
