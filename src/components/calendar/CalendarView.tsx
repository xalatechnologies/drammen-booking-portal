
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { format, addDays, startOfWeek, isAfter, startOfDay } from "date-fns";
import { Calendar } from "lucide-react";
import { WeekNavigation } from "./WeekNavigation";
import { CalendarHeader } from "./CalendarHeader";
import { FacilityCalendarCard } from "./FacilityCalendarCard";
import { CalendarViewProps } from "./types";
import { useFacilities } from "@/hooks/useFacilities";
import { FacilityFilters } from "@/types/facility";
import ViewHeader from "../search/ViewHeader";

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
    pagination: { page: 1, limit: 50 }, // Get more facilities for calendar
    filters
  });

  // Convert facilities to calendar format with mock bookings
  const facilitiesWithBookings = facilities.map(facility => ({
    id: facility.id,
    name: facility.name,
    location: facility.address.toLowerCase().includes('sentrum') ? 'drammen-sentrum' : 'konnerud',
    type: facility.type,
    capacity: facility.capacity,
    accessibility: facility.accessibility,
    address: facility.address,
    suitableFor: facility.suitableFor,
    bookings: [
      // Add some mock bookings for demonstration
      ...(Math.random() > 0.5 ? [{
        id: facility.id * 100 + 1,
        facilityId: facility.id,
        facilityName: facility.name,
        date: new Date(2025, 4, 25 + Math.floor(Math.random() * 7), 14, 0),
        endDate: new Date(2025, 4, 25 + Math.floor(Math.random() * 7), 16, 0),
        status: "confirmed" as const
      }] : []),
      ...(Math.random() > 0.7 ? [{
        id: facility.id * 100 + 2,
        facilityId: facility.id,
        facilityName: facility.name,
        date: new Date(2025, 4, 26 + Math.floor(Math.random() * 7), 10, 0),
        endDate: new Date(2025, 4, 26 + Math.floor(Math.random() * 7), 12, 0),
        status: "pending" as const
      }] : [])
    ]
  }));

  const days = Array(7).fill(0).map((_, i) => addDays(currentWeekStart, i));

  const isTimeSlotBooked = (facilityId: number, day: Date, hour: number) => {
    const facility = facilitiesWithBookings.find(f => f.id === facilityId);
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
  
  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4">
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
      <div className="max-w-7xl mx-auto px-4">
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
    <div className="max-w-7xl mx-auto px-4">
      {/* Reusable Header */}
      <ViewHeader 
        facilityCount={facilitiesWithBookings.length}
        isLoading={isLoading}
        viewMode={viewMode}
        setViewMode={setViewMode}
      />

      <div className="space-y-6">
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
            {facilitiesWithBookings.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p className="text-lg font-medium">Ingen lokaler funnet</p>
                <p className="text-sm">Prøv å justere filtrene dine</p>
              </div>
            ) : (
              <div className="space-y-0">
                {facilitiesWithBookings.map((facility, facilityIndex) => (
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
    </div>
  );
};

export default CalendarView;
