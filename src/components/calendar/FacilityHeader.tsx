
import React from "react";
import { MapPin, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface CalendarZone {
  id: string;
  name: string;
  capacity: number;
  pricePerHour: number;
  description: string;
}

interface FacilityWithZones {
  id: number;
  name: string;
  address: string;
  capacity: number;
  accessibility: string[];
  suitableFor: string[];
  image?: string;
  zones: CalendarZone[];
}

interface FacilityHeaderProps {
  facility: FacilityWithZones;
}

export const FacilityHeader: React.FC<FacilityHeaderProps> = ({ facility }) => {
  return (
    <div className="flex items-start gap-4 text-left">
      {/* Facility Image */}
      <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
        <img 
          src={facility.image || 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&auto=format&fit=crop'} 
          alt={facility.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&auto=format&fit=crop";
            target.onerror = null;
          }}
        />
      </div>
      
      {/* Facility Info */}
      <div className="flex-1">
        <h3 className="font-bold text-lg text-gray-900 mb-1">{facility.name}</h3>
        <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
          <div className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            <span>{facility.address}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>{facility.capacity} personer</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {facility.suitableFor.slice(0, 3).map((activity, i) => (
            <Badge
              key={i}
              className="bg-blue-100 text-blue-800 border-blue-200 text-xs"
            >
              {activity}
            </Badge>
          ))}
          {facility.accessibility.includes("wheelchair") && (
            <Badge className="bg-green-100 text-green-800 border-green-200 text-xs">
              Rullestol
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
};
