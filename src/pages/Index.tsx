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

console.log("Index component loaded");

const Index = () => {
  console.log("Index component rendering");
  
  const [searchParams, setSearchParams] = useSearchParams();
  const [date, setDate] = useState<Date>();
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [facilityType, setFacilityType] = useState<string>("all");
  const [location, setLocation] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "map" | "calendar" | "list">("grid");
  const [accessibility, setAccessibility] = useState<string>("all");
  const [capacity, setCapacity] = useState<number[]>([0, 200]);

  console.log("State initialized", { facilityType, location, viewMode });

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

  console.log("About to render JSX");

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

      <main 
        id="main-content" 
        className="container mx-auto px-4 py-6 max-w-7xl flex-grow"
        role="main"
        aria-label="Hovedinnhold - Booking av kommunale lokaler"
      >
        {/* Hero section */}
        <section aria-labelledby="hero-heading">
          <h1 id="hero-heading" className="sr-only">
            Drammen Kommune Lokalbooking
          </h1>
          <HeroBanner />
        </section>

        {/* Search and filter section */}
        <section 
          aria-labelledby="search-heading"
          className="mb-6"
        >
          <h2 id="search-heading" className="sr-only">
            Søk og filtrer lokaler
          </h2>
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
        </section>
        
        {/* Results section */}
        <section 
          aria-labelledby="results-heading"
          aria-live="polite"
          aria-atomic="false"
        >
          <h2 id="results-heading" className="sr-only">
            Søkeresultater for lokaler
          </h2>
          
          {viewMode === "grid" && (
            <div role="region" aria-label="Rutenettoversikt over lokaler">
              <FacilityGrid 
                date={date}
                facilityType={facilityType === "all" ? "" : facilityType}
                location={location === "all" ? "" : location}
                accessibility={accessibility === "all" ? "" : accessibility}
                capacity={capacity}
              />
            </div>
          )}
          
          {viewMode === "list" && (
            <div role="region" aria-label="Listeoversikt over lokaler">
              <FacilityList 
                date={date}
                facilityType={facilityType === "all" ? "" : facilityType}
                location={location === "all" ? "" : location}
              />
            </div>
          )}
          
          {viewMode === "map" && (
            <div role="region" aria-label="Kartoversikt over lokaler">
              <MapView 
                facilityType={facilityType === "all" ? "" : facilityType} 
                location={location === "all" ? "" : location} 
              />
            </div>
          )}
          
          {viewMode === "calendar" && (
            <div role="region" aria-label="Kalenderoversikt over tilgjengelighet">
              <CalendarView 
                date={date}
                facilityType={facilityType === "all" ? "" : facilityType}
                location={location === "all" ? "" : location}
                accessibility={accessibility === "all" ? "" : accessibility}
                capacity={capacity}
              />
            </div>
          )}
        </section>
        
        {/* Pagination section */}
        {(viewMode === "grid" || viewMode === "list") && (
          <section 
            aria-labelledby="pagination-heading"
            className="mt-8"
          >
            <h2 id="pagination-heading" className="sr-only">
              Navigasjon mellom sider med resultater
            </h2>
            <PaginationControls />
          </section>
        )}
      </main>

      <GlobalFooter />
    </div>
  );
};

export default Index;
