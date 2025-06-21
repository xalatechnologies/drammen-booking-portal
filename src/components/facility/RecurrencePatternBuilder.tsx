
import React from 'react';
import { RecurrencePattern, SelectedTimeSlot } from '@/utils/recurrenceEngine';
import { RecurrenceWizard } from './recurrence/RecurrenceWizard';

interface RecurrencePatternBuilderProps {
  pattern: RecurrencePattern;
  onPatternChange: (pattern: RecurrencePattern) => void;
  onClose: () => void;
  onApply?: (pattern: RecurrencePattern) => void;
  selectedSlots?: SelectedTimeSlot[];
  facilityId?: string;
}

export function RecurrencePatternBuilder({ 
  pattern, 
  onPatternChange, 
  onClose, 
  onApply,
  selectedSlots,
  facilityId 
}: RecurrencePatternBuilderProps) {
  return (
    <RecurrenceWizard
      pattern={pattern}
      onPatternChange={onPatternChange}
      onClose={onClose}
      onApplyPattern={onApply}
    />
  );
}
