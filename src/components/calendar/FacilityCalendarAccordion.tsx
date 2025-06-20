
import React from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CalendarGrid } from "../facility/tabs/CalendarGrid";
import { addDays } from "date-fns";

interface Zone {
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
  zones: Zone[];
}

interface FacilityCalendarAccordionProps {
  facilities: FacilityWithZones[];
  currentWeekStart: Date;
}

export const FacilityCalendarAccordion: React.FC<FacilityCalendarAccordionProps> = ({
  facilities,
  currentWeekStart,
}) => {
  // Generate hourly time slots from 08:00 to 22:00
  const timeSlots = Array.from({ length: 14 }, (_, i) => {
    const hour = 8 + i;
    const nextHour = hour + 1;
    return `${hour.toString().padStart(2, '0')}:00-${nextHour.toString().padStart(2, '0')}:00`;
  });

  const getAvailabilityStatus = (zoneId: string, date: Date, timeSlot: string) => {
    // Mock availability logic - in real app this would check actual bookings
    const now = new Date();
    const timeHour = parseInt(timeSlot.split(':')[0]);
    const slotDateTime = new Date(date);
    slotDateTime.setHours(timeHour, 0, 0, 0);
    
    if (slotDateTime < now) {
      return { status: 'unavailable', conflict: null };
    }

    // Random availability for demo
    const isBooked = Math.random() > 0.8;
    return { 
      status: isBooked ? 'busy' : 'available', 
      conflict: isBooked ? { type: 'existing-booking', details: 'Allerede booket' } : null 
    };
  };

  const isSlotSelected = () => false; // No selection in calendar view

  const handleSlotClick = (zoneId: string, date: Date, timeSlot: string, availability: string) => {
    if (availability === 'available') {
      // Navigate to facility booking page with pre-selected time
      const facilityId = zoneId.split('-')[1];
      window.location.href = `/facilities/${facilityId}?date=${date.toISOString().split('T')[0]}&time=${timeSlot}`;
    }
  };

  return (
    <Accordion type="multiple" className="w-full">
      {facilities.map((facility, index) => (
        <AccordionItem key={facility.id} value={`facility-${facility.id}`}>
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center justify-between w-full pr-4">
              <div className="flex items-start gap-4 text-left">
                {/* Facility Image */}
                <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                  <img 
                    src={facility.image || 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&auto=format&fit=crop'} 
                    alt={facility.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&auto=format&fit=crop";
                      target.onerror = null;
                    }}
                  />
                </div>
                
                {/* Facility Info */}
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-gray-900 mb-1">{facility.name}</h3>
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>{facility.address}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>{facility.capacity} personer</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {facility.suitableFor.slice(0, 3).map((activity, i) => (
                      <Badge
                        key={i}
                        className="bg-blue-100 text-blue-800 border-blue-200 text-xs"
                      >
                        {activity}
                      </Badge>
                    ))}
                    {facility.accessibility.includes("wheelchair") && (
                      <Badge className="bg-green-100 text-green-800 border-green-200 text-xs">
                        Rullestol
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              
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
                    <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-2">{zone.name}</h4>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>{zone.capacity} personer</span>
                        <span>{zone.pricePerHour} kr/time</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{zone.description}</p>
                    </div>
                    <CalendarGrid
                      zone={zone}
                      currentWeekStart={currentWeekStart}
                      timeSlots={timeSlots}
                      selectedSlots={[]}
                      getAvailabilityStatus={getAvailabilityStatus}
                      isSlotSelected={isSlotSelected}
                      onSlotClick={handleSlotClick}
                    />
                  </TabsContent>
                ))}
              </Tabs>
            ) : (
              <div>
                <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">{facility.zones[0].name}</h4>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>{facility.zones[0].capacity} personer</span>
                    <span>{facility.zones[0].pricePerHour} kr/time</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{facility.zones[0].description}</p>
                </div>
                <CalendarGrid
                  zone={facility.zones[0]}
                  currentWeekStart={currentWeekStart}
                  timeSlots={timeSlots}
                  selectedSlots={[]}
                  getAvailabilityStatus={getAvailabilityStatus}
                  isSlotSelected={isSlotSelected}
                  onSlotClick={handleSlotClick}
                />
              </div>
            )}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};
