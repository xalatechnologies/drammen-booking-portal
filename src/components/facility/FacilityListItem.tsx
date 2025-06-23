
import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Users, Clock, Star, Heart, Share2, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FacilityListItemImage } from "./FacilityListItemImage";
import { useTranslation } from "@/i18n";
import { Facility } from "@/types/facility";

interface FacilityListItemProps {
  facility: Facility;
}

const FacilityListItem: React.FC<FacilityListItemProps> = ({ facility }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [isFavorited, setIsFavorited] = useState(false);

  const handleClick = useCallback(() => {
    navigate(`/facility/${facility.id}`);
  }, [facility.id, navigate]);

  const handleFavorite = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorited(!isFavorited);
  }, [isFavorited]);

  const handleShare = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: facility.name,
        text: facility.description || `Besøk ${facility.name}`,
        url: `${window.location.origin}/facility/${facility.id}`,
      });
    } else {
      navigator.clipboard.writeText(`${window.location.origin}/facility/${facility.id}`);
    }
  }, [facility]);

  const handleAddressClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Address clicked for facility:", facility.name);
    // Here you could open a map or do other address-related actions
  }, [facility.name]);

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-0 shadow-md hover:shadow-xl transform hover:-translate-y-1 bg-white">
      <CardContent className="p-0" onClick={handleClick}>
        <div className="flex h-32 sm:h-40">
          {/* Image Section */}
          <div className="w-32 sm:w-48 md:w-56 lg:w-64 flex-shrink-0">
            <div className="w-full h-full rounded-l-lg overflow-hidden">
              <FacilityListItemImage
                facilityId={facility.id}
                image={facility.image}
                facilityName={facility.name}
                facilityType={facility.type}
                area={facility.area}
              />
            </div>
          </div>

          {/* Content Section */}
          <div className="flex-1 p-4 sm:p-6 flex flex-col justify-between min-w-0">
            <div className="flex-1">
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 truncate group-hover:text-blue-600 transition-colors duration-200">
                    {facility.name}
                  </h3>
                  <div className="flex items-center text-gray-600 mt-1">
                    <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                    <span 
                      className="text-sm truncate hover:text-blue-600 cursor-pointer"
                      onClick={handleAddressClick}
                    >
                      {facility.address}
                    </span>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex gap-2 ml-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 w-8 p-0 hover:bg-gray-100" 
                    onClick={handleFavorite}
                  >
                    <Heart className={`h-4 w-4 ${isFavorited ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 w-8 p-0 hover:bg-gray-100" 
                    onClick={handleShare}
                  >
                    <Share2 className="h-4 w-4 text-gray-400" />
                  </Button>
                </div>
              </div>

              {/* Facility Info */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-600 mb-3">
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-1" />
                  <span>{facility.capacity} {t('facility.capacity')}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>{facility.nextAvailable}</span>
                </div>
                {facility.rating && (
                  <div className="flex items-center">
                    <Star className="h-4 w-4 mr-1 fill-yellow-400 text-yellow-400" />
                    <span>{facility.rating}</span>
                  </div>
                )}
              </div>

              {/* Description */}
              {facility.description && (
                <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                  {facility.description}
                </p>
              )}

              {/* Equipment/Features */}
              {facility.equipment && facility.equipment.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-2">
                  {facility.equipment.slice(0, 3).map((item, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {item}
                    </Badge>
                  ))}
                  {facility.equipment.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{facility.equipment.length - 3}
                    </Badge>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-gray-900">
                  {facility.pricePerHour || facility.price_per_hour} kr
                </span>
                <span className="text-sm text-gray-500">
                  /{t('facility.perHour')}
                </span>
              </div>
              <div className="flex items-center text-blue-600 text-sm font-medium group-hover:text-blue-700">
                <span className="mr-1">{t('facility.viewDetails')}</span>
                <ChevronRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform duration-200" />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FacilityListItem;
