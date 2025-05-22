
import React, { useState } from "react";
import GlobalHeader from "@/components/GlobalHeader";
import GlobalFooter from "@/components/GlobalFooter";
import HeroBanner from "@/components/HeroBanner";
import SearchFilter from "@/components/SearchFilter";
import FacilityGrid from "@/components/FacilityGrid";
import PaginationControls from "@/components/PaginationControls";

const Index = () => {
  const [date, setDate] = useState<Date>();
  const [facilityType, setFacilityType] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [viewMode, setViewMode] = useState<"grid" | "map">("grid");

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
        />
        {viewMode === "grid" && <FacilityGrid />}
        {viewMode === "grid" && <PaginationControls />}
      </div>

      <GlobalFooter />
    </div>
  );
};

export default Index;
