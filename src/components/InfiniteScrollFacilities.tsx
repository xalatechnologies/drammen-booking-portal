
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { FacilityCard } from './facility/FacilityCard';
import FacilityListItem from './facility/FacilityListItem';
import ViewHeader from './search/ViewHeader';
import { Facility, FacilityFilters } from '@/types/facility';
import { getFilteredMockFacilities } from '@/mocks/facilityMockData';

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
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [allFacilities, setAllFacilities] = useState<Facility[]>([]);
  const ITEMS_PER_PAGE = 6;

  console.log('InfiniteScrollFacilities - Rendering with filters:', filters);
  console.log('InfiniteScrollFacilities - Current viewMode:', viewMode);
  console.log('InfiniteScrollFacilities - allFacilities count:', allFacilities.length);

  // Get all filtered facilities from mock data
  const allFilteredFacilities = useMemo(() => {
    // Convert filters to the format expected by getFilteredMockFacilities
    const mockFilters: Parameters<typeof getFilteredMockFacilities>[0] = {
      searchTerm: filters.searchTerm,
      facilityType: filters.facilityType,
      location: filters.location,
      capacity: filters.capacity,
      accessibility: filters.accessibility,
      availableNow: filters.availableNow,
      hasEquipment: filters.amenities?.includes('av-equipment'),
      hasParking: filters.amenities?.includes('parking'),
      hasWifi: filters.amenities?.includes('wifi'),
      allowsPhotography: filters.amenities?.includes('photography'),
      // Convert priceRange object to array if it exists
      ...(filters.priceRange ? {
        priceRange: [filters.priceRange.min, filters.priceRange.max]
      } : {})
    };
    
    return getFilteredMockFacilities(mockFilters);
  }, [filters]);

  // Memoize the filter string to detect changes
  const filterString = useMemo(() => JSON.stringify(filters), [filters]);

  // Reset when filters change
  useEffect(() => {
    console.log('InfiniteScrollFacilities - Filters changed, resetting to page 1');
    setAllFacilities([]);
    setCurrentPage(1);
  }, [filterString]);

  // Load facilities based on current page
  useEffect(() => {
    const loadFacilities = async () => {
      setIsLoading(true);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
      const endIndex = currentPage * ITEMS_PER_PAGE;
      const paginatedFacilities = allFilteredFacilities.slice(startIndex, endIndex);
      
      setAllFacilities(paginatedFacilities);
      setIsLoading(false);
    };
    
    loadFacilities();
  }, [currentPage, allFilteredFacilities]);

  // Calculate if there are more facilities to load
  const hasMore = useMemo(() => {
    return allFacilities.length < allFilteredFacilities.length;
  }, [allFacilities, allFilteredFacilities]);

  const loadMore = useCallback(() => {
    if (!isLoading && hasMore) {
      console.log('InfiniteScrollFacilities - Loading more, current page:', currentPage);
      setCurrentPage(prevPage => prevPage + 1);
    }
  }, [isLoading, hasMore, currentPage]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop
        >= document.documentElement.offsetHeight - 1000
      ) {
        loadMore();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loadMore]);

  const handleAddressClick = useCallback((e: React.MouseEvent, facility: Facility) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Address clicked for facility:", facility.name);
    // Additional logic for address click, e.g., show on map
  }, []);

  console.log('InfiniteScrollFacilities - Render state:', {
    allFacilitiesCount: allFacilities.length,
    isLoading,
    hasMore,
    currentPage,
    viewMode
  });

  return (
    <div className="w-full">
      <ViewHeader 
        facilityCount={allFilteredFacilities.length} 
        viewMode={viewMode} 
        setViewMode={setViewMode}
        isLoading={isLoading}
      />

      {isLoading && allFacilities.length === 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <div 
              key={`skeleton-${index}`} 
              className="bg-white rounded-lg shadow-md p-4 h-80 animate-pulse"
            >
              <div className="bg-gray-200 h-40 rounded-md mb-4"></div>
              <div className="bg-gray-200 h-6 rounded-md mb-2 w-3/4"></div>
              <div className="bg-gray-200 h-4 rounded-md mb-2 w-1/2"></div>
              <div className="bg-gray-200 h-4 rounded-md mb-2 w-2/3"></div>
              <div className="bg-gray-200 h-4 rounded-md w-1/4"></div>
            </div>
          ))}
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {allFacilities.map((facility) => (
            <FacilityCard 
              key={facility.id} 
              facility={facility} 
              onAddressClick={(e) => handleAddressClick(e, facility)}
            />
          ))}
          {isLoading && (
            <>
              {Array.from({ length: 3 }).map((_, index) => (
                <div 
                  key={`loading-${index}`} 
                  className="bg-white rounded-lg shadow-md p-4 h-80 animate-pulse"
                >
                  <div className="bg-gray-200 h-40 rounded-md mb-4"></div>
                  <div className="bg-gray-200 h-6 rounded-md mb-2 w-3/4"></div>
                  <div className="bg-gray-200 h-4 rounded-md mb-2 w-1/2"></div>
                  <div className="bg-gray-200 h-4 rounded-md mb-2 w-2/3"></div>
                  <div className="bg-gray-200 h-4 rounded-md w-1/4"></div>
                </div>
              ))}
            </>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-4 mt-6">
          {allFacilities.map((facility) => (
            <FacilityListItem 
              key={facility.id} 
              facility={facility} 
              onAddressClick={(e) => handleAddressClick(e, facility)}
            />
          ))}
          {isLoading && (
            <>
              {Array.from({ length: 3 }).map((_, index) => (
                <div 
                  key={`loading-list-${index}`} 
                  className="bg-white rounded-lg shadow-md p-4 h-24 animate-pulse flex"
                >
                  <div className="bg-gray-200 h-full w-24 rounded-md mr-4"></div>
                  <div className="flex-1">
                    <div className="bg-gray-200 h-6 rounded-md mb-2 w-3/4"></div>
                    <div className="bg-gray-200 h-4 rounded-md mb-2 w-1/2"></div>
                    <div className="bg-gray-200 h-4 rounded-md w-2/3"></div>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
};
