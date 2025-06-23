
import React from "react";
import { CalendarViewProps } from "./types";
import ViewHeader from "../search/ViewHeader";
import { useCalendarView } from "@/hooks/useCalendarView";
import { CalendarLoadingState } from "./components/CalendarLoadingState";
import { CalendarErrorState } from "./components/CalendarErrorState";
import { CalendarEmptyState } from "./components/CalendarEmptyState";
import { useSlotSelection } from "@/hooks/useSlotSelection";
import { useCalendarCart } from "@/hooks/useCalendarCart";
import { Accordion } from "@/components/ui/accordion";
import { FacilityAccordionContent } from "./FacilityAccordionContent";

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
  const capacityRange: [number, number] | undefined = capacity && Array.isArray(capacity) && capacity.length === 2 
    ? [capacity[0], capacity[1]] 
    : undefined;

  const {
    facilitiesWithZones,
    isLoading,
    error,
    allZones,
    navigate
  } = useCalendarView({
    date,
    facilityType,
    location,
    accessibility,
    capacity: capacityRange
  });

  const {
    selectedSlots,
    handleSlotClick,
    handleBulkSlotSelection,
    clearSelection
  } = useSlotSelection();

  const { handleAddToCart } = useCalendarCart();

  const handleRemoveSlot = (zoneId: string, date: Date, timeSlot: string) => {
    handleSlotClick(zoneId, date, timeSlot, 'available');
  };

  const handleCartAdd = (bookingData: any) => {
    handleAddToCart(bookingData, allZones, clearSelection);
  };

  const handleCompleteBooking = (bookingData: any) => {
    console.log('CalendarView: Complete booking:', bookingData);
    navigate('/checkout');
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
        <Accordion 
          type="multiple" 
          defaultValue={[`facility-${facilitiesWithZones[0]?.id}`]} 
          className="w-full space-y-4"
        >
          {facilitiesWithZones.map((facility) => (
            <FacilityAccordionContent
              key={facility.id}
              facility={facility}
              selectedSlots={selectedSlots}
              onSlotClick={handleSlotClick}
              onBulkSlotSelection={handleBulkSlotSelection}
              onClearSlots={clearSelection}
              onRemoveSlot={handleRemoveSlot}
            />
          ))}
        </Accordion>
      )}
    </div>
  );
};

export default CalendarView;
