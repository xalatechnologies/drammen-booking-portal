
import React from 'react';
import { SelectedTimeSlot } from '@/utils/recurrenceEngine';
import { BookingDrawerHeader } from './drawer/BookingDrawerHeader';
import { BookingDrawerContent } from './drawer/BookingDrawerContent';

interface BookingDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedSlots: SelectedTimeSlot[];
  facilityId: string;
  facilityName: string;
}

export function BookingDrawer({ isOpen, onClose, selectedSlots, facilityId, facilityName }: BookingDrawerProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end md:items-center md:justify-end">
      <div className="bg-white w-full md:w-96 md:h-full md:max-h-screen overflow-auto rounded-t-lg md:rounded-none shadow-xl font-inter text-base">
        <BookingDrawerHeader onClose={onClose} />
        <BookingDrawerContent
          selectedSlots={selectedSlots}
          facilityId={facilityId}
          facilityName={facilityName}
        />
      </div>
    </div>
  );
}
