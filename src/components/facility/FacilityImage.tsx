
import React from "react";
import { Badge } from "@/components/ui/badge";

interface FacilityImageProps {
  image: string;
  name: string;
  type: string;
}

const FacilityImage: React.FC<FacilityImageProps> = ({ image, name, type }) => {
  return (
    <div className="w-72 h-full bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden flex-shrink-0 rounded-l-lg">
      <img 
        src={image} 
        alt={name} 
        className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110 group-hover:brightness-110"
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.src = "https://images.unsplash.com/photo-1525361147853-4bf9f54a0e98?w=600&auto=format&fit=crop";
          target.onerror = null;
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="absolute top-4 right-4">
        <Badge className="bg-white/95 backdrop-blur-sm text-slate-700 border-0 font-semibold text-sm px-3 py-1.5 shadow-lg">
          {type}
        </Badge>
      </div>
    </div>
  );
};

export default FacilityImage;
