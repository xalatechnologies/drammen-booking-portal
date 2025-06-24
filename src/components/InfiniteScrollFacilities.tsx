
import React, { useState, useEffect, useMemo } from 'react';
import { FacilityCard } from './facility/FacilityCard';
import FacilityListItem from './facility/FacilityListItem';
import ViewHeader from './search/ViewHeader';
import { FacilityFilters } from '@/types/facility';
import { useFacilities } from '@/hooks/useFacilities';
import { Button } from '@/components/ui/button';

interface InfiniteScrollFacilitiesProps {
  filters: FacilityFilters;
  viewMode: "grid" | "list";
  setViewMode?: (mode: "grid" | "map" | "calendar" | "list") => void;
}

// Fallback images from public/bilder directory
const FALLBACK_IMAGES = [
  '/bilder/Ankerskogen_svoemmehall1.jpg',
  '/bilder/Bergsjöns_kulturhus_sett_från_Bergsjöns_centrum.jpg',
  '/bilder/Elverum_svømmehall.jpg',
  '/bilder/Hamar_kulturhus_I.jpg',
  '/bilder/Mollebakken-skole.jpg',
  '/bilder/Nesøya_skole_og_idrettshall_Asker.jpg',
  '/bilder/standard_compressed_Kulturhuset_1200px.jpg',
  '/bilder/standard_compressed_drammensbadet_71.jpg'
];

export const InfiniteScrollFacilities: React.FC<InfiniteScrollFacilitiesProps> = ({
  filters,
  viewMode,
  setViewMode
}) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [allFacilities, setAllFacilities] = useState<any[]>([]);
  const ITEMS_PER_PAGE = 12;

  console.log('InfiniteScrollFacilities - Rendering with filters:', filters);
  console.log('InfiniteScrollFacilities - Current viewMode:', viewMode);

  // Use the DAL layer to fetch facilities
  const { facilities: rawFacilities, isLoading, pagination } = useFacilities({
    pagination: { page: currentPage, limit: ITEMS_PER_PAGE },
    filters,
  });

  // Transform facilities to ensure they have the right structure
  const transformedFacilities = useMemo(() => {
    return rawFacilities.map((facility, index) => {
      // Use local fallback image if no image_url
      const fallbackImage = FALLBACK_IMAGES[index % FALLBACK_IMAGES.length];
      const imageUrl = facility.image_url || fallbackImage;

      // Ensure we have all required properties with proper defaults
      return {
        ...facility,
        image: imageUrl,
        image_url: imageUrl,
        openingHours: facility.openingHours || [],
        address: facility.address || 'Address not available',
        nextAvailable: facility.nextAvailable || 'Available now',
        accessibility: facility.accessibility || [],
        suitableFor: facility.suitableFor || [],
        equipment: facility.equipment || [],
        availableTimes: facility.availableTimes || []
      };
    });
  }, [rawFacilities]);

  const filterString = useMemo(() => JSON.stringify(filters), [filters]);

  // Reset when filters change
  useEffect(() => {
    console.log('Filters changed, resetting facilities and page');
    setCurrentPage(1);
    setAllFacilities([]);
  }, [filterString]);

  // Accumulate facilities when new data comes in
  useEffect(() => {
    if (transformedFacilities.length > 0) {
      if (currentPage === 1) {
        // First page - replace all facilities
        console.log('Setting new facilities for page 1:', transformedFacilities.length);
        setAllFacilities(transformedFacilities);
      } else {
        // Subsequent pages - append to existing
        console.log('Appending facilities for page', currentPage, ':', transformedFacilities.length);
        setAllFacilities(prev => {
          const existingIds = new Set(prev.map(f => f.id));
          const newFacilities = transformedFacilities.filter(f => !existingIds.has(f.id));
          return [...prev, ...newFacilities];
        });
      }
    }
  }, [transformedFacilities, currentPage]);

  const hasMore = useMemo(() => {
    return pagination?.hasNext || false;
  }, [pagination]);

  const loadMore = () => {
    if (!isLoading && hasMore) {
      console.log('Loading more, moving to page:', currentPage + 1);
      setCurrentPage(prev => prev + 1);
    }
  };

  const handleAddressClick = (e: React.MouseEvent, facility: any) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Address clicked for facility:", facility.name);
  };

  const totalFacilities = pagination?.total || 0;

  console.log('Render state:', {
    allFacilitiesCount: allFacilities.length,
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
        isLoading={isLoading && currentPage === 1}
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
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {allFacilities.map((facility) => (
              <FacilityCard 
                key={facility.id} 
                facility={facility} 
                onAddressClick={(e) => handleAddressClick(e, facility)}
              />
            ))}
          </div>
          
          {hasMore && (
            <div className="flex justify-center mt-8">
              <Button 
                onClick={loadMore}
                disabled={isLoading}
                variant="outline"
                size="lg"
              >
                {isLoading ? 'Loading...' : 'Load More Facilities'}
              </Button>
            </div>
          )}
        </>
      ) : (
        <>
          <div className="flex flex-col gap-4 mt-6">
            {allFacilities.map((facility) => (
              <FacilityListItem 
                key={facility.id} 
                facility={facility}
              />
            ))}
          </div>
          
          {hasMore && (
            <div className="flex justify-center mt-8">
              <Button 
                onClick={loadMore}
                disabled={isLoading}
                variant="outline"
                size="lg"
              >
                {isLoading ? 'Loading...' : 'Load More Facilities'}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};
