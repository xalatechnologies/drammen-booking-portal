
import React, { useState, useEffect, useCallback, useMemo } from 'react';
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

  console.log('InfiniteScrollFacilities - Rendering with filters:', filters);
  console.log('InfiniteScrollFacilities - Current viewMode:', viewMode);
  console.log('InfiniteScrollFacilities - allFacilities count:', allFacilities.length);

  const { facilities, isLoading, pagination: paginationInfo } = useFacilities({
    pagination,
    filters,
  });

  // Memoize the filter string to detect changes
  const filterString = useMemo(() => JSON.stringify(filters), [filters]);

  // Reset when filters change
  useEffect(() => {
    console.log('InfiniteScrollFacilities - Filters changed, resetting to page 1');
    setAllFacilities([]);
    goToPage(1);
  }, [filterString, goToPage]);

  // Handle facility data updates - Fixed to use useEffect instead of useMemo
  useEffect(() => {
    if (!isLoading && facilities && Array.isArray(facilities)) {
      console.log('InfiniteScrollFacilities - Processing facilities data', {
        page: pagination.page,
        facilitiesLength: facilities.length,
        allFacilitiesLength: allFacilities.length
      });

      if (pagination.page === 1) {
        // For page 1, replace all facilities
        console.log('InfiniteScrollFacilities - Setting facilities for page 1:', facilities.length);
        setAllFacilities([...facilities]);
      } else {
        // For subsequent pages, append new facilities
        setAllFacilities(prev => {
          const newFacilities = facilities.filter(facility => 
            !prev.some(existing => existing.id === facility.id)
          );
          const updated = [...prev, ...newFacilities];
          console.log('InfiniteScrollFacilities - Appended facilities for page', pagination.page, ':', newFacilities.length);
          return updated;
        });
      }
    }
  }, [facilities, isLoading, pagination.page]);

  // Calculate hasMore based on pagination info
  const hasMore = useMemo(() => {
    return paginationInfo?.hasNext || false;
  }, [paginationInfo]);

  const loadMore = useCallback(() => {
    if (!isLoading && hasMore) {
      console.log('InfiniteScrollFacilities - Loading more, current page:', pagination.page);
      nextPage();
    }
  }, [isLoading, hasMore, pagination.page, nextPage]);

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

  console.log('InfiniteScrollFacilities - Render state:', {
    allFacilitiesCount: allFacilities.length,
    isLoading,
    hasMore,
    currentPage: pagination.page,
    facilitiesFromAPI: facilities?.length || 0,
    paginationTotal: paginationInfo?.total,
    viewMode
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

      {/* Loading state for first load */}
      {isLoading && allFacilities.length === 0 && (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      )}

      {/* No results state */}
      {!isLoading && allFacilities.length === 0 && (
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
      
      {/* Loading indicator for pagination */}
      {isLoading && allFacilities.length > 0 && (
        <div className="flex justify-center items-center h-16 mt-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )}
      
      {/* End of list indicator */}
      {!hasMore && allFacilities.length > 0 && (
        <div className="text-center py-4 text-gray-500">
          No more facilities to load
        </div>
      )}
    </div>
  );
};
