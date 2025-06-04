
import React from "react";
import { Badge } from "@/components/ui/badge";

interface FacilityImageProps {
  image: string;
  name: string;
  type: string;
}

const FacilityImage: React.FC<FacilityImageProps> = ({ image, name, type }) => {
  return (
    <div className="w-48 h-full bg-gray-200 relative overflow-hidden flex-shrink-0">
      <img 
        src={image} 
        alt={name} 
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.src = "https://images.unsplash.com/photo-1525361147853-4bf9f54a0e98?w=600&auto=format&fit=crop";
          target.onerror = null;
        }}
      />
      <div className="absolute top-2 right-2">
        <Badge className="bg-white/90 backdrop-blur-sm text-gray-800 border-0 font-medium text-xs px-2 py-1 shadow-sm">
          {type}
        </Badge>
      </div>
    </div>
  );
};

export default FacilityImage;
