import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { useLocalization } from "@/core/localization/hooks/useLocalization";
import { Facility } from "@/features/facility/types/facility";
import { Heart, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

/**
 * FacilityCard Props Interface
 * Following Interface Segregation Principle with focused props interface
 */
interface FacilityCardProps {
  facility: Facility;
}

/**
 * FacilityCard Component
 * 
 * Responsible for rendering a facility in card format for grid view
 * Following Single Responsibility Principle by focusing only on card presentation
 */
export function FacilityCard({ facility }: FacilityCardProps) {
  const navigate = useNavigate();
  const { translate } = useLocalization();
  const [isFavorited, setIsFavorited] = useState(false);
  
  // Navigation handler
  const handleCardClick = () => {
    navigate(`/facilities/${facility.id}`);
  };

  // Share handler with proper event propagation control
  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: facility.name.NO || facility.name.EN,
        url: `${window.location.origin}/facilities/${facility.id}`,
      });
    }
  };

  // Favorite toggle handler with proper event propagation control
  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFavorited(!isFavorited);
  };

  return (
    <Card 
      className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow h-full flex flex-col"
      onClick={handleCardClick}
    >
      {/* Card image section */}
      <div className="relative">
        <img
          src={facility.images?.[0]?.image_url || "/images/placeholder-facility.jpg"}
          alt={facility.name.NO || facility.name.EN}
          className="w-full h-48 object-cover"
        />
        
        {/* Action buttons overlaid on image */}
        <div className="absolute top-2 right-2 flex space-x-2">
          <Button
            variant="secondary"
            size="icon"
            className="h-8 w-8 rounded-full bg-white bg-opacity-80 hover:bg-opacity-100"
            onClick={handleFavoriteToggle}
          >
            <Heart
              className={`h-4 w-4 ${isFavorited ? "fill-red-500 text-red-500" : "text-gray-600"}`}
            />
            <span className="sr-only">
              {isFavorited ? translate('facility.unfavorite') : translate('facility.favorite')}
            </span>
          </Button>
          
          <Button
            variant="secondary"
            size="icon"
            className="h-8 w-8 rounded-full bg-white bg-opacity-80 hover:bg-opacity-100"
            onClick={handleShare}
          >
            <Share2 className="h-4 w-4 text-gray-600" />
            <span className="sr-only">{translate('facility.share')}</span>
          </Button>
        </div>
      </div>
      
      {/* Card content section */}
      <div className="p-4 flex-grow flex flex-col">
        {/* Facility type badge */}
        <div className="mb-1">
          <Badge variant="outline" className="text-xs text-gray-600">
            {facility.type}
          </Badge>
        </div>
        
        {/* Facility name */}
        <h3 className="text-lg font-semibold mb-1 line-clamp-2">
          {facility.name.NO || facility.name.EN}
        </h3>
        
        {/* Location */}
        <p className="text-sm text-gray-600 mb-3">
          {facility.address?.city}, {facility.address?.street}
        </p>
        
        {/* Features/amenities */}
        <div className="mt-auto space-y-2">
          <div className="flex items-center text-sm">
            <span className="font-medium">{translate('facility.capacity')}:</span>
            <span className="ml-1">{facility.capacity}</span>
          </div>
          
          {facility.pricePerHour && (
            <div className="flex items-center text-sm">
              <span className="font-medium">{translate('facility.pricePerHour')}:</span>
              <span className="ml-1">{facility.pricePerHour} kr</span>
            </div>
          )}
          
          {/* Next available time slot if present */}
          {facility.nextAvailable && (
            <p className="text-xs text-green-600 font-medium mt-2">
              {translate('facility.nextAvailable')}: {facility.nextAvailable}
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}
