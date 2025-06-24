
import React from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { FacilityCard } from '@/components/facility/FacilityCard';
import { useFacilities } from '@/hooks/useFacilities';
import { transformFacilitiesForUI } from '@/utils/facilityTransforms';

interface InfiniteScrollFacilitiesProps {
  filters?: any;
  viewMode: "grid" | "list";
  setViewMode: (mode: "grid" | "map" | "calendar" | "list") => void;
  className?: string;
}

export function InfiniteScrollFacilities({
  filters,
  viewMode,
  setViewMode,
  className = ''
}: InfiniteScrollFacilitiesProps) {
  const { data: rawFacilities = [], isLoading } = useFacilities();
  
  // Ensure rawFacilities is an array before transforming
  const facilitiesArray = Array.isArray(rawFacilities) ? rawFacilities : [];
  const facilities = transformFacilitiesForUI(facilitiesArray);
  const hasMore = false; // Simplified - no pagination
  const fetchMore = () => {}; // Simplified - no pagination

  return (
    <InfiniteScroll
      dataLength={facilities.length}
      next={fetchMore}
      hasMore={hasMore}
      loader={<div className="text-center py-4">Loading more facilities...</div>}
      endMessage={<div className="text-center py-4 text-gray-500">No more facilities to show</div>}
      className={className}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {facilities.map((facility) => (
          <FacilityCard
            key={facility.id}
            facility={facility}
          />
        ))}
      </div>
    </InfiniteScroll>
  );
}
