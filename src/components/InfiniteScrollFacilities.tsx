
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { FacilityCard } from './facility/FacilityCard';
import FacilityListItem from './facility/FacilityListItem';
import ViewHeader from './search/ViewHeader';
import { Facility, FacilityFilters } from '@/types/facility';
import { useFacilities } from '@/hooks/useFacilities';

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
  const ITEMS_PER_PAGE = 6;

  console.log('InfiniteScrollFacilities - Rendering with filters:', filters);
  console.log('InfiniteScrollFacilities - Current viewMode:', viewMode);

  // Use the DAL layer to fetch facilities
  const { facilities, isLoading, pagination } = useFacilities({
    pagination: { page: currentPage, limit: ITEMS_PER_PAGE },
    filters,
  });

  console.log('InfiniteScrollFacilities - Facilities from DAL:', facilities);
  console.log('InfiniteScrollFacilities - Pagination info:', pagination);

  const filterString = useMemo(() => JSON.stringify(filters), [filters]);

  useEffect(() => {
    console.log('InfiniteScrollFacilities - Filters changed, resetting to page 1');
    setCurrentPage(1);
  }, [filterString]);

  const hasMore = useMemo(() => {
    return pagination?.hasNext || false;
  }, [pagination]);

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
  }, []);

  const totalFacilities = pagination?.total || 0;

  console.log('InfiniteScrollFacilities - Render state:', {
    facilitiesCount: facilities.length,
    isLoading,
    hasMore,
    currentPage,
    viewMode,
    totalFacilities
  });

  return (
    <div className="w-full">
      <ViewHeader 
        facilityCount={totalFacilities} 
        viewMode={viewMode} 
        setViewMode={setViewMode}
        isLoading={isLoading}
      />

      {isLoading && facilities.length === 0 ? (
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
          {facilities.map((facility) => (
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
          {facilities.map((facility) => (
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
