
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
  type?: string;
  amenities?: string[];
}

interface FacilityCardContentProps {
  facility: Facility;
  onAddressClick: (e: React.MouseEvent, facility: Facility) => void;
}

export function FacilityCardContent({
  facility,
  onAddressClick
}: FacilityCardContentProps) {
  const { t } = useTranslation();

  // Derive suitable activities from facility data if suitableFor is empty
  const getSuitableActivities = () => {
    if (facility.suitableFor && facility.suitableFor.length > 0) {
      return facility.suitableFor;
    }

    // Derive from facility type and equipment
    const activities = [];
    
    if (facility.type) {
      switch (facility.type.toLowerCase()) {
        case 'sports-hall':
        case 'idrettshall':
          activities.push('Basketball', 'Volleyball', 'Badminton');
          break;
        case 'conference-room':
        case 'konferanserom':
          activities.push('Meetings', 'Presentations', 'Workshops');
          break;
        case 'meeting-room':
        case 'møterom':
          activities.push('Small meetings', 'Interviews');
          break;
        case 'cultural-hall':
        case 'kulturhus':
          activities.push('Events', 'Performances', 'Gatherings');
          break;
        default:
          activities.push('Various activities');
      }
    }

    // Add based on equipment
    if (facility.equipment && facility.equipment.length > 0) {
      if (facility.equipment.some(eq => eq.toLowerCase().includes('av') || eq.toLowerCase().includes('projector'))) {
        activities.push('Presentations');
      }
      if (facility.equipment.some(eq => eq.toLowerCase().includes('sound') || eq.toLowerCase().includes('lyd'))) {
        activities.push('Events');
      }
    }

    // Add based on amenities
    if (facility.amenities && facility.amenities.length > 0) {
      if (facility.amenities.some(am => am.toLowerCase().includes('kitchen') || am.toLowerCase().includes('kjøkken'))) {
        activities.push('Catering events');
      }
      if (facility.amenities.some(am => am.toLowerCase().includes('parking'))) {
        activities.push('Large events');
      }
    }

    // Remove duplicates and return
    return [...new Set(activities)];
  };

  const suitableActivities = getSuitableActivities();

  return (
    <div className="p-6">
      {/* Location */}
      <div className="flex items-center gap-3 mb-5 text-gray-600 hover:text-blue-600 transition-colors group/location">
        <MapPin className="h-5 w-5 text-gray-400 group-hover/location:text-blue-500" />
        <span className="text-base font-medium line-clamp-1 cursor-pointer" onClick={e => onAddressClick(e, facility)}>
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
      {suitableActivities.length > 0 && (
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {suitableActivities.slice(0, 2).map((activity, index) => (
              <Badge 
                key={index} 
                className="bg-blue-50 text-blue-700 border-blue-200 font-medium px-4 py-2 text-base hover:bg-blue-100 transition-colors"
              >
                {activity}
              </Badge>
            ))}
            {suitableActivities.length > 2 && (
              <Badge 
                variant="outline" 
                className="bg-gray-50 text-gray-600 border-gray-300 font-medium px-4 py-2 text-base"
              >
                +{suitableActivities.length - 2}
              </Badge>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
