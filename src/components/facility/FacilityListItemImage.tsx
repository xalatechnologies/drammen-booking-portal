
import React from "react";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { FacilityImageService } from "@/services/facilityImageService";

interface FacilityListItemImageProps {
  facilityId: number;
  image?: string; // Fallback for backward compatibility
  facilityName: string;
  facilityType: string;
  area: string;
}

export function FacilityListItemImage({
  facilityId,
  image,
  facilityName,
  facilityType,
  area
}: FacilityListItemImageProps) {
  // Get featured image from database
  const { data: featuredImage } = useQuery({
    queryKey: ['facility-featured-image', facilityId],
    queryFn: () => FacilityImageService.getFeaturedImage(facilityId),
  });

  // Fallback to first image if no featured image
  const { data: firstImage } = useQuery({
    queryKey: ['facility-first-image', facilityId],
    queryFn: () => FacilityImageService.getFirstImage(facilityId),
    enabled: !featuredImage,
  });

  // Get the image URL with fallbacks
  const imageUrl = featuredImage?.image_url || 
                   firstImage?.image_url || 
                   image || 
                   "https://images.unsplash.com/photo-1525361147853-4bf9f54a0e98?w=600&auto=format&fit=crop";

  const altText = featuredImage?.alt_text || 
                  firstImage?.alt_text || 
                  `Bilde av ${facilityName}`;

  console.log('FacilityListItemImage - Facility ID:', facilityId);
  console.log('FacilityListItemImage - Featured image:', featuredImage);
  console.log('FacilityListItemImage - First image:', firstImage);
  console.log('FacilityListItemImage - Final image URL:', imageUrl);

  return (
    <div className="h-full w-full relative overflow-hidden">
      <img 
        src={imageUrl} 
        alt={altText} 
        className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110" 
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          console.log('Image failed to load:', imageUrl);
          target.src = "https://images.unsplash.com/photo-1525361147853-4bf9f54a0e98?w=600&auto=format&fit=crop";
          target.onerror = null;
        }} 
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* Type Badge */}
      <div className="absolute top-4 right-4">
        <Badge className="bg-white/95 backdrop-blur-sm text-slate-700 border-0 font-semibold text-base px-4 py-2 shadow-lg">
          {facilityType}
        </Badge>
      </div>

      {/* Area Badge */}
      <div className="absolute top-4 left-4">
        <Badge variant="outline" className="bg-white/90 backdrop-blur-sm text-slate-700 border-slate-200 font-medium px-4 py-2 text-base shadow-sm">
          {area}
        </Badge>
      </div>
    </div>
  );
}
