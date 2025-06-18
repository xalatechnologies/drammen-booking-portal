
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { format, addDays, startOfWeek, isAfter, startOfDay } from "date-fns";
import { Calendar } from "lucide-react";
import { WeekNavigation } from "./WeekNavigation";
import { CalendarHeader } from "./CalendarHeader";
import { FacilityCalendarCard } from "./FacilityCalendarCard";
import { CalendarViewProps, Facility } from "./types";

const CalendarView: React.FC<CalendarViewProps> = ({
  date,
  facilityType,
  location,
  accessibility,
  capacity,
}) => {
  const [currentWeekStart, setCurrentWeekStart] = useState(startOfWeek(date || new Date(), { weekStartsOn: 1 }));
  
  // Check if we can go to previous week (prevent going to past dates)
  const today = startOfDay(new Date());
  const previousWeekStart = new Date(currentWeekStart.getTime() - 7 * 24 * 60 * 60 * 1000);
  const canGoPrevious = isAfter(addDays(previousWeekStart, 6), today) || format(addDays(previousWeekStart, 6), 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd');
  
  // Mock data for facility bookings
  const facilities: Facility[] = [
    {
      id: 1,
      name: "Brandengen Skole - Gymsal",
      location: "Drammen sentrum",
      type: "sports-hall",
      capacity: 120,
      accessibility: ["wheelchair"],
      address: "Knoffs gate 8, Drammen",
      suitableFor: ["Basketball", "Volleyball", "Badminton"],
      bookings: [
        { id: 101, facilityId: 1, facilityName: "Brandengen Skole - Gymsal", date: new Date(2025, 4, 25, 14, 0), endDate: new Date(2025, 4, 25, 16, 0), status: "confirmed" },
        { id: 102, facilityId: 1, facilityName: "Brandengen Skole - Gymsal", date: new Date(2025, 4, 26, 10, 0), endDate: new Date(2025, 4, 26, 12, 0), status: "pending" }
      ]
    },
    {
      id: 2,
      name: "Fjell Skole - Aktivitetshall",
      location: "konnerud",
      type: "gymnasium",
      capacity: 200,
      accessibility: ["wheelchair", "hearing-loop"],
      address: "Fjellstrand 15, Drammen",
      suitableFor: ["Fotball", "Håndball", "Turn"],
      bookings: [
        { id: 201, facilityId: 2, facilityName: "Fjell Skole - Aktivitetshall", date: new Date(2025, 4, 27, 17, 0), endDate: new Date(2025, 4, 27, 19, 0), status: "confirmed" }
      ]
    },
    {
      id: 3,
      name: "Rådhuset - Møterom 3",
      location: "drammen-sentrum",
      type: "meeting-room",
      capacity: 30,
      accessibility: ["wheelchair", "hearing-loop", "sign-language"],
      address: "Engene 1, Drammen",
      suitableFor: ["Møter", "Presentasjoner", "Workshops"],
      bookings: []
    }
  ];

  const days = Array(7).fill(0).map((_, i) => addDays(currentWeekStart, i));
  
  const filteredFacilities = facilities.filter(facility => {
    if (facilityType && facility.type !== facilityType) return false;
    if (location && facility.location !== location) return false;
    if (accessibility && !facility.accessibility.includes(accessibility)) return false;
    if (capacity && (facility.capacity < capacity[0] || facility.capacity > capacity[1])) return false;
    return true;
  });

  const isTimeSlotBooked = (facilityId: number, day: Date, hour: number) => {
    const facility = facilities.find(f => f.id === facilityId);
    if (!facility) return false;
    
    return facility.bookings.some(booking => {
      const bookingDate = new Date(booking.date);
      const bookingEndDate = new Date(booking.endDate);
      const slotStart = new Date(day.setHours(hour, 0, 0, 0));
      const slotEnd = new Date(day.setHours(hour + 2, 0, 0, 0));
      
      return (
        bookingDate.getDate() === day.getDate() &&
        bookingDate.getMonth() === day.getMonth() &&
        bookingDate.getFullYear() === day.getFullYear() &&
        ((bookingDate <= slotStart && bookingEndDate > slotStart) ||
         (bookingDate >= slotStart && bookingDate < slotEnd))
      );
    });
  };

  const timeSlots = ["08:00-10:00", "10:00-12:00", "12:00-14:00", "14:00-16:00", "16:00-18:00", "18:00-20:00", "20:00-22:00"];
  
  return (
    <div className="mb-8 space-y-6">
      {/* Enhanced Week Navigation */}
      <WeekNavigation
        currentWeekStart={currentWeekStart}
        setCurrentWeekStart={setCurrentWeekStart}
        canGoPrevious={canGoPrevious}
      />

      {/* Enhanced Calendar Grid */}
      <Card className="shadow-lg border-0">
        <CalendarHeader />
        <CardContent className="p-0">
          {filteredFacilities.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium">Ingen lokaler funnet</p>
              <p className="text-sm">Prøv å justere filtrene dine</p>
            </div>
          ) : (
            <div className="space-y-0">
              {filteredFacilities.map((facility, facilityIndex) => (
                <FacilityCalendarCard
                  key={facility.id}
                  facility={facility}
                  facilityIndex={facilityIndex}
                  days={days}
                  timeSlots={timeSlots}
                  isTimeSlotBooked={isTimeSlotBooked}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CalendarView;
