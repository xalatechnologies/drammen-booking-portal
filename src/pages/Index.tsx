
import React, { useState } from "react";
import GlobalHeader from "@/components/GlobalHeader";
import GlobalFooter from "@/components/GlobalFooter";
import HeroBanner from "@/components/HeroBanner";
import SearchFilter from "@/components/SearchFilter";
import FacilityGrid from "@/components/FacilityGrid";
import PaginationControls from "@/components/PaginationControls";
import MapView from "@/components/MapView";
import CalendarView from "@/components/CalendarView";

const Index = () => {
  const [date, setDate] = useState<Date>();
  const [facilityType, setFacilityType] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [viewMode, setViewMode] = useState<"grid" | "map" | "calendar">("grid");
  const [accessibility, setAccessibility] = useState<string>("");
  const [capacity, setCapacity] = useState<number[]>([0, 200]);

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
            facilityType={facilityType}
            location={location}
            accessibility={accessibility}
            capacity={capacity}
          />
        )}
        
        {viewMode === "map" && (
          <MapView facilityType={facilityType} location={location} />
        )}
        
        {viewMode === "calendar" && (
          <CalendarView 
            date={date}
            facilityType={facilityType}
            location={location}
            accessibility={accessibility}
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
