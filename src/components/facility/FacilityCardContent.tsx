
import React from "react";
import { MapPin, Users } from "lucide-react";
import { useTranslation } from "@/i18n";
import { FlatAmenitiesGrid } from "./FlatAmenitiesGrid";

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
      <div className="flex items-center gap-3 text-gray-600 mb-6">
        <Users className="h-5 w-5" />
        <span className="text-base font-medium">{t('facility.details.capacity')}: {facility.capacity}</span>
      </div>

      {/* Suitable For */}
      {Array.isArray(facility.suitableFor) && facility.suitableFor.length > 0 && (
        <div className="mb-6">
          <FlatAmenitiesGrid 
            items={facility.suitableFor}
            title="Suitable for"
            maxItems={4}
            iconType="activities"
          />
        </div>
      )}

      {/* Equipment/Amenities */}
      {Array.isArray(facility.equipment) && facility.equipment.length > 0 && (
        <div className="mb-4">
          <FlatAmenitiesGrid 
            items={facility.equipment}
            title="Available equipment"
            maxItems={4}
            iconType="amenities"
          />
        </div>
      )}
    </div>
  );
}
