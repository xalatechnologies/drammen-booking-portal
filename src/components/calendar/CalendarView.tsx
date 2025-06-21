
import React from "react";
import { CalendarViewProps } from "./types";
import ViewHeader from "../search/ViewHeader";
import { CalendarWithBooking } from "../shared/CalendarWithBooking";
import { useCalendarView } from "@/hooks/useCalendarView";
import { CalendarLoadingState } from "./components/CalendarLoadingState";
import { CalendarErrorState } from "./components/CalendarErrorState";
import { CalendarEmptyState } from "./components/CalendarEmptyState";

interface CalendarViewWithToggleProps extends CalendarViewProps {
  viewMode: "grid" | "map" | "calendar" | "list";
  setViewMode: (mode: "grid" | "map" | "calendar" | "list") => void;
}

const CalendarView: React.FC<CalendarViewWithToggleProps> = ({
  date,
  facilityType,
  location,
  accessibility,
  capacity,
  viewMode,
  setViewMode,
}) => {
  // Fix the capacity type issue by ensuring it's properly typed as a tuple
  const capacityRange: [number, number] | undefined = capacity && Array.isArray(capacity) && capacity.length === 2 
    ? [capacity[0], capacity[1]] 
    : undefined;

  const {
    facilitiesWithZones,
    isLoading,
    error,
    getAvailabilityStatus,
    displayFacility,
    allZones,
    navigate
  } = useCalendarView({
    date,
    facilityType,
    location,
    accessibility,
    capacity: capacityRange
  });

  // Simplified slot handling - no state management, just direct cart operations
  const handleSlotClick = (zoneId: string, date: Date, timeSlot: string, availability: string) => {
    console.log('CalendarView: Slot clicked, but not storing in state');
    // Direct booking flow would go here
  };

  const handleBulkSlotSelection = (slots: any[]) => {
    console.log('CalendarView: Bulk selection, but not storing in state');
    // Direct booking flow would go here
  };

  const handleAddToCart = (bookingData: any) => {
    console.log('CalendarView: Adding to cart:', bookingData);
    // Cart operations happen here
  };

  if (isLoading) {
    return <CalendarLoadingState viewMode={viewMode} setViewMode={setViewMode} />;
  }

  if (error) {
    return <CalendarErrorState viewMode={viewMode} setViewMode={setViewMode} />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 my-[12px]">
      <ViewHeader 
        facilityCount={facilitiesWithZones.length}
        isLoading={isLoading}
        viewMode={viewMode}
        setViewMode={setViewMode}
      />

      {facilitiesWithZones.length === 0 ? (
        <CalendarEmptyState />
      ) : (
        <CalendarWithBooking
          facilityName={displayFacility?.name || 'Alle lokaler'}
          facilityId={'all'}
          zones={allZones}
          selectedSlots={[]} // No selected slots state
          onSlotClick={handleSlotClick}
          onBulkSlotSelection={handleBulkSlotSelection}
          onRemoveSlot={() => {}} // No removal needed
          onClearSlots={() => {}} // No clearing needed
          onAddToCart={handleAddToCart}
          getAvailabilityStatus={getAvailabilityStatus}
          isSlotSelected={() => false} // Never selected
          timeSlotDuration={1}
          layout="horizontal"
          compact={false}
        />
      )}
    </div>
  );
};

export default CalendarView;
