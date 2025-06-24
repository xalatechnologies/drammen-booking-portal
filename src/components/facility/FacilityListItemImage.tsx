
import React from 'react';

interface FacilityListItemImageProps {
  facility: {
    id: number;
    name: string;
    type: string;
    area: string;
  };
}

export function FacilityListItemImage({ facility }: FacilityListItemImageProps) {
  return (
    <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center">
      <span className="text-xs text-gray-500 text-center">
        {facility.name}
      </span>
    </div>
  );
}
