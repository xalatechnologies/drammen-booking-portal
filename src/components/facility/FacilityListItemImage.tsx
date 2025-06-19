
import React from "react";
import { Badge } from "@/components/ui/badge";

interface FacilityListItemImageProps {
  image: string;
  facilityName: string;
  facilityType: string;
  area: string;
}

export function FacilityListItemImage({
  image,
  facilityName,
  facilityType,
  area
}: FacilityListItemImageProps) {
  return (
    <div className="h-full w-full relative overflow-hidden">
      <img 
        src={image} 
        alt={`Bilde av ${facilityName}`} 
        className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110" 
        onError={(e) => {
          const target = e.target as HTMLImageElement;
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
