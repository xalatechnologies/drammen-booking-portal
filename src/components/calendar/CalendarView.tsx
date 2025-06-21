
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { format, addDays, startOfWeek, isAfter, startOfDay } from "date-fns";
import { Calendar } from "lucide-react";
import { WeekNavigation } from "./WeekNavigation";
import { CalendarHeader } from "./CalendarHeader";
import { FacilityCalendarAccordion } from "./FacilityCalendarAccordion";
import { CalendarViewProps } from "./types";
import { useFacilities } from "@/hooks/useFacilities";
import { FacilityFilters } from "@/types/facility";
import ViewHeader from "../search/ViewHeader";
import { UnifiedBookingForm } from "../booking/UnifiedBookingForm";
import { SelectedTimeSlot } from "@/utils/recurrenceEngine";
import { useCart } from "@/contexts/CartContext";
import { useNavigate } from "react-router-dom";

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
  const [currentWeekStart, setCurrentWeekStart] = useState(startOfWeek(date || new Date(), { weekStartsOn: 1 }));
  const [selectedFacilityId, setSelectedFacilityId] = useState<string | null>(null);
  const [selectedSlots, setSelectedSlots] = useState<SelectedTimeSlot[]>([]);
  const { addToCart } = useCart();
  const navigate = useNavigate();
  
  // Check if we can go to previous week (prevent going to past dates)
  const today = startOfDay(new Date());
  const previousWeekStart = new Date(currentWeekStart.getTime() - 7 * 24 * 60 * 60 * 1000);
  const canGoPrevious = isAfter(addDays(previousWeekStart, 6), today) || format(addDays(previousWeekStart, 6), 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd');
  
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

  // Convert facilities to calendar format with zones - fix the address handling
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
        capacity: Math.floor(facility.capacity * 0.7),
        pricePerHour: 250,
        description: "Hovedområdet i lokalet"
      },
      ...(facility.capacity > 50 ? [{
        id: `zone-${facility.id}-2`, 
        name: "Seksjon B",
        capacity: Math.floor(facility.capacity * 0.3),
        pricePerHour: 150,
        description: "Mindre seksjon av lokalet"
      }] : [])
    ]
  }));

  // Get selected facility details
  const selectedFacility = selectedFacilityId 
    ? facilitiesWithZones.find(f => f.id.toString() === selectedFacilityId)
    : null;

  const handleSlotSelection = (facilityId: string, slots: SelectedTimeSlot[]) => {
    setSelectedFacilityId(facilityId);
    setSelectedSlots(slots);
  };

  const handleAddToCart = (bookingData: any) => {
    // Add to cart logic here
    addToCart({
      facilityId: bookingData.facilityId,
      facilityName: bookingData.facilityName,
      purpose: bookingData.formData.purpose,
      timeSlots: bookingData.selectedSlots,
      organizationType: bookingData.formData.actorType,
      expectedAttendees: bookingData.formData.attendees,
      additionalServices: [],
      pricing: {
        baseFacilityPrice: 250 * bookingData.selectedSlots.length,
        servicesPrice: 0,
        discounts: 0,
        vatAmount: 0,
        totalPrice: 250 * bookingData.selectedSlots.length
      },
      // Legacy fields for compatibility
      date: bookingData.selectedSlots[0]?.date || new Date(),
      timeSlot: bookingData.selectedSlots[0]?.timeSlot || '',
      zoneId: bookingData.selectedSlots[0]?.zoneId || '',
      pricePerHour: 250
    });
    
    // Clear selections
    setSelectedSlots([]);
    setSelectedFacilityId(null);
  };

  const handleCompleteBooking = (bookingData: any) => {
    navigate('/checkout', { state: { bookingData } });
  };

  const handleClearSlots = () => {
    setSelectedSlots([]);
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
  
  return (
    <div className="max-w-7xl mx-auto px-4 my-[12px]">
      <ViewHeader 
        facilityCount={facilitiesWithZones.length}
        isLoading={isLoading}
        viewMode={viewMode}
        setViewMode={setViewMode}
      />

      <div className="flex gap-6">
        {/* Main Calendar Content - 60% */}
        <div className="w-3/5 space-y-6">
          <WeekNavigation
            currentWeekStart={currentWeekStart}
            setCurrentWeekStart={setCurrentWeekStart}
            canGoPrevious={canGoPrevious}
          />

          <Card className="shadow-lg border-0">
            <CalendarHeader />
            <CardContent className="p-0">
              {facilitiesWithZones.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg font-medium">Ingen lokaler funnet</p>
                  <p className="text-sm">Prøv å justere filtrene dine</p>
                </div>
              ) : (
                <FacilityCalendarAccordion
                  facilities={facilitiesWithZones}
                  currentWeekStart={currentWeekStart}
                  onFacilitySelect={setSelectedFacilityId}
                  onSlotSelection={handleSlotSelection}
                />
              )}
            </CardContent>
          </Card>
        </div>

        {/* Booking Sidebar - 40% */}
        <div className="w-2/5">
          <div className="sticky top-4">
            <UnifiedBookingForm
              selectedSlots={selectedSlots}
              facilityId={selectedFacilityId || ''}
              facilityName={selectedFacility?.name || ''}
              zones={selectedFacility?.zones.map(zone => ({
                ...zone,
                equipment: [],
                area: "100 m²",
                parentZoneId: undefined,
                isMainZone: true,
                subZones: [],
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
                  specialInstructions: zone.description,
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
              })) || []}
              onAddToCart={handleAddToCart}
              onCompleteBooking={handleCompleteBooking}
              onSlotsCleared={handleClearSlots}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarView;
