
import React from 'react';
import { RecurrencePattern } from '@/utils/recurrenceEngine';
import { RecurrenceWizard } from './recurrence/RecurrenceWizard';

interface RecurrencePatternBuilderProps {
  pattern: RecurrencePattern;
  onPatternChange: (pattern: RecurrencePattern) => void;
  onClose: () => void;
  onApplyPattern?: (pattern: RecurrencePattern) => void;
}

export function RecurrencePatternBuilder({ pattern, onPatternChange, onClose, onApplyPattern }: RecurrencePatternBuilderProps) {
  return (
    <RecurrenceWizard
      pattern={pattern}
      onPatternChange={onPatternChange}
      onClose={onClose}
      onApplyPattern={onApplyPattern}
    />
  );
}
