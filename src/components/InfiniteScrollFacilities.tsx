
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { FacilityCard } from './facility/FacilityCard';
import FacilityListItem from './facility/FacilityListItem';
import ViewHeader from './search/ViewHeader';
import { FacilityFilters } from '@/types/facility';
import { useFacilities } from '@/hooks/useFacilities';

// Local interface that matches what we actually need for display
interface DisplayFacility {
  id: number;
  name: string;
  address: string;
  type: string;
  image: string;
  nextAvailable: string;
  capacity: number;
  accessibility: string[];
  area: string;
  suitableFor: string[];
  equipment: string[];
  openingHours: string; // Keep as string for compatibility
  description: string;
  availableTimes?: {
    date: Date;
    slots: {
      start: string;
      end: string;
      available: boolean;
    }[];
  }[];
}

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
  const ITEMS_PER_PAGE = 6;

  console.log('InfiniteScrollFacilities - Rendering with filters:', filters);
  console.log('InfiniteScrollFacilities - Current viewMode:', viewMode);

  // Use the DAL layer to fetch facilities
  const { facilities: rawFacilities, isLoading, pagination } = useFacilities({
    pagination: { page: currentPage, limit: ITEMS_PER_PAGE },
    filters,
  });

  // Transform facilities to match display interface
  const facilities = useMemo(() => {
    return rawFacilities.map((facility, index): DisplayFacility => {
      // Compute address from components
      const addressParts = [
        facility.address_street,
        facility.address_city,
        facility.address_postal_code
      ].filter(part => part && part.trim() !== '');
      
      const address = addressParts.length > 0 
        ? addressParts.join(', ') 
        : 'Address not available';

      // Use local fallback image if no image_url
      const fallbackImage = FALLBACK_IMAGES[index % FALLBACK_IMAGES.length];
      const image = facility.image_url || fallbackImage;

      return {
        id: facility.id,
        name: facility.name,
        address,
        type: facility.type,
        image,
        nextAvailable: facility.next_available || 'Available now',
        capacity: facility.capacity,
        accessibility: facility.accessibility_features || [],
        area: facility.area || `${facility.area_sqm || 100}m²`,
        suitableFor: [], // Will be inferred from type
        equipment: facility.equipment || [],
        openingHours: '06:00-23:00', // Default string for compatibility
        description: facility.description || `En flott ${facility.type.toLowerCase()} i Drammen.`,
        availableTimes: []
      };
    });
  }, [rawFacilities]);

  console.log('InfiniteScrollFacilities - Transformed facilities:', facilities);
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

  const handleAddressClick = useCallback((e: React.MouseEvent, facility: DisplayFacility) => {
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
