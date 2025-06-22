import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { SelectedTimeSlot } from '@/utils/recurrenceEngine';
import { Zone } from '@/features/facility/types/facility';
import { BookingOverviewCard } from '../shared/BookingOverviewCard';
import { ActivityDetailsForm } from '../shared/ActivityDetailsForm';
import { PurposeForm } from '../shared/PurposeForm';
import { useLocalization } from '@/core/localization/hooks/useLocalization';

/**
 * BookingActivityStep Props Interface
 * Following Interface Segregation Principle with focused props interface
 */
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

/**
 * BookingActivityStep Component
 * 
 * Responsible for capturing activity-related information during the booking process
 * Following Single Responsibility Principle by focusing only on activity information collection
 */
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
  const { translate } = useLocalization();

  // Validation - ensure we have selected slots and required form data
  const isValid = selectedSlots.length > 0 && purpose.trim().length > 0 && activityType.length > 0 && attendees > 0;

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
                {translate('booking.selectTimeSlotsFirst')}
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
        {translate('common.nextStep')}
      </Button>
    </>
  );
}
