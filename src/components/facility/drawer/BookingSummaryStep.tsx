
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

  // Validation
  const isValid = purpose.trim().length > 0 && activityType.length > 0 && attendees > 0;
  
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

      <Button 
        onClick={onContinue} 
        className="w-full text-lg py-6" 
        size="lg" 
        disabled={!isValid}
      >
        {requiresApproval ? t('forms.buttons.submitForApproval') : t('forms.buttons.continueToContact')}
      </Button>
    </>
  );
}
