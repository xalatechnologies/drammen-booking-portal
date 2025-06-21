import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import { CalendarViewProps } from "./types";
import { useFacilities } from "@/hooks/useFacilities";
import { FacilityFilters } from "@/types/facility";
import ViewHeader from "../search/ViewHeader";
import { useCart } from "@/contexts/CartContext";
import { useNavigate } from "react-router-dom";
import { CalendarWithBooking } from "../shared/CalendarWithBooking";
import { useSlotSelection } from "@/hooks/useSlotSelection";

interface CalendarViewWithToggleProps extends CalendarViewProps {
  viewMode: "grid" | "map" | "calendar" | "list";
  setViewMode: (mode: "grid" | "map" | "calendar" | "list") => void;
}

// Create a stable hash for consistent availability
const createStableHash = (zoneId: string, date: Date, timeSlot: string): number => {
  const str = `${zoneId}-${date.toDateString()}-${timeSlot}`;
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
};

const CalendarView: React.FC<CalendarViewWithToggleProps> = ({
  date,
  facilityType,
  location,
  accessibility,
  capacity,
  viewMode,
  setViewMode,
}) => {
  const [selectedFacilityId, setSelectedFacilityId] = useState<string | null>(null);
  const { addToCart } = useCart();
  const navigate = useNavigate();
  
  // Use the centralized slot selection hook
  const {
    selectedSlots,
    handleSlotClick,
    handleBulkSlotSelection,
    clearSelection
  } = useSlotSelection();
  
  // Create filters from props
  const filters: FacilityFilters = {
    facilityType: facilityType !== "all" ? facilityType : undefined,
    location: location !== "all" ? location : undefined,
    accessibility: accessibility !== "all" ? accessibility : undefined,
    capacity: capacity && (capacity[0] > 0 || capacity[1] < 200) ? capacity : undefined,
    date: date || undefined,
  };

  // Use the centralized facilities service
  const { facilities, isLoading, error } = useFacilities({
    pagination: { page: 1, limit: 50 },
    filters
  });

  // Convert facilities to calendar format with zones
  const facilitiesWithZones = facilities.map(facility => ({
    id: facility.id,
    name: facility.name,
    location: (facility.address && facility.address.toLowerCase().includes('sentrum')) ? 'drammen-sentrum' : 'konnerud',
    type: facility.type,
    capacity: facility.capacity,
    accessibility: facility.accessibility,
    address: facility.address || '',
    suitableFor: facility.suitableFor,
    image: facility.image,
    zones: [
      {
        id: `zone-${facility.id}-1`,
        name: "Hovedområde",
        facilityId: facility.id.toString(),
        capacity: Math.floor(facility.capacity * 0.7),
        pricePerHour: 250,
        description: "Hovedområdet i lokalet",
        area: "100 m²",
        isMainZone: true,
        subZones: [],
        equipment: [],
        amenities: [],
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
          contactPersonEmail: "manager@drammen.kommune.no",
          specialInstructions: "Hovedområdet i lokalet",
          maintenanceSchedule: []
        },
        layout: {
          coordinates: { x: 0, y: 0, width: 100, height: 100 },
          entryPoints: ["Hovedinngang"]
        },
        accessibility: [],
        features: [],
        restrictions: [],
        isActive: true
      }
    ]
  }));

  // Stable availability function - no random behavior
  const getAvailabilityStatus = (zoneId: string, date: Date, timeSlot: string) => {
    const now = new Date();
    const timeHour = parseInt(timeSlot.split(':')[0]);
    const slotDateTime = new Date(date);
    slotDateTime.setHours(timeHour, 0, 0, 0);
    
    if (slotDateTime < now) {
      return { status: 'unavailable', conflict: null };
    }

    // Use stable hash instead of random to determine if slot is booked
    const hash = createStableHash(zoneId, date, timeSlot);
    const isBooked = (hash % 10) < 2; // 20% of slots are "busy"
    
    return { 
      status: isBooked ? 'busy' : 'available', 
      conflict: isBooked ? { type: 'existing-booking', details: 'Allerede booket' } : null 
    };
  };

  const isSlotSelected = (zoneId: string, date: Date, timeSlot: string) => {
    return selectedSlots.some(slot => {
      const slotDate = slot.date instanceof Date ? slot.date : new Date(slot.date);
      return slot.zoneId === zoneId &&
        slotDate.toDateString() === date.toDateString() &&
        slot.timeSlot === timeSlot;
    });
  };

  const handleRemoveSlot = (zoneId: string, date: Date, timeSlot: string) => {
    handleSlotClick(zoneId, date, timeSlot, 'available');
  };

  const handleClearSlots = () => {
    clearSelection();
    setSelectedFacilityId(null);
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 my-[12px]">
        <ViewHeader 
          facilityCount={0}
          isLoading={true}
          viewMode={viewMode}
          setViewMode={setViewMode}
        />
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 my-[12px]">
        <ViewHeader 
          facilityCount={0}
          isLoading={false}
          viewMode={viewMode}
          setViewMode={setViewMode}
        />
        <div className="text-center py-10 bg-red-50 rounded-lg border border-red-200">
          <h3 className="text-xl font-medium mb-2 text-red-800">Kunne ikke laste kalenderen</h3>
          <p className="text-red-600">Prøv igjen senere.</p>
        </div>
      </div>
    );
  }

  // Get selected facility details
  const selectedFacility = selectedFacilityId 
    ? facilitiesWithZones.find(f => f.id.toString() === selectedFacilityId)
    : null;

  // If no facility is selected, show the first one or create a combined view
  const displayFacility = selectedFacility || facilitiesWithZones[0];
  const allZones = selectedFacility 
    ? selectedFacility.zones 
    : facilitiesWithZones.flatMap(f => f.zones);
  
  return (
    <div className="max-w-7xl mx-auto px-4 my-[12px]">
      <ViewHeader 
        facilityCount={facilitiesWithZones.length}
        isLoading={isLoading}
        viewMode={viewMode}
        setViewMode={setViewMode}
      />

      {facilitiesWithZones.length === 0 ? (
        <div className="text-center py-10">
          <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p className="text-lg font-medium">Ingen lokaler funnet</p>
          <p className="text-sm text-gray-500">Prøv å justere filtrene dine</p>
        </div>
      ) : (
        <CalendarWithBooking
          facilityName={displayFacility?.name || 'Alle lokaler'}
          facilityId={selectedFacilityId || 'all'}
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
