
import React from 'react';

interface FacilityCardImageProps {
  facility: any;
  className?: string;
}

export function FacilityCardImage({ facility, className = '' }: FacilityCardImageProps) {
  const imageUrl = facility.facility_images?.find((img: any) => img.is_featured)?.image_url || 
                   facility.image_url || 
                   '/bilder/standard_compressed_Kulturhuset_1200px.jpg';

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <img
        src={imageUrl}
        alt={facility.name}
        className="w-full h-full object-cover"
        onError={(e) => {
          e.currentTarget.src = '/bilder/standard_compressed_Kulturhuset_1200px.jpg';
        }}
      />
    </div>
  );
}
