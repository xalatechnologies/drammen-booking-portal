
import React from "react";
import { Projector, Volume2, FileText, ChefHat, Car, Wifi, Snowflake, Accessibility } from "lucide-react";
import { useTranslation } from "@/i18n";

interface FacilityCardAmenitiesProps {
  equipment: string[];
  showAll?: boolean;
  className?: string;
}

export function FacilityCardAmenities({ equipment, showAll = false, className = "" }: FacilityCardAmenitiesProps) {
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
  };
  
  // Safety check: ensure equipment exists and is an array
  const equipmentArray = Array.isArray(equipment) ? equipment : [];
  const displayItems = showAll ? equipmentArray : equipmentArray.slice(0, 6);
  
  return (
    <div className={`grid grid-cols-2 gap-3 ${className}`}>
      {displayItems.map((item, index) => {
        const IconComponent = amenityMap[item.toLowerCase()] || FileText;
        const localizedName = t(`facility.amenities.${item.toLowerCase().replace(/\s+/g, '')}`, {}, item);
        
        return (
          <div key={index} className="flex items-center gap-3 text-gray-700">
            <IconComponent className="h-5 w-5 text-gray-500 flex-shrink-0" />
            <span className="text-sm font-medium">{localizedName}</span>
          </div>
        );
      })}
      {!showAll && equipmentArray.length > 6 && (
        <div className="col-span-2 mt-2">
          <button className="text-sm text-gray-600 hover:text-gray-800 font-medium underline">
            Show all {equipmentArray.length} amenities
          </button>
        </div>
      )}
    </div>
  );
}
