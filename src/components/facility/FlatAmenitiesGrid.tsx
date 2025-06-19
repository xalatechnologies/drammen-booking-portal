
import React from "react";
import { Wifi, Car, Coffee, Shield, CheckCircle, Users, Projector, Volume2, FileText, ChefHat, Snowflake, Accessibility } from "lucide-react";
import { useTranslation } from "@/i18n";

interface FlatAmenitiesGridProps {
  amenities: string[];
  title?: string;
  showAll?: boolean;
  maxItems?: number;
}

export function FlatAmenitiesGrid({ 
  amenities, 
  title = "What this place offers",
  showAll = false,
  maxItems = 8 
}: FlatAmenitiesGridProps) {
  const { t } = useTranslation();

  const amenityMap: { [key: string]: React.ElementType } = {
    'projektor': Projector,
    'projector': Projector,
    'lydanlegg': Volume2,
    'sound system': Volume2,
    'whiteboard': FileText,
    'kjøkken': ChefHat,
    'kitchen': ChefHat,
    'parkering': Car,
    'parking': Car,
    'wifi': Wifi,
    'klimaanlegg': Snowflake,
    'air conditioning': Snowflake,
    'rullestolvennlig': Accessibility,
    'wheelchair accessible': Accessibility,
    'kafeteria': Coffee,
    'sikkerhetskameraer': Shield,
    'brannsikkerhet': Shield,
    'førstehjelpsutstyr': Shield,
  };

  const displayedAmenities = showAll ? amenities : amenities.slice(0, maxItems);

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {displayedAmenities.map((amenity, index) => {
          const IconComponent = amenityMap[amenity.toLowerCase()] || CheckCircle;
          const localizedName = t(`facility.amenities.${amenity.toLowerCase().replace(/\s+/g, '')}`, {}, amenity);
          
          return (
            <div key={index} className="flex items-center gap-3 p-0">
              <IconComponent className="h-6 w-6 text-gray-700 flex-shrink-0" />
              <span className="text-gray-700 text-base">{localizedName}</span>
            </div>
          );
        })}
      </div>
      
      {!showAll && amenities.length > maxItems && (
        <button className="mt-4 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors">
          Show all {amenities.length} amenities
        </button>
      )}
    </div>
  );
}
