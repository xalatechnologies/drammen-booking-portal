
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
    pagination: { page: 1, limit: 50 },
    filters
  });

  // Convert facilities to calendar format with zones
  const facilitiesWithZones = facilities.map(facility => ({
    id: facility.id,
    name: facility.name,
    location: facility.address.toLowerCase().includes('sentrum') ? 'drammen-sentrum' : 'konnerud',
    type: facility.type,
    capacity: facility.capacity,
    accessibility: facility.accessibility,
    address: facility.address,
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

      <div className="space-y-6">
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
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CalendarView;
