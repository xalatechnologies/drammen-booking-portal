
import React from "react";
import { CalendarViewProps } from "./types";
import ViewHeader from "../search/ViewHeader";
import { useCalendarView } from "@/hooks/useCalendarView";
import { CalendarLoadingState } from "./components/CalendarLoadingState";
import { CalendarErrorState } from "./components/CalendarErrorState";
import { CalendarEmptyState } from "./components/CalendarEmptyState";
import { useSlotSelection } from "@/hooks/useSlotSelection";
import { useCartStore } from "@/stores/useCartStore";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
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
      const totalPrice = (zone?.pricePerHour || 450) * (slot.duration || 1);
      
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
        additionalServices: [],
        pricing: {
          baseFacilityPrice: totalPrice,
          servicesPrice: 0,
          discounts: 0,
          vatAmount: 0,
          totalPrice: totalPrice
        }
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
        <Accordion 
          type="multiple" 
          defaultValue={[`facility-${facilitiesWithZones[0]?.id}`]} 
          className="w-full space-y-4"
        >
          {facilitiesWithZones.map((facility) => (
            <AccordionItem 
              key={facility.id} 
              value={`facility-${facility.id}`}
              className="border rounded-lg bg-white shadow-sm"
            >
              <AccordionTrigger className="px-6 py-4 hover:no-underline">
                <div className="flex items-center justify-between w-full pr-4">
                  <div className="text-left">
                    <h3 className="text-xl font-semibold text-gray-900">{facility.name}</h3>
                    <p className="text-gray-600 mt-1">{facility.address}</p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                      <span>Kapasitet: {facility.capacity} personer</span>
                      <span>{facility.zones.length} soner tilgjengelig</span>
                    </div>
                  </div>
                </div>
              </AccordionTrigger>
              
              <AccordionContent className="px-6 pb-6">
                <AvailabilityTab
                  zones={facility.zones.map(zone => ({
                    id: zone.id,
                    name: zone.name,
                    capacity: zone.capacity,
                    pricePerHour: zone.pricePerHour,
                    description: zone.description,
                    area: "120 m²",
                    equipment: [],
                    accessibility: [],
                    images: [],
                    facilityId: facility.id.toString(),
                    isMainZone: true,
                    subZones: [],
                    amenities: [],
                    features: [],
                    bookingRules: {
                      minBookingDuration: 1,
                      maxBookingDuration: 8,
                      allowedTimeSlots: [],
                      bookingTypes: ['one-time', 'recurring', 'fixed-lease'],
                      advanceBookingDays: 90,
                      cancellationHours: 24
                    },
                    adminInfo: {
                      contactPersonName: "Facility Manager",
                      contactPersonEmail: "manager@facility.no",
                      specialInstructions: "",
                      maintenanceSchedule: []
                    },
                    layout: {
                      coordinates: {
                        x: 0,
                        y: 0,
                        width: 100,
                        height: 100
                      },
                      entryPoints: ["Hovedinngang"]
                    },
                    isActive: true
                  }))}
                  selectedSlots={selectedSlots.filter(slot => 
                    facility.zones.some(zone => zone.id === slot.zoneId)
                  )}
                  onSlotClick={handleSlotClick}
                  onBulkSlotSelection={handleBulkSlotSelection}
                  onClearSlots={clearSelection}
                  onRemoveSlot={handleRemoveSlot}
                  facilityId={facility.id.toString()}
                  facilityName={facility.name}
                  timeSlotDuration={1}
                />
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </div>
  );
};

export default CalendarView;
