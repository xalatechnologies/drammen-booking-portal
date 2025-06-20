
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
  onFacilitySelect?: (facilityId: string) => void;
}

export const FacilityAccordionItem: React.FC<FacilityAccordionItemProps> = ({
  facility,
  currentWeekStart,
  timeSlots,
  getAvailabilityStatus,
  isSlotSelected,
  handleSlotClick,
  onFacilitySelect,
}) => {
  const handleFacilityClick = () => {
    if (onFacilitySelect) {
      onFacilitySelect(facility.id.toString());
    }
  };

  const renderZoneContent = (zone: CalendarZone) => (
    <div>
      <div className="mb-6 p-6 bg-slate-100 rounded-lg border border-slate-200">
        <h4 className="font-semibold text-xl text-gray-900 mb-3">{zone.name}</h4>
        <div className="flex items-center gap-6 text-lg text-gray-600">
          <span className="font-medium">{zone.capacity} personer</span>
          <span className="font-medium">{zone.pricePerHour} kr/time</span>
        </div>
        <p className="text-lg text-gray-600 mt-2">{zone.description}</p>
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
    <AccordionItem value={`facility-${facility.id}`} className="border-b border-gray-200 bg-slate-50 rounded-lg mb-2">
      <AccordionTrigger 
        className="hover:no-underline py-6 px-6 hover:bg-slate-100"
        onClick={handleFacilityClick}
      >
        <div className="flex items-center justify-between w-full pr-4">
          <FacilityHeader facility={facility} />
          <div className="flex gap-3">
            <Button
              variant="outline"
              size="default"
              className="shrink-0 text-lg px-6 py-3"
              onClick={(e) => {
                e.stopPropagation();
                if (onFacilitySelect) {
                  onFacilitySelect(facility.id.toString());
                }
              }}
            >
              Reserver nå
            </Button>
            <Button
              variant="ghost"
              size="default"
              className="shrink-0 text-lg px-6 py-3"
              onClick={(e) => {
                e.stopPropagation();
                window.location.href = `/facilities/${facility.id}`;
              }}
            >
              Se detaljer
            </Button>
          </div>
        </div>
      </AccordionTrigger>
      
      <AccordionContent className="pt-4 px-6 pb-6 bg-white">
        {facility.zones.length > 1 ? (
          <Tabs defaultValue={facility.zones[0].id}>
            <TabsList className="grid w-full grid-cols-2 mb-8 h-14">
              {facility.zones.map(zone => (
                <TabsTrigger key={zone.id} value={zone.id} className="text-lg py-4">
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
