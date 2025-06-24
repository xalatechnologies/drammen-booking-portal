import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { SelectedTimeSlot } from '@/utils/recurrenceEngine';
import { ActorType, BookingType } from '@/types/pricing';
import { Zone } from '@/components/booking/types';
import { BookingOverviewCard } from './BookingOverviewCard';
import { CustomerTypeSection } from './CustomerTypeSection';
import { ActivityDetailsForm } from './ActivityDetailsForm';
import { PurposeForm } from './PurposeForm';
import { IntegratedPriceCalculation } from '@/components/booking/IntegratedPriceCalculation';
import { useTranslation } from '@/i18n/hooks/useTranslation';

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

// This component is now replaced by BookingActivityStep and BookingPricingStep
// but keeping it for compatibility until all references are updated
export function BookingSummaryStep({
  selectedSlots,
  facilityName,
  zones,
  actorType,
  onActorTypeChange,
  bookingType,
  purpose,
  onPurposeChange,
  onContinue
}: BookingSummaryStepProps) {
  const { t } = useTranslation();
  const [activityType, setActivityType] = React.useState<string>('');
  const [attendees, setAttendees] = React.useState<number>(1);

  // Check if booking requires approval
  const requiresApproval = ['lag-foreninger', 'paraply'].includes(actorType);

  // Validation - ensure we have selected slots and required form data
  const isValid = selectedSlots.length > 0 && purpose.trim().length > 0 && activityType.length > 0 && attendees > 0;
  
  console.log('BookingSummaryStep - Selected slots:', selectedSlots);
  console.log('BookingSummaryStep - Validation state:', { isValid, slotsCount: selectedSlots.length, purpose, activityType, attendees });

  return (
    <>
      <BookingOverviewCard selectedSlots={selectedSlots} facilityName={facilityName} zones={zones} />

      <CustomerTypeSection value={actorType} onChange={onActorTypeChange} />

      {/* Integrated Price Calculation - positioned prominently after actor type */}
      <IntegratedPriceCalculation 
        selectedSlots={selectedSlots} 
        facilityId="1" // TODO: Get from props or context
        actorType={actorType} 
        bookingType={bookingType} 
      />

      <ActivityDetailsForm 
        activityType={activityType} 
        onActivityTypeChange={setActivityType} 
        attendees={attendees} 
        onAttendeesChange={setAttendees} 
      />

      <PurposeForm purpose={purpose} onPurposeChange={onPurposeChange} />

      {/* Show validation message if slots are missing */}
      {selectedSlots.length === 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-orange-800">
              <AlertTriangle className="h-5 w-5" />
              <p className="text-sm font-medium">
                Velg tidspunkt i kalenderen først for å fortsette med booking.
              </p>
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
        {requiresApproval ? t('forms.buttons.submitForApproval', {}, 'Send til godkjenning') : t('forms.buttons.continueToContact', {}, 'Fortsett til kontaktinfo')}
      </Button>
    </>
  );
}
