
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useFacilities } from '@/hooks/useFacilities';
import { FacilityCard } from './facility/FacilityCard';
import FacilityListItem from './facility/FacilityListItem';
import ViewHeader from './search/ViewHeader';
import { FacilityFilters } from '@/types/facility';

interface InfiniteScrollFacilitiesProps {
  filters: FacilityFilters;
  viewMode: "grid" | "list";
  setViewMode?: (mode: "grid" | "map" | "calendar" | "list") => void;
}

export const InfiniteScrollFacilities: React.FC<InfiniteScrollFacilitiesProps> = ({
  filters,
  viewMode,
  setViewMode
}) => {
  const [allFacilities, setAllFacilities] = useState<any[]>([]);

  console.log('InfiniteScrollFacilities - Rendering with filters:', filters);
  console.log('InfiniteScrollFacilities - Current viewMode:', viewMode);
  console.log('InfiniteScrollFacilities - allFacilities count:', allFacilities.length);

  const { data: facilities, isLoading, error } = useFacilities();

  // Update facilities when data changes
  useEffect(() => {
    if (!isLoading && facilities && Array.isArray(facilities)) {
      console.log('InfiniteScrollFacilities - Processing facilities data:', facilities.length);
      
      // Apply client-side filtering based on the filters
      let filteredFacilities = facilities;
      
      if (filters.searchTerm) {
        filteredFacilities = filteredFacilities.filter(facility =>
          facility.name.toLowerCase().includes(filters.searchTerm!.toLowerCase()) ||
          facility.description?.toLowerCase().includes(filters.searchTerm!.toLowerCase())
        );
      }
      
      if (filters.facilityType && filters.facilityType !== 'all') {
        filteredFacilities = filteredFacilities.filter(facility =>
          facility.type === filters.facilityType
        );
      }
      
      if (filters.location && filters.location !== 'all') {
        filteredFacilities = filteredFacilities.filter(facility =>
          facility.area.includes(filters.location!)
        );
      }
      
      if (filters.capacity) {
        const [min, max] = filters.capacity;
        filteredFacilities = filteredFacilities.filter(facility =>
          facility.capacity >= min && facility.capacity <= max
        );
      }

      setAllFacilities(filteredFacilities);
    }
  }, [facilities, isLoading, filters]);

  const handleAddressClick = (e: React.MouseEvent, facility: any) => {
    e.stopPropagation();
    console.log('Address clicked for facility:', facility.name);
  };

  console.log('InfiniteScrollFacilities - Render state:', {
    allFacilitiesCount: allFacilities.length,
    isLoading,
    facilitiesFromAPI: facilities?.length || 0,
    viewMode
  });

  // Get total count from filtered facilities
  const facilityCount = allFacilities.length;

  return (
    <div>
      {/* ViewHeader component */}
      <ViewHeader 
        facilityCount={facilityCount}
        isLoading={isLoading}
        viewMode={viewMode}
        setViewMode={setViewMode || (() => {})}
      />

      {/* Loading state for first load */}
      {isLoading && allFacilities.length === 0 && (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="text-center py-8 text-red-500">
          Error loading facilities: {error.message}
        </div>
      )}

      {/* No results state */}
      {!isLoading && !error && allFacilities.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No facilities found matching your criteria
        </div>
      )}

      {/* Facilities list */}
      {allFacilities.length > 0 && (
        <>
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allFacilities.map((facility) => (
                <FacilityCard 
                  key={facility.id} 
                  facility={facility} 
                  onAddressClick={handleAddressClick}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {allFacilities.map((facility) => (
                <FacilityListItem key={facility.id} facility={facility} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};
