
import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { DateRange } from "react-day-picker";
import GlobalHeader from "@/components/GlobalHeader";
import GlobalFooter from "@/components/GlobalFooter";
import HeroBanner from "@/components/HeroBanner";
import SearchFilter from "@/components/SearchFilter";
import FacilityGrid from "@/components/FacilityGrid";
import PaginationControls from "@/components/PaginationControls";
import MapView from "@/components/MapView";
import CalendarView from "@/components/CalendarView";

const Index = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [date, setDate] = useState<Date>();
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [facilityType, setFacilityType] = useState<string>("all");
  const [location, setLocation] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "map" | "calendar">("grid");
  const [accessibility, setAccessibility] = useState<string>("all");
  const [capacity, setCapacity] = useState<number[]>([0, 200]);

  // Initialize state from URL parameters
  useEffect(() => {
    const urlFacilityType = searchParams.get('facilityType');
    const urlLocation = searchParams.get('location');
    const urlAccessibility = searchParams.get('accessibility');
    const urlCapacity = searchParams.get('capacity');
    const urlViewMode = searchParams.get('viewMode');

    if (urlFacilityType) setFacilityType(urlFacilityType);
    if (urlLocation) setLocation(urlLocation);
    if (urlAccessibility) setAccessibility(urlAccessibility);
    if (urlCapacity) {
      const capacityArray = urlCapacity.split(',').map(Number);
      if (capacityArray.length === 2) setCapacity(capacityArray);
    }
    if (urlViewMode && ['grid', 'map', 'calendar'].includes(urlViewMode)) {
      setViewMode(urlViewMode as "grid" | "map" | "calendar");
    }

    // Clear URL parameters after setting state
    if (searchParams.toString()) {
      setSearchParams({});
    }
  }, [searchParams, setSearchParams]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col">
      <GlobalHeader />

      <div className="container mx-auto px-4 py-6 max-w-7xl flex-grow">
        <HeroBanner />
        <SearchFilter 
          date={date}
          setDate={setDate}
          facilityType={facilityType}
          setFacilityType={setFacilityType}
          location={location}
          setLocation={setLocation}
          viewMode={viewMode}
          setViewMode={setViewMode}
          accessibility={accessibility}
          setAccessibility={setAccessibility}
          capacity={capacity}
          setCapacity={setCapacity}
        />
        
        {viewMode === "grid" && (
          <FacilityGrid 
            date={date}
            facilityType={facilityType === "all" ? "" : facilityType}
            location={location === "all" ? "" : location}
            accessibility={accessibility === "all" ? "" : accessibility}
            capacity={capacity}
          />
        )}
        
        {viewMode === "map" && (
          <MapView 
            facilityType={facilityType === "all" ? "" : facilityType} 
            location={location === "all" ? "" : location} 
          />
        )}
        
        {viewMode === "calendar" && (
          <CalendarView 
            date={date}
            facilityType={facilityType === "all" ? "" : facilityType}
            location={location === "all" ? "" : location}
            accessibility={accessibility === "all" ? "" : accessibility}
            capacity={capacity}
          />
        )}
        
        {viewMode === "grid" && <PaginationControls />}
      </div>

      <GlobalFooter />
    </div>
  );
};

export default Index;
