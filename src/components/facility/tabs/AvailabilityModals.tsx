
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { RecurrencePatternBuilder } from '../RecurrencePatternBuilder';
import { ConflictResolutionWizard } from '../ConflictResolutionWizard';
import { SelectedTimeSlot, RecurrencePattern } from '@/utils/recurrenceEngine';

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
      {showPatternBuilder && (
        <Dialog open={showPatternBuilder} onOpenChange={onPatternBuilderClose}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Opprett gjentakende booking</DialogTitle>
            </DialogHeader>
            <RecurrencePatternBuilder
              pattern={currentPattern}
              onPatternChange={onPatternChange}
              onApply={onPatternApply}
              onCancel={onPatternBuilderClose}
              selectedSlots={selectedSlots}
              facilityId={facilityId}
            />
          </DialogContent>
        </Dialog>
      )}

      {/* Conflict Resolution Wizard */}
      {showConflictWizard && conflictResolutionData && (
        <Dialog open={showConflictWizard} onOpenChange={onConflictWizardClose}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Løs booking konflikter</DialogTitle>
            </DialogHeader>
            <ConflictResolutionWizard
              conflictData={conflictResolutionData}
              onResolve={onConflictWizardClose}
              onCancel={onConflictWizardClose}
            />
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
