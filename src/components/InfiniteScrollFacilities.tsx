
import React from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { FacilityCard } from '@/components/facility/FacilityCard';
import { Facility } from '@/types/facility';

interface InfiniteScrollFacilitiesProps {
  facilities: Facility[];
  hasMore: boolean;
  fetchMore: () => void;
  className?: string;
}

export function InfiniteScrollFacilities({
  facilities = [],
  hasMore,
  fetchMore,
  className = ''
}: InfiniteScrollFacilitiesProps) {
  const handleAddressClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('Address clicked');
  };

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
