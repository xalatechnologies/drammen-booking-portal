
import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { DateRange } from "react-day-picker";
import GlobalHeader from "@/components/GlobalHeader";
import GlobalFooter from "@/components/GlobalFooter";
import HeroBanner from "@/components/HeroBanner";
import SearchFilter from "@/components/SearchFilter";
import FacilityList from "@/components/FacilityList";
import MapView from "@/components/MapView";
import CalendarView from "@/components/CalendarView";
import { useFacilitiesPagination } from "@/hooks/useFacilities";
import { FacilityFilters } from "@/types/facility";

const Index = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [date, setDate] = useState<Date>();
  const [facilityType, setFacilityType] = useState<string>("all");
  const [location, setLocation] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "map" | "calendar" | "list">("grid");
  const [accessibility, setAccessibility] = useState<string>("all");
  const [capacity, setCapacity] = useState<number[]>([0, 200]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  
  // Advanced filter states
  const [priceRange, setPriceRange] = useState<number[]>([0, 5000]);
  const [availableNow, setAvailableNow] = useState<boolean>(false);
  const [hasEquipment, setHasEquipment] = useState<boolean>(false);
  const [hasParking, setHasParking] = useState<boolean>(false);
  const [hasWifi, setHasWifi] = useState<boolean>(false);
  const [allowsPhotography, setAllowsPhotography] = useState<boolean>(false);

  // Initialize state from URL parameters
  useEffect(() => {
    const urlFacilityType = searchParams.get('facilityType');
    const urlLocation = searchParams.get('location');
    const urlAccessibility = searchParams.get('accessibility');
    const urlCapacity = searchParams.get('capacity');
    const urlViewMode = searchParams.get('viewMode');
    const urlSearchTerm = searchParams.get('searchTerm');
    
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
    if (urlSearchTerm) setSearchTerm(urlSearchTerm);

    // Clear URL parameters after setting state
    if (searchParams.toString()) {
      setSearchParams({});
    }
  }, [searchParams, setSearchParams]);

  // Create amenities array from individual boolean states
  const amenities = [
    ...(hasEquipment ? ['av-equipment'] : []),
    ...(hasParking ? ['parking'] : []),
    ...(hasWifi ? ['wifi'] : []),
    ...(allowsPhotography ? ['photography'] : [])
  ];

  // Create filters object
  const filters: FacilityFilters = {
    searchTerm: searchTerm || undefined,
    facilityType: facilityType !== "all" ? facilityType : undefined,
    location: location !== "all" ? location : undefined,
    accessibility: accessibility !== "all" ? accessibility : undefined,
    capacity: capacity[0] > 0 || capacity[1] < 200 ? capacity : undefined,
    date: date || undefined,
    priceRange: priceRange[0] > 0 || priceRange[1] < 5000 ? { min: priceRange[0], max: priceRange[1] } : undefined,
    availableNow: availableNow || undefined,
    amenities: amenities.length > 0 ? amenities : undefined,
  };

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
      case "grid":
        return (
          <FacilityList 
            filters={filters}
            viewMode={viewMode}
          />
        );
      default:
        return (
          <FacilityList 
            filters={filters}
            viewMode="grid"
          />
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
        {/* Hero and Search Filter in container */}
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
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            availableNow={availableNow}
            setAvailableNow={setAvailableNow}
            hasEquipment={hasEquipment}
            setHasEquipment={setHasEquipment}
            hasParking={hasParking}
            setHasParking={setHasParking}
            hasWifi={hasWifi}
            setHasWifi={setHasWifi}
            allowsPhotography={allowsPhotography}
            setAllowsPhotography={setAllowsPhotography}
          />
        </div>

        {/* Content area - conditional container */}
        {viewMode === "list" ? (
          <div className="px-4">
            {renderContent()}
          </div>
        ) : (
          <div className="container mx-auto px-4 pb-6">
            {renderContent()}
          </div>
        )}
      </main>

      <GlobalFooter />
    </div>
  );
};

export default Index;
