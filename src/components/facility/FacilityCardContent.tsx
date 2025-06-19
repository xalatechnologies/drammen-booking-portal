
import React from "react";
import { MapPin, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "@/i18n";

interface Facility {
  id: number;
  name: string;
  address: string;
  description: string;
  capacity: number;
  equipment: string[];
  suitableFor: string[];
}

interface FacilityCardContentProps {
  facility: Facility;
  onAddressClick: (e: React.MouseEvent, facility: Facility) => void;
}

export function FacilityCardContent({ facility, onAddressClick }: FacilityCardContentProps) {
  const { t } = useTranslation();

  return (
    <div className="p-6">
      {/* Location */}
      <div className="flex items-center gap-3 mb-5 text-gray-600 hover:text-blue-600 transition-colors group/location">
        <MapPin className="h-5 w-5 text-gray-400 group-hover/location:text-blue-500" />
        <span 
          className="text-base font-medium line-clamp-1 cursor-pointer"
          onClick={(e) => onAddressClick(e, facility)}
        >
          {facility.address}
        </span>
      </div>

      {/* Description */}
      <p className="text-gray-700 text-base leading-relaxed mb-5 line-clamp-2">
        {facility.description}
      </p>

      {/* Capacity */}
      <div className="flex items-center gap-3 text-gray-600 mb-5">
        <Users className="h-5 w-5" />
        <span className="text-base font-medium">{t('facility.details.capacity')}: {facility.capacity}</span>
      </div>

      {/* Suitable For Tags */}
      <div className="mb-6">
        <h4 className="text-base font-semibold text-gray-900 mb-3">
          {t('facility.details.suitableFor', {}, 'Suitable for')}
        </h4>
        <div className="flex flex-wrap gap-2">
          {Array.isArray(facility.suitableFor) && facility.suitableFor.slice(0, 2).map((activity, index) => (
            <Badge
              key={index}
              className="bg-blue-50 text-blue-700 border-blue-200 font-medium px-4 py-2 text-base hover:bg-blue-100 transition-colors"
            >
              {activity}
            </Badge>
          ))}
          {Array.isArray(facility.suitableFor) && facility.suitableFor.length > 2 && (
            <Badge 
              variant="outline" 
              className="bg-gray-50 text-gray-600 border-gray-300 font-medium px-4 py-2 text-base"
            >
              +{facility.suitableFor.length - 2}
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
}
