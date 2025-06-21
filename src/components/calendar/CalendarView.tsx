
import React from "react";
import { CalendarViewProps } from "./types";
import ViewHeader from "../search/ViewHeader";
import { useCalendarView } from "@/hooks/useCalendarView";
import { CalendarLoadingState } from "./components/CalendarLoadingState";
import { CalendarErrorState } from "./components/CalendarErrorState";
import { CalendarEmptyState } from "./components/CalendarEmptyState";
import { useSlotSelection } from "@/hooks/useSlotSelection";
import { useCartStore } from "@/stores/useCartStore";
import { AvailabilityTab } from "@/components/facility/tabs/AvailabilityTab";

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

  // Use slot selection hook for managing selected slots
  const {
    selectedSlots,
    handleSlotClick,
    handleBulkSlotSelection,
    clearSelection
  } = useSlotSelection();

  // Cart store for handling bookings
  const { addToCart } = useCartStore();

  const handleRemoveSlot = (zoneId: string, date: Date, timeSlot: string) => {
    handleSlotClick(zoneId, date, timeSlot, 'available');
  };

  const handleAddToCart = (bookingData: any) => {
    console.log('CalendarView: Adding to cart:', bookingData);
    
    // Convert booking data to cart format
    if (bookingData.selectedSlots && bookingData.selectedSlots.length > 0) {
      const slot = bookingData.selectedSlots[0]; // Take first slot for cart item
      const zone = allZones.find(z => z.id === slot.zoneId);
      
      addToCart({
        facilityId: bookingData.facilityId || 'all',
        facilityName: bookingData.facilityName || 'Alle lokaler',
        date: slot.date,
        timeSlot: slot.timeSlot,
        zoneId: slot.zoneId,
        duration: slot.duration || 1,
        pricePerHour: zone?.pricePerHour || 450,
        purpose: bookingData.formData?.purpose || 'Booking fra kalender',
        expectedAttendees: bookingData.formData?.attendees || 1,
        organizationType: bookingData.formData?.actorType || 'private',
        eventType: bookingData.formData?.activityType || 'other',
        specialRequirements: bookingData.formData?.additionalInfo || '',
        timeSlots: bookingData.selectedSlots,
        additionalServices: []
      });
      
      // Clear selection after adding to cart
      clearSelection();
    }
  };

  const handleCompleteBooking = (bookingData: any) => {
    console.log('CalendarView: Complete booking:', bookingData);
    // Navigate to checkout or booking flow
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
        <AvailabilityTab
          zones={allZones}
          selectedSlots={selectedSlots}
          onSlotClick={handleSlotClick}
          onBulkSlotSelection={handleBulkSlotSelection}
          onClearSlots={clearSelection}
          onRemoveSlot={handleRemoveSlot}
          facilityId={'all'}
          facilityName={displayFacility?.name || 'Alle lokaler'}
          timeSlotDuration={1}
        />
      )}
    </div>
  );
};

export default CalendarView;
