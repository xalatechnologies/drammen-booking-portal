
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
  const {
    facilitiesWithZones,
    selectedSlots,
    isLoading,
    error,
    handleSlotClick,
    handleBulkSlotSelection,
    handleRemoveSlot,
    handleClearSlots,
    getAvailabilityStatus,
    isSlotSelected,
    displayFacility,
    allZones,
    navigate
  } = useCalendarView({
    date,
    facilityType,
    location,
    accessibility,
    capacity
  });

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
          selectedSlots={selectedSlots}
          onSlotClick={handleSlotClick}
          onBulkSlotSelection={handleBulkSlotSelection}
          onRemoveSlot={handleRemoveSlot}
          onClearSlots={handleClearSlots}
          onContinueBooking={() => navigate('/checkout')}
          getAvailabilityStatus={getAvailabilityStatus}
          isSlotSelected={isSlotSelected}
          timeSlotDuration={1}
          layout="horizontal"
          compact={false}
        />
      )}
    </div>
  );
};

export default CalendarView;
