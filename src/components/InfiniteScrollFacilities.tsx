
import React, { useState, useEffect, useMemo } from 'react';
import { FacilityCard } from './facility/FacilityCard';
import FacilityListItem from './facility/FacilityListItem';
import ViewHeader from './search/ViewHeader';
import { FacilityFilters } from '@/types/facility';
import { useFacilities } from '@/hooks/useFacilities';
import { Button } from '@/components/ui/button';
import { transformFacilitiesForUI } from '@/utils/facilityTransforms';

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
  console.log('InfiniteScrollFacilities - Rendering with filters:', filters);
  console.log('InfiniteScrollFacilities - Current viewMode:', viewMode);

  // Use the simplified hook that returns all facilities
  const { data: rawFacilities = [], isLoading } = useFacilities();

  // Transform facilities to ensure they have the right structure
  const transformedFacilities = useMemo(() => {
    return transformFacilitiesForUI(rawFacilities);
  }, [rawFacilities]);

  const handleAddressClick = (e: React.MouseEvent, facility: any) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Address clicked for facility:", facility.name);
  };

  const totalFacilities = transformedFacilities.length;

  console.log('Render state:', {
    allFacilitiesCount: transformedFacilities.length,
    isLoading,
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

      {isLoading ? (
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
          {transformedFacilities.map((facility) => (
            <FacilityCard 
              key={facility.id} 
              facility={facility} 
              onAddressClick={(e) => handleAddressClick(e, facility)}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-4 mt-6">
          {transformedFacilities.map((facility) => (
            <FacilityListItem 
              key={facility.id} 
              facility={facility}
            />
          ))}
        </div>
      )}
    </div>
  );
};
