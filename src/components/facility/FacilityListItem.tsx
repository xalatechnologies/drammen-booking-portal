
import React from 'react';
import { FacilityListItemImage } from './FacilityListItemImage';
import { FacilityListItemContent } from './FacilityListItemContent';

interface FacilityListItemProps {
  facility: {
    id: number;
    name: string;
    type: string;
    area: string;
    description?: string;
    address?: string;
    capacity?: number;
    pricePerHour?: number;
  };
  onClick?: () => void;
}

export function FacilityListItem({ facility, onClick }: FacilityListItemProps) {
  // Ensure required props are provided for FacilityListItemContent
  const contentProps = {
    id: facility.id,
    name: facility.name,
    type: facility.type,
    address: facility.address || `${facility.area}, Norway`,
    capacity: facility.capacity || 0,
    pricePerHour: facility.pricePerHour || 450,
    rating: undefined,
    nextAvailable: 'Available now'
  };

  return (
    <div 
      className="bg-white rounded-lg shadow-sm border p-4 cursor-pointer hover:shadow-md transition-shadow"
      onClick={onClick}
    >
      <div className="flex gap-4">
        <FacilityListItemImage facility={facility} />
        <FacilityListItemContent facility={contentProps} />
      </div>
    </div>
  );
}
