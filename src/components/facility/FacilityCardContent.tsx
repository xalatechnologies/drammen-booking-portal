
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

    // Derive from facility type and equipment - using actual database values
    const activities = [];
    
    if (facility.type) {
      switch (facility.type.toLowerCase()) {
        case 'fotballhall':
        case 'idrettshall':
        case 'gymsal':
          activities.push('Football', 'Sports', 'Training');
          break;
        case 'svømmehall':
          activities.push('Swimming', 'Water sports', 'Training');
          break;
        case 'aktivitetshall':
          activities.push('Basketball', 'Volleyball', 'Badminton');
          break;
        case 'auditorium':
          activities.push('Presentations', 'Events', 'Lectures');
          break;
        case 'konferanserom':
        case 'møterom':
          activities.push('Meetings', 'Conferences');
          break;
        case 'klasserom':
          activities.push('Teaching', 'Workshops');
          break;
        default:
          activities.push('Various activities');
      }
    }

    return activities.slice(0, 1); // Only one line as requested
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

      {/* Suitable For Tags - Only one line */}
      {suitableActivities.length > 0 && (
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            <Badge 
              className="bg-blue-50 text-blue-700 border-blue-200 font-medium px-4 py-2 text-base hover:bg-blue-100 transition-colors"
            >
              {suitableActivities[0]}
            </Badge>
          </div>
        </div>
      )}
    </div>
  );
}
