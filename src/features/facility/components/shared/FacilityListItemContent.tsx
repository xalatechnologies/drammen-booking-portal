import React from "react";
import { MapPin, Users, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Facility } from "@/features/facility/types/facility";
import { useLocalization } from "@/core/localization/hooks/useLocalization";

/**
 * FacilityListItemContent Props Interface
 * Following Interface Segregation Principle with focused props interface
 */
interface FacilityListItemContentProps {
  facility: Facility;
  highlightFilters?: {
    type?: string;
    location?: string;
    accessibility?: string[];
    capacity?: number[];
  };
}

/**
 * FacilityListItemContent Component
 * 
 * Responsible solely for rendering the content section of a facility list item
 * Following Single Responsibility Principle by focusing only on content display
 */
export function FacilityListItemContent({ 
  facility, 
  highlightFilters 
}: FacilityListItemContentProps) {
  const { translate } = useLocalization();

  return (
    <div className="p-4 flex-grow flex flex-col">
      <div className="flex flex-col md:flex-row justify-between gap-2">
        {/* Left column - facility details */}
        <div className="flex-grow">
          {/* Facility type */}
          <div className="mb-1">
            <Badge variant="outline" className="text-xs font-normal">
              {facility.type}
            </Badge>
          </div>

          {/* Facility name */}
          <h3 className="text-lg font-semibold mb-1">
            {facility.name.NO || facility.name.EN}
          </h3>

          {/* Location with icon */}
          <div className="flex items-center text-sm text-gray-600 mb-2">
            <MapPin className="h-3.5 w-3.5 mr-1 text-gray-500" />
            <span>
              {facility.address?.city}{facility.address?.street ? `, ${facility.address.street}` : ''}
            </span>
          </div>

          {/* Capacity with icon */}
          <div className="flex items-center text-sm text-gray-600 mb-2">
            <Users className="h-3.5 w-3.5 mr-1 text-gray-500" />
            <span>
              {translate('facility.capacity')}: {facility.capacity}
            </span>
          </div>

          {/* Features section */}
          <div className="flex flex-wrap gap-2 mt-2">
            {facility.amenities?.slice(0, 3).map((amenity, idx) => (
              <Badge key={idx} variant="secondary" className="text-xs font-normal">
                {translate(`facility.amenities.${amenity}`) || amenity}
              </Badge>
            ))}
            
            {facility.amenities && facility.amenities.length > 3 && (
              <Badge variant="outline" className="text-xs font-normal">
                +{facility.amenities.length - 3} {translate('facility.more')}
              </Badge>
            )}
          </div>
        </div>

        {/* Right column - price and availability */}
        <div className="flex flex-col items-end justify-between mt-2 md:mt-0">
          {/* Price per hour */}
          {facility.pricePerHour !== undefined && (
            <div className="text-right">
              <div className="text-sm text-gray-500">
                {translate('facility.pricePerHour')}
              </div>
              <div className="text-xl font-semibold">
                {facility.pricePerHour} kr
              </div>
            </div>
          )}

          {/* Next availability info if present */}
          {facility.nextAvailable && (
            <div className="flex items-center mt-auto text-sm text-green-600 font-medium">
              <Clock className="h-3.5 w-3.5 mr-1" />
              <span>
                {translate('facility.nextAvailableAt')}: {facility.nextAvailable}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Description (truncated) */}
      {facility.description && (
        <p className="text-sm text-gray-600 mt-3 line-clamp-2">
          {facility.description.NO || facility.description.EN}
        </p>
      )}
    </div>
  );
}
