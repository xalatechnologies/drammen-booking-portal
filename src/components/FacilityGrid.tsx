
import React from 'react';
import { FacilityCard } from '@/components/facility/FacilityCard';
import { Facility } from '@/types/facility';

interface FacilityGridProps {
  facilities: Facility[];
  className?: string;
}

export function FacilityGrid({ facilities = [], className = '' }: FacilityGridProps) {
  const handleAddressClick = (e: React.MouseEvent, facility: Facility) => {
    e.stopPropagation();
    console.log('Address clicked for facility:', facility.name);
  };

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ${className}`}>
      {facilities.map((facility) => (
        <FacilityCard
          key={facility.id}
          facility={facility}
        />
      ))}
    </div>
  );
}
