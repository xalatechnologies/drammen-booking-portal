
import React from "react";
import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { AvailabilityTab } from "@/components/facility/tabs/AvailabilityTab";
import { transformCalendarZoneToBookingZone } from "./utils/zoneTransformer";
import { SelectedTimeSlot } from "@/utils/recurrenceEngine";

interface CalendarZone {
  id: string;
  name: string;
  capacity: number;
  pricePerHour: number;
  description: string;
}

interface FacilityWithZones {
  id: number;
  name: string;
  address: string;
  capacity: number;
  zones: CalendarZone[];
}

interface FacilityAccordionContentProps {
  facility: FacilityWithZones;
  selectedSlots: SelectedTimeSlot[];
  onSlotClick: (zoneId: string, date: Date, timeSlot: string, availability: string) => void;
  onBulkSlotSelection: (slots: SelectedTimeSlot[]) => void;
  onClearSlots: () => void;
  onRemoveSlot: (zoneId: string, date: Date, timeSlot: string) => void;
}

export const FacilityAccordionContent: React.FC<FacilityAccordionContentProps> = ({
  facility,
  selectedSlots,
  onSlotClick,
  onBulkSlotSelection,
  onClearSlots,
  onRemoveSlot
}) => {
  return (
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
          zones={facility.zones.map(zone => transformCalendarZoneToBookingZone(zone, facility.id))}
          selectedSlots={selectedSlots.filter(slot => 
            facility.zones.some(zone => zone.id === slot.zoneId)
          )}
          onSlotClick={onSlotClick}
          onBulkSlotSelection={onBulkSlotSelection}
          onClearSlots={onClearSlots}
          onRemoveSlot={onRemoveSlot}
          facilityId={facility.id.toString()}
          facilityName={facility.name}
          timeSlotDuration={1}
        />
      </AccordionContent>
    </AccordionItem>
  );
};
