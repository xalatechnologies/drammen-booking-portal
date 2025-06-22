import React from "react";
import { Facility } from "@/features/facility/types/facility";

/**
 * FacilityListItemImage Props Interface
 * Following Interface Segregation Principle with focused props interface
 */
interface FacilityListItemImageProps {
  facility: Facility;
}

/**
 * FacilityListItemImage Component
 * 
 * Responsible solely for rendering the image section of a facility list item
 * Following Single Responsibility Principle by focusing only on image display
 */
export function FacilityListItemImage({ facility }: FacilityListItemImageProps) {
  // Select the featured image or the first image, or fallback to placeholder
  const imageUrl = 
    facility.featuredImage?.image_url || 
    facility.images?.[0]?.image_url || 
    "/images/placeholder-facility.jpg";

  return (
    <div className="relative w-full md:w-64 h-48 flex-shrink-0">
      <img
        src={imageUrl}
        alt={facility.name.NO || facility.name.EN}
        className="w-full h-full object-cover"
      />
      
      {/* Status indicator if relevant */}
      {facility.status === 'maintenance' && (
        <div className="absolute bottom-0 left-0 right-0 bg-yellow-500 bg-opacity-90 text-white text-xs font-medium text-center py-1">
          Under vedlikehold
        </div>
      )}
      
      {facility.status === 'inactive' && (
        <div className="absolute bottom-0 left-0 right-0 bg-gray-500 bg-opacity-90 text-white text-xs font-medium text-center py-1">
          Ikke tilgjengelig
        </div>
      )}
    </div>
  );
}
