
import React, { useState } from "react";
import { HeroBanner } from "@/components/HeroBanner";
import { SearchFilter } from "@/components/SearchFilter";
import { FacilityGrid } from "@/components/FacilityGrid";
import { FacilityList } from "@/components/FacilityList";
import MapView from "@/components/MapView";
import { CalendarView } from "@/components/calendar/CalendarView";
import { PaginationControls } from "@/components/PaginationControls";
import { useFacilitiesPagination } from "@/hooks/useFacilities";
import { useSearchContext } from "@/contexts/SearchContext";

const Index = () => {
  const [viewMode, setViewMode] = useState<"grid" | "list" | "map" | "calendar">("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const { searchTerm, facilityType, location } = useSearchContext();
  
  const { data: paginatedData, isLoading, error } = useFacilitiesPagination(currentPage, 12);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <p className="text-red-600">Error loading facilities. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <HeroBanner />
      
      <div className="container mx-auto px-4 py-8">
        <SearchFilter 
          viewMode={viewMode} 
          setViewMode={setViewMode}
        />
        
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            {viewMode === "grid" && (
              <FacilityGrid facilities={paginatedData?.data || []} />
            )}
            {viewMode === "list" && (
              <FacilityList facilities={paginatedData?.data || []} />
            )}
            {viewMode === "map" && <MapView />}
            {viewMode === "calendar" && <CalendarView />}
            
            {viewMode !== "map" && viewMode !== "calendar" && paginatedData?.pagination && (
              <PaginationControls
                currentPage={currentPage}
                totalPages={paginatedData.pagination.totalPages}
                onPageChange={setCurrentPage}
                hasNext={paginatedData.pagination.hasNext}
                hasPrev={paginatedData.pagination.hasPrev}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Index;
