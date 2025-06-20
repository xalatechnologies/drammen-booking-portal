
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
  const { pagination, nextPage } = useFacilitiesPagination(1, 6);
  const [allFacilities, setAllFacilities] = useState<any[]>([]);
  const [hasMore, setHasMore] = useState(true);

  console.log('InfiniteScrollFacilities - Rendering with filters:', filters);

  const { facilities, isLoading, pagination: paginationInfo } = useFacilities({
    pagination,
    filters,
  });

  // Memoize the effect dependencies to prevent infinite loops
  const filterString = JSON.stringify(filters);
  const currentPage = pagination.page;

  useEffect(() => {
    console.log('InfiniteScrollFacilities - useEffect triggered', {
      page: currentPage,
      facilitiesLength: facilities.length,
      isLoading
    });

    if (currentPage === 1) {
      // Reset on first page or filter change
      setAllFacilities(facilities);
    } else if (facilities.length > 0) {
      // Append new facilities for subsequent pages
      setAllFacilities(prev => {
        const newFacilities = facilities.filter(facility => 
          !prev.some(existing => existing.id === facility.id)
        );
        return [...prev, ...newFacilities];
      });
    }

    // Update hasMore based on pagination info
    if (paginationInfo) {
      setHasMore(paginationInfo.hasNext);
    }
  }, [facilities, currentPage, isLoading, paginationInfo?.hasNext]);

  // Reset when filters change
  useEffect(() => {
    console.log('InfiniteScrollFacilities - Filters changed, resetting');
    setAllFacilities([]);
    setHasMore(true);
  }, [filterString]);

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
    // Handle address click logic here
    console.log('Address clicked for facility:', facility.name);
  };

  console.log('InfiniteScrollFacilities - Current state:', {
    allFacilitiesCount: allFacilities.length,
    isLoading,
    hasMore,
    currentPage
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
