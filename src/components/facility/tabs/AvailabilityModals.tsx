
import React from "react";
import { RecurrencePatternBuilder } from "../RecurrencePatternBuilder";
import { ConflictResolutionWizard } from "../ConflictResolutionWizard";
import { RecurrencePattern, SelectedTimeSlot } from "@/utils/recurrenceEngine";

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
  onPatternApply: () => void;
}

export function AvailabilityModals({
  showPatternBuilder,
  showConflictWizard,
  currentPattern,
  conflictResolutionData,
  selectedSlots,
  facilityId,
  facilityName,
  onPatternBuilderClose,
  onConflictWizardClose,
  onPatternChange,
  onPatternApply
}: AvailabilityModalsProps) {
  return (
    <>
      {/* Pattern Builder Modal */}
      <RecurrencePatternBuilder
        isOpen={showPatternBuilder}
        onClose={onPatternBuilderClose}
        pattern={currentPattern}
        onPatternChange={onPatternChange}
        onApply={onPatternApply}
      />

      {/* Conflict Resolution Wizard */}
      {showConflictWizard && conflictResolutionData && (
        <ConflictResolutionWizard
          isOpen={showConflictWizard}
          onClose={onConflictWizardClose}
          conflictData={conflictResolutionData}
          onResolve={(resolution) => {
            console.log('Conflict resolved:', resolution);
            onConflictWizardClose();
          }}
        />
      )}
    </>
  );
}
