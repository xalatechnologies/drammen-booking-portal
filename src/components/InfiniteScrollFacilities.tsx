
import React, { useState, useEffect, useCallback } from 'react';
import { useFacilities, useFacilitiesPagination } from '@/hooks/useFacilities';
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
  const { pagination, nextPage, goToPage } = useFacilitiesPagination(1, 6);
  const [allFacilities, setAllFacilities] = useState<any[]>([]);
  const [hasMore, setHasMore] = useState(true);

  console.log('InfiniteScrollFacilities - Rendering with filters:', filters);

  const { facilities, isLoading, pagination: paginationInfo } = useFacilities({
    pagination,
    filters,
  });

  // Memoize the filter string to detect changes
  const filterString = JSON.stringify(filters);
  const currentPage = pagination.page;

  // Reset when filters change
  useEffect(() => {
    console.log('InfiniteScrollFacilities - Filters changed, resetting to page 1');
    setAllFacilities([]);
    setHasMore(true);
    goToPage(1);
  }, [filterString, goToPage]);

  // Handle facility data updates - SIMPLIFIED LOGIC
  useEffect(() => {
    console.log('InfiniteScrollFacilities - Processing facilities data', {
      page: currentPage,
      facilitiesLength: facilities?.length || 0,
      isLoading,
      allFacilitiesLength: allFacilities.length,
      paginationHasNext: paginationInfo?.hasNext,
      facilitiesData: facilities
    });

    // Only process when we have facilities data and not loading
    if (!isLoading && facilities) {
      console.log('InfiniteScrollFacilities - Setting facilities data');
      
      if (currentPage === 1) {
        // For page 1, replace all facilities
        setAllFacilities([...facilities]);
        console.log('InfiniteScrollFacilities - Set facilities for page 1:', facilities.length);
      } else {
        // For subsequent pages, append new facilities
        setAllFacilities(prev => {
          const newFacilities = facilities.filter(facility => 
            !prev.some(existing => existing.id === facility.id)
          );
          const updated = [...prev, ...newFacilities];
          console.log('InfiniteScrollFacilities - Appended facilities for page', currentPage, ':', newFacilities.length);
          return updated;
        });
      }

      // Update hasMore based on pagination info
      if (paginationInfo) {
        setHasMore(paginationInfo.hasNext);
        console.log('InfiniteScrollFacilities - Updated hasMore:', paginationInfo.hasNext);
      }
    }
  }, [facilities, isLoading, currentPage, paginationInfo]);

  const loadMore = useCallback(() => {
    if (!isLoading && hasMore) {
      console.log('InfiniteScrollFacilities - Loading more, current page:', currentPage);
      nextPage();
    }
  }, [isLoading, hasMore, currentPage, nextPage]);

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

  const handleAddressClick = (e: React.MouseEvent, facility: any) => {
    e.stopPropagation();
    console.log('Address clicked for facility:', facility.name);
  };

  console.log('InfiniteScrollFacilities - Current state:', {
    allFacilitiesCount: allFacilities.length,
    isLoading,
    hasMore,
    currentPage,
    facilitiesFromAPI: facilities?.length || 0,
    paginationTotal: paginationInfo?.total
  });

  // Get total count from pagination info or fall back to current facilities count
  const facilityCount = paginationInfo?.total || allFacilities.length;

  return (
    <div>
      {/* ViewHeader component */}
      <ViewHeader 
        facilityCount={facilityCount}
        isLoading={isLoading}
        viewMode={viewMode}
        setViewMode={setViewMode || (() => {})}
      />

      {isLoading && allFacilities.length === 0 && (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      )}

      {!isLoading && allFacilities.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No facilities found matching your criteria
        </div>
      )}

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
      
      {isLoading && allFacilities.length > 0 && (
        <div className="flex justify-center items-center h-16 mt-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )}
      
      {!hasMore && allFacilities.length > 0 && (
        <div className="text-center py-4 text-gray-500">
          No more facilities to load
        </div>
      )}
    </div>
  );
};
