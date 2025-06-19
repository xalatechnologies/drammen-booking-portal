
import React from 'react';
import { RecurrencePatternBuilder } from '@/components/facility/RecurrencePatternBuilder';
import { ConflictResolutionWizard } from '@/components/facility/ConflictResolutionWizard';
import { BookingDrawer } from '@/components/facility/BookingDrawer';
import { RecurrencePattern, SelectedTimeSlot } from '@/utils/recurrenceEngine';

interface AvailabilityModalsProps {
  showPatternBuilder: boolean;
  showConflictWizard: boolean;
  showBookingDrawer: boolean;
  currentPattern: RecurrencePattern;
  conflictResolutionData: any;
  selectedSlots: SelectedTimeSlot[];
  facilityId: string;
  facilityName: string;
  onPatternBuilderClose: () => void;
  onConflictWizardClose: () => void;
  onBookingDrawerClose: () => void;
  onPatternChange: (pattern: RecurrencePattern) => void;
  onPatternApply: (pattern: RecurrencePattern) => void;
}

export function AvailabilityModals({
  showPatternBuilder,
  showConflictWizard,
  showBookingDrawer,
  currentPattern,
  conflictResolutionData,
  selectedSlots,
  facilityId,
  facilityName,
  onPatternBuilderClose,
  onConflictWizardClose,
  onBookingDrawerClose,
  onPatternChange,
  onPatternApply,
}: AvailabilityModalsProps) {
  return (
    <>
      {/* Pattern Builder Modal */}
      {showPatternBuilder && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <RecurrencePatternBuilder
            pattern={currentPattern}
            onPatternChange={onPatternChange}
            onClose={onPatternBuilderClose}
            onApplyPattern={onPatternApply}
          />
        </div>
      )}

      {/* Conflict Resolution Wizard */}
      {showConflictWizard && conflictResolutionData && (
        <ConflictResolutionWizard
          isOpen={showConflictWizard}
          onClose={onConflictWizardClose}
          conflictedDates={conflictResolutionData.conflictedDates}
          availableDates={conflictResolutionData.availableDates}
          alternativeTimeSlots={conflictResolutionData.alternativeTimeSlots}
          suggestedZones={conflictResolutionData.suggestedZones}
          originalZone={conflictResolutionData.originalZone}
          originalTimeSlot={conflictResolutionData.originalTimeSlot}
          onResolutionSelect={onConflictWizardClose}
        />
      )}

      {/* Booking Drawer */}
      <BookingDrawer
        isOpen={showBookingDrawer}
        onClose={onBookingDrawerClose}
        selectedSlots={selectedSlots}
        facilityId={facilityId}
        facilityName={facilityName}
      />
    </>
  );
}
