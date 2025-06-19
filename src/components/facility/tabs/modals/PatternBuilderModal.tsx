
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { RecurrencePattern } from '@/utils/recurrenceEngine';
import { RecurrencePatternBuilder } from '../../RecurrencePatternBuilder';

interface PatternBuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPattern: RecurrencePattern;
  setCurrentPattern: (pattern: RecurrencePattern) => void;
}

export function PatternBuilderModal({
  isOpen,
  onClose,
  currentPattern,
  setCurrentPattern
}: PatternBuilderModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Opprett gjentagende booking</DialogTitle>
        </DialogHeader>
        <RecurrencePatternBuilder
          pattern={currentPattern}
          onPatternChange={setCurrentPattern}
          onClose={onClose}
        />
      </DialogContent>
    </Dialog>
  );
}
