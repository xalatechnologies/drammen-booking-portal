
import React from "react";
import { Projector, Volume2, FileText, ChefHat, Car, Wifi, Snowflake, Accessibility } from "lucide-react";
import { useTranslation } from "@/i18n";

interface FacilityCardAmenitiesProps {
  equipment: string[];
}

export function FacilityCardAmenities({ equipment }: FacilityCardAmenitiesProps) {
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
  
  return (
    <div className="flex gap-3" aria-label={t('facility.amenities.equipment', {}, 'Equipment')}>
      {equipmentArray.slice(0, 4).map((item, index) => {
        const IconComponent = amenityMap[item.toLowerCase()] || FileText;
        
        // Try to get localized name, fallback to original
        const localizedName = t(`facility.amenities.${item.toLowerCase().replace(/\s+/g, '')}`, {}, item);
        
        return (
          <IconComponent 
            key={index}
            className="h-5 w-5 text-gray-600" 
            aria-label={localizedName}
          />
        );
      })}
    </div>
  );
}
