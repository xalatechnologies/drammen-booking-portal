
import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { SelectedTimeSlot } from '@/utils/recurrenceEngine';
import { Zone } from '@/components/booking/types';
import { BookingOverviewCard } from './BookingOverviewCard';
import { ActivityDetailsForm } from './ActivityDetailsForm';
import { PurposeForm } from './PurposeForm';
import { useTranslation } from '@/i18n/hooks/useTranslation';

interface BookingActivityStepProps {
  selectedSlots: SelectedTimeSlot[];
  facilityName: string;
  zones: Zone[];
  activityType: string;
  onActivityTypeChange: (type: string) => void;
  attendees: number;
  onAttendeesChange: (count: number) => void;
  purpose: string;
  onPurposeChange: (purpose: string) => void;
  onNext: () => void;
}

export function BookingActivityStep({
  selectedSlots,
  facilityName,
  zones,
  activityType,
  onActivityTypeChange,
  attendees,
  onAttendeesChange,
  purpose,
  onPurposeChange,
  onNext
}: BookingActivityStepProps) {
  const { t } = useTranslation();

  // Validation - ensure we have selected slots and required form data
  const isValid = selectedSlots.length > 0 && purpose.trim().length > 0 && activityType.length > 0 && attendees > 0;
  
  console.log('BookingActivityStep - Selected slots:', selectedSlots);
  console.log('BookingActivityStep - Validation state:', { isValid, slotsCount: selectedSlots.length, purpose, activityType, attendees });

  return (
    <>
      <BookingOverviewCard selectedSlots={selectedSlots} facilityName={facilityName} zones={zones} />

      <ActivityDetailsForm 
        activityType={activityType} 
        onActivityTypeChange={onActivityTypeChange} 
        attendees={attendees} 
        onAttendeesChange={onAttendeesChange} 
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
        onClick={onNext} 
        className="w-full text-lg py-6" 
        size="lg" 
        disabled={!isValid}
      >
        {t('forms.buttons.nextStep', {}, 'Neste steg')}
      </Button>
    </>
  );
}
