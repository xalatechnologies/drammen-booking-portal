
import { useState } from "react";
import { FacilityFilters } from "@/types/facility";
import { useFacilities } from "@/hooks/useFacilities";
import { useSlotSelection } from "@/hooks/useSlotSelection";
import { useCart } from "@/contexts/CartContext";
import { useNavigate } from "react-router-dom";
import { transformFacilitiesToCalendarFormat } from "@/components/calendar/utils/facilityTransformer";
import { getStableAvailabilityStatus } from "@/utils/availabilityUtils";

interface UseCalendarViewProps {
  date?: Date;
  facilityType?: string;
  location?: string;
  accessibility?: string;
  capacity?: [number, number];
}

export function useCalendarView({
  date,
  facilityType,
  location,
  accessibility,
  capacity
}: UseCalendarViewProps) {
  const [selectedFacilityId, setSelectedFacilityId] = useState<string | null>(null);
  const { addToCart } = useCart();
  const navigate = useNavigate();
  
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

  const { facilities, isLoading, error } = useFacilities({
    pagination: { page: 1, limit: 50 },
    filters
  });

  const facilitiesWithZones = transformFacilitiesToCalendarFormat(facilities);

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

  const selectedFacility = selectedFacilityId 
    ? facilitiesWithZones.find(f => f.id.toString() === selectedFacilityId)
    : null;

  const displayFacility = selectedFacility || facilitiesWithZones[0];
  const allZones = selectedFacility 
    ? selectedFacility.zones 
    : facilitiesWithZones.flatMap(f => f.zones);

  return {
    facilitiesWithZones,
    selectedSlots,
    selectedFacilityId,
    setSelectedFacilityId,
    isLoading,
    error,
    handleSlotClick,
    handleBulkSlotSelection,
    handleRemoveSlot,
    handleClearSlots,
    getAvailabilityStatus: getStableAvailabilityStatus,
    isSlotSelected,
    displayFacility,
    allZones,
    navigate
  };
}
