import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Users, Clock, Star, Heart, Share2, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FacilityListItemImage } from "./FacilityListItemImage";
import { FacilityListItemMap } from "./FacilityListItemMap";
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
        <div className="flex h-48 sm:h-56 md:h-64">
          {/* Image Section - Left */}
          <div className="w-48 sm:w-64 md:w-72 lg:w-80 flex-shrink-0">
            <div className="w-full h-full rounded-l-lg overflow-hidden">
              <FacilityListItemImage
                facilityId={facility.id}
                facilityName={facility.name}
                facilityType={facility.type}
                area={facility.area}
              />
            </div>
          </div>

          {/* Content Section - Center */}
          <div className="flex-1 p-6 sm:p-8 flex flex-col justify-between min-w-0 mx-4">
            <div className="flex-1">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 truncate group-hover:text-blue-600 transition-colors duration-200 mb-2">
                    {facility.name}
                  </h3>
                  <div className="flex items-center text-gray-600 mt-2">
                    <MapPin className="h-5 w-5 mr-2 flex-shrink-0" />
                    <span 
                      className="text-base truncate hover:text-blue-600 cursor-pointer"
                      onClick={handleAddressClick}
                    >
                      {facility.address}
                    </span>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex gap-3 ml-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-10 w-10 p-0 hover:bg-gray-100" 
                    onClick={handleFavorite}
                  >
                    <Heart className={`h-5 w-5 ${isFavorited ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-10 w-10 p-0 hover:bg-gray-100" 
                    onClick={handleShare}
                  >
                    <Share2 className="h-5 w-5 text-gray-400" />
                  </Button>
                </div>
              </div>

              {/* Facility Info */}
              <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-base text-gray-600 mb-4">
                <div className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  <span>{facility.capacity} {t('facility.capacity')}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  <span>{facility.nextAvailable}</span>
                </div>
                {facility.rating && (
                  <div className="flex items-center">
                    <Star className="h-5 w-5 mr-2 fill-yellow-400 text-yellow-400" />
                    <span>{facility.rating}</span>
                  </div>
                )}
              </div>

              {/* Description */}
              {facility.description && (
                <p className="text-gray-600 text-base line-clamp-2 mb-4">
                  {facility.description}
                </p>
              )}

              {/* Equipment/Features */}
              {facility.equipment && facility.equipment.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {facility.equipment.slice(0, 3).map((item, index) => (
                    <Badge key={index} variant="secondary" className="text-sm px-3 py-1">
                      {item}
                    </Badge>
                  ))}
                  {facility.equipment.length > 3 && (
                    <Badge variant="outline" className="text-sm px-3 py-1">
                      +{facility.equipment.length - 3}
                    </Badge>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl font-bold text-gray-900">
                  {facility.pricePerHour || facility.price_per_hour} kr
                </span>
                <span className="text-base text-gray-500">
                  /{t('facility.perHour')}
                </span>
              </div>
              <div className="flex items-center text-blue-600 text-base font-medium group-hover:text-blue-700">
                <span className="mr-2">{t('facility.viewDetails')}</span>
                <ChevronRight className="h-5 w-5 transform group-hover:translate-x-1 transition-transform duration-200" />
              </div>
            </div>
          </div>

          {/* Map Section - Right */}
          <div className="w-48 sm:w-64 md:w-72 lg:w-80 flex-shrink-0">
            <div className="w-full h-full rounded-r-lg overflow-hidden">
              <FacilityListItemMap
                address={facility.address}
                facilityName={facility.name}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FacilityListItem;
