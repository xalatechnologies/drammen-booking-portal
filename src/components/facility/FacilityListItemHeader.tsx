
import React from "react";
import { Heart, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FacilityListItemHeaderProps {
  facilityName: string;
  isFavorited: boolean;
  onFavorite: (e: React.MouseEvent) => void;
  onShare: (e: React.MouseEvent) => void;
}

export function FacilityListItemHeader({
  facilityName,
  isFavorited,
  onFavorite,
  onShare
}: FacilityListItemHeaderProps) {
  return (
    <div className="mb-3">
      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-1">
        {facilityName}
      </h3>
      
      {/* Action Buttons */}
      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 w-8 p-0 hover:bg-gray-100 rounded-full focus:ring-2 focus:ring-blue-500 focus:ring-offset-2" 
          onClick={onFavorite} 
          aria-label={isFavorited ? "Fjern fra favoritter" : "Legg til favoritter"}
        >
          <Heart className={`h-3 w-3 ${isFavorited ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 w-8 p-0 hover:bg-gray-100 rounded-full focus:ring-2 focus:ring-blue-500 focus:ring-offset-2" 
          onClick={onShare} 
          aria-label="Del lokale"
        >
          <Share2 className="h-3 w-3 text-gray-400" />
        </Button>
      </div>
    </div>
  );
}
