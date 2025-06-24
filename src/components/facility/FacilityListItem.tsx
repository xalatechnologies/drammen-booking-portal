
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
  return (
    <div 
      className="bg-white rounded-lg shadow-sm border p-4 cursor-pointer hover:shadow-md transition-shadow"
      onClick={onClick}
    >
      <div className="flex gap-4">
        <FacilityListItemImage facility={facility} />
        <FacilityListItemContent facility={facility} />
      </div>
    </div>
  );
}
