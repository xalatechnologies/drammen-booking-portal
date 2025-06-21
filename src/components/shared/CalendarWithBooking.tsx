
import React from "react";
import { Zone } from "@/components/booking/types";
import { SelectedTimeSlot } from "@/utils/recurrenceEngine";
import { ReusableCalendar } from "./ReusableCalendar";
import { ReusableBookingSidebar } from "./ReusableBookingSidebar";

interface CalendarWithBookingProps {
  facilityName: string;
  facilityId: string;
  zones: Zone[];
  selectedSlots: SelectedTimeSlot[];
  onSlotClick: (zoneId: string, date: Date, timeSlot: string, availability: string) => void;
  onBulkSlotSelection?: (slots: SelectedTimeSlot[]) => void;
  onRemoveSlot: (zoneId: string, date: Date, timeSlot: string) => void;
  onClearSlots: () => void;
  onContinueBooking?: () => void;
  getAvailabilityStatus: (zoneId: string, date: Date, timeSlot: string) => { status: string; conflict: any };
  isSlotSelected: (zoneId: string, date: Date, timeSlot: string) => boolean;
  timeSlotDuration?: number;
  layout?: 'horizontal' | 'vertical';
  compact?: boolean;
}

export const CalendarWithBooking: React.FC<CalendarWithBookingProps> = ({
  facilityName,
  facilityId,
  zones,
  selectedSlots,
  onSlotClick,
  onBulkSlotSelection,
  onRemoveSlot,
  onClearSlots,
  onContinueBooking,
  getAvailabilityStatus,
  isSlotSelected,
  timeSlotDuration = 1,
  layout = 'horizontal',
  compact = false
}) => {
  const isHorizontal = layout === 'horizontal';

  return (
    <div className={`${isHorizontal ? 'grid grid-cols-1 lg:grid-cols-3 gap-6' : 'space-y-6'} ${compact ? 'max-w-6xl mx-auto' : 'w-full'}`}>
      {/* Calendar Section */}
      <div className={isHorizontal ? 'lg:col-span-2' : 'w-full'}>
        <ReusableCalendar
          zones={zones}
          selectedSlots={selectedSlots}
          onSlotClick={onSlotClick}
          onBulkSlotSelection={onBulkSlotSelection}
          getAvailabilityStatus={getAvailabilityStatus}
          isSlotSelected={isSlotSelected}
          timeSlotDuration={timeSlotDuration}
          compact={compact}
        />
      </div>

      {/* Booking Sidebar */}
      <div className={isHorizontal ? 'lg:col-span-1' : 'w-full'}>
        <div className={isHorizontal ? 'sticky top-6' : ''}>
          <ReusableBookingSidebar
            facilityName={facilityName}
            facilityId={facilityId}
            zones={zones}
            selectedSlots={selectedSlots}
            onRemoveSlot={onRemoveSlot}
            onClearSlots={onClearSlots}
            onContinueBooking={onContinueBooking}
            compact={compact}
          />
        </div>
      </div>
    </div>
  );
};
