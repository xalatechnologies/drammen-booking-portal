import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog';
import { RecurringBookingForm } from './RecurringBookingForm';
import { RecurrencePattern } from '@/utils/recurrenceEngine';

interface RecurringBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyPattern: (pattern: RecurrencePattern) => void;
}

export function RecurringBookingModal({
  isOpen,
  onClose,
  onApplyPattern
}: RecurringBookingModalProps) {
  const [pattern, setPattern] = useState<RecurrencePattern>({
    type: 'weekly',
    weekdays: [],
    timeSlots: [],
    interval: 1
  });

  const handleApply = () => {
    onApplyPattern(pattern);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto p-0">
        <DialogHeader className="p-6 border-b">
          <DialogTitle className="text-2xl font-bold">Gjentakende reservasjon</DialogTitle>
          <DialogDescription>
            Opprett et mønster for gjentakende reservasjoner
          </DialogDescription>
        </DialogHeader>
        
        <RecurringBookingForm
          pattern={pattern}
          onPatternChange={setPattern}
          onApply={handleApply}
          onCancel={onClose}
        />
      </DialogContent>
    </Dialog>
  );
}