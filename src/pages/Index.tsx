

import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { DateRange } from "react-day-picker";
import GlobalHeader from "@/components/GlobalHeader";
import GlobalFooter from "@/components/GlobalFooter";
import HeroBanner from "@/components/HeroBanner";
import SearchFilter from "@/components/SearchFilter";
import FacilityGrid from "@/components/FacilityGrid";
import FacilityList from "@/components/FacilityList";
import PaginationControls from "@/components/PaginationControls";
import MapView from "@/components/MapView";
import CalendarView from "@/components/CalendarView";

const Index = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [date, setDate] = useState<Date>();
  const [facilityType, setFacilityType] = useState<string>("all");
  const [location, setLocation] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "map" | "calendar" | "list">("grid");
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
    if (urlViewMode && ['grid', 'map', 'calendar', 'list'].includes(urlViewMode)) {
      setViewMode(urlViewMode as "grid" | "map" | "calendar" | "list");
    }

    // Clear URL parameters after setting state
    if (searchParams.toString()) {
      setSearchParams({});
    }
  }, [searchParams, setSearchParams]);

  const renderContent = () => {
    switch (viewMode) {
      case "map":
        return (
          <MapView 
            facilityType={facilityType} 
            location={location}
          />
        );
      case "calendar":
        return (
          <CalendarView 
            date={date}
            facilityType={facilityType}
            location={location}
            accessibility={accessibility}
            capacity={capacity}
          />
        );
      case "list":
        return (
          <>
            <FacilityList 
              facilityType={facilityType}
              location={location}
              accessibility={accessibility}
              capacity={capacity}
            />
            <PaginationControls />
          </>
        );
      default:
        return (
          <>
            <FacilityGrid 
              facilityType={facilityType}
              location={location}
              accessibility={accessibility}
              capacity={capacity}
            />
            <PaginationControls />
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col">
      {/* Skip to main content link for screen readers */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 bg-blue-600 text-white p-2 z-50 rounded-br-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
        tabIndex={0}
      >
        Hopp til hovedinnhold
      </a>

      <GlobalHeader />

      <main id="main-content" className="flex-1">
        <div className="container mx-auto px-4 py-6">
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

          {renderContent()}
        </div>
      </main>

      <GlobalFooter />
    </div>
  );
};

export default Index;

