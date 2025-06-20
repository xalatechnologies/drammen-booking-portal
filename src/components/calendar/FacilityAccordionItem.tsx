
import React from "react";
import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { CalendarGrid } from "../facility/tabs/CalendarGrid";
import { FacilityHeader } from "./FacilityHeader";
import { convertCalendarZoneToBookingZone } from "./zoneConverter";

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
  accessibility: string[];
  suitableFor: string[];
  image?: string;
  zones: CalendarZone[];
}

interface FacilityAccordionItemProps {
  facility: FacilityWithZones;
  currentWeekStart: Date;
  timeSlots: string[];
  getAvailabilityStatus: (zoneId: string, date: Date, timeSlot: string) => { status: string; conflict: any };
  isSlotSelected: (zoneId: string, date: Date, timeSlot: string) => boolean;
  handleSlotClick: (zoneId: string, date: Date, timeSlot: string, availability: string) => void;
}

export const FacilityAccordionItem: React.FC<FacilityAccordionItemProps> = ({
  facility,
  currentWeekStart,
  timeSlots,
  getAvailabilityStatus,
  isSlotSelected,
  handleSlotClick,
}) => {
  const renderZoneContent = (zone: CalendarZone) => (
    <div>
      <div className="mb-4 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-2">{zone.name}</h4>
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <span>{zone.capacity} personer</span>
          <span>{zone.pricePerHour} kr/time</span>
        </div>
        <p className="text-sm text-gray-600 mt-1">{zone.description}</p>
      </div>
      <CalendarGrid
        zone={convertCalendarZoneToBookingZone(zone, facility.id)}
        currentWeekStart={currentWeekStart}
        timeSlots={timeSlots}
        selectedSlots={[]}
        getAvailabilityStatus={getAvailabilityStatus}
        isSlotSelected={isSlotSelected}
        onSlotClick={handleSlotClick}
      />
    </div>
  );

  return (
    <AccordionItem value={`facility-${facility.id}`}>
      <AccordionTrigger className="hover:no-underline">
        <div className="flex items-center justify-between w-full pr-4">
          <FacilityHeader facility={facility} />
          <Button
            variant="outline"
            size="sm"
            className="shrink-0"
            onClick={(e) => {
              e.stopPropagation();
              window.location.href = `/facilities/${facility.id}`;
            }}
          >
            Se detaljer
          </Button>
        </div>
      </AccordionTrigger>
      
      <AccordionContent className="pt-4">
        {facility.zones.length > 1 ? (
          <Tabs defaultValue={facility.zones[0].id}>
            <TabsList className="grid w-full grid-cols-2 mb-6">
              {facility.zones.map(zone => (
                <TabsTrigger key={zone.id} value={zone.id} className="text-sm">
                  {zone.name}
                </TabsTrigger>
              ))}
            </TabsList>
            {facility.zones.map(zone => (
              <TabsContent key={zone.id} value={zone.id}>
                {renderZoneContent(zone)}
              </TabsContent>
            ))}
          </Tabs>
        ) : (
          renderZoneContent(facility.zones[0])
        )}
      </AccordionContent>
    </AccordionItem>
  );
};
