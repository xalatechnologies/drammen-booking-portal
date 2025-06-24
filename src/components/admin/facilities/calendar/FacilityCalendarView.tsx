
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Calendar, Clock, Users, MapPin } from "lucide-react";
import { CalendarWithBooking } from "@/components/shared/CalendarWithBooking";
import { useZones } from "@/hooks/useZones";
import { SelectedTimeSlot } from "@/utils/recurrenceEngine";
import { convertDatabaseZoneToBookingZone } from "@/utils/zoneConverter";

interface FacilityCalendarViewProps {
  facility: any;
  onBack: () => void;
}

export const FacilityCalendarView: React.FC<FacilityCalendarViewProps> = ({
  facility,
  onBack
}) => {
  const [selectedSlots, setSelectedSlots] = useState<SelectedTimeSlot[]>([]);
  const { data: dbZones = [], isLoading: zonesLoading } = useZones(facility.id?.toString());

  // Convert database zones to booking zone format for the calendar
  const zones = dbZones.map(convertDatabaseZoneToBookingZone);

  const handleSlotClick = (zoneId: string, date: Date, timeSlot: string, availability: string) => {
    console.log('Slot clicked:', { zoneId, date, timeSlot, availability });
    // Add logic for admin slot management (blocking, etc.)
  };

  const handleBulkSlotSelection = (slots: SelectedTimeSlot[]) => {
    setSelectedSlots(slots);
  };

  const handleRemoveSlot = (zoneId: string, date: Date, timeSlot: string) => {
    setSelectedSlots(prev => prev.filter(slot => 
      !(slot.zoneId === zoneId && 
        slot.date.toDateString() === date.toDateString() && 
        slot.timeSlot === timeSlot)
    ));
  };

  const handleClearSlots = () => {
    setSelectedSlots([]);
  };

  const getAvailabilityStatus = (zoneId: string, date: Date, timeSlot: string) => {
    // Mock availability logic - replace with real implementation
    return {
      status: 'available',
      conflict: null
    };
  };

  const isSlotSelected = (zoneId: string, date: Date, timeSlot: string) => {
    return selectedSlots.some(slot => 
      slot.zoneId === zoneId && 
      slot.date.toDateString() === date.toDateString() && 
      slot.timeSlot === timeSlot
    );
  };

  if (zonesLoading) {
    return (
      <div className="w-full flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading calendar...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Facilities
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Calendar Management</h1>
            <p className="text-gray-600">{facility.name}</p>
          </div>
        </div>
      </div>

      {/* Facility Info */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="flex items-center text-gray-600">
                <MapPin className="h-4 w-4 mr-2" />
                <span>{facility.address_street}, {facility.address_city}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Users className="h-4 w-4 mr-2" />
                <span>{facility.capacity} people</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Clock className="h-4 w-4 mr-2" />
                <span>{facility.time_slot_duration}h slots</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Calendar Component */}
      {zones.length > 0 ? (
        <CalendarWithBooking
          facilityName={facility.name}
          facilityId={facility.id.toString()}
          zones={zones}
          selectedSlots={selectedSlots}
          onSlotClick={handleSlotClick}
          onBulkSlotSelection={handleBulkSlotSelection}
          onRemoveSlot={handleRemoveSlot}
          onClearSlots={handleClearSlots}
          getAvailabilityStatus={getAvailabilityStatus}
          isSlotSelected={isSlotSelected}
          timeSlotDuration={facility.time_slot_duration || 1}
          layout="vertical"
          compact={false}
        />
      ) : (
        <Card>
          <CardContent className="p-8 text-center">
            <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Zones Configured</h3>
            <p className="text-gray-600 mb-4">
              This facility needs zones configured before calendar management is available.
            </p>
            <Button variant="outline">
              Configure Zones
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
