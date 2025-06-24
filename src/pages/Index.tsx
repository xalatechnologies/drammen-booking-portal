
import React, { useState } from "react";
import GlobalHeader from "@/components/GlobalHeader";
import HeroBanner from "@/components/HeroBanner";
import FacilityTypeGrid from "@/components/FacilityTypeGrid";
import MapView from "@/components/MapView";
import CalendarView from "@/components/calendar/CalendarView";
import FacilityGrid from "@/components/FacilityGrid";
import { SearchFilter } from "@/components/SearchFilter";
import GlobalFooter from "@/components/GlobalFooter";
import { useOptimizedFacilities } from "@/hooks/useOptimizedFacilities";

const Index = () => {
  const [viewMode, setViewMode] = useState<"grid" | "map" | "calendar" | "list">("grid");
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [facilityType, setFacilityType] = useState("");
  const [location, setLocation] = useState("");
  const [accessibility, setAccessibility] = useState("");
  const [capacity, setCapacity] = useState<[number, number]>([1, 100]);
  const [date, setDate] = useState<Date>(new Date());

  // Fetch facilities with pagination
  const { data: facilities = [], isLoading } = useOptimizedFacilities({
    pagination: { page: 1, limit: 20 },
    filters: {
      searchTerm,
      facilityType,
      location,
      accessibility,
      capacity
    }
  });

  const handleFilter = (filters: any) => {
    console.log('Filters applied:', filters);
  };

  const handleSearch = (query: string) => {
    setSearchTerm(query);
  };

  const renderContent = () => {
    if (isLoading) {
      return <div className="text-center py-8">Loading facilities...</div>;
    }

    switch (viewMode) {
      case "map":
        return (
          <MapView 
            facilityType={facilityType}
            location={location}
            viewMode={viewMode}
            setViewMode={setViewMode}
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
            viewMode={viewMode}
            setViewMode={setViewMode}
          />
        );
      case "grid":
      default:
        return <FacilityGrid 
          pagination={{ page: 1, limit: 20 }}
          filters={{
            searchTerm,
            facilityType,
            location,
            accessibility,
            capacity
          }}
        />;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <GlobalHeader />
      <HeroBanner />
      <FacilityTypeGrid />
      
      <div className="container mx-auto px-4 py-8">
        <SearchFilter
          onFilter={handleFilter}
          onSearch={handleSearch}
        />
        
        {renderContent()}
      </div>
      
      <GlobalFooter />
    </div>
  );
};

export default Index;
