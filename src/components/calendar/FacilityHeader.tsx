
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
    <div className="flex items-start gap-6 text-left">
      {/* Facility Image - Made even larger */}
      <div className="w-32 h-32 rounded-lg overflow-hidden flex-shrink-0 shadow-md">
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
      
      {/* Facility Info - Made fonts even bigger */}
      <div className="flex-1">
        <h3 className="font-bold text-2xl text-gray-900 mb-3">{facility.name}</h3>
        <div className="flex items-center gap-6 text-lg text-gray-600 mb-4">
          <div className="flex items-center gap-2">
            <MapPin className="h-6 w-6" />
            <span>{facility.address}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-6 w-6" />
            <span>{facility.capacity} personer</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {facility.suitableFor && facility.suitableFor.slice(0, 3).map((activity, i) => (
            <Badge
              key={i}
              className="bg-blue-100 text-blue-800 border-blue-200 text-base px-4 py-2"
            >
              {activity}
            </Badge>
          ))}
          {facility.accessibility && facility.accessibility.includes("wheelchair") && (
            <Badge className="bg-green-100 text-green-800 border-green-200 text-base px-4 py-2">
              Rullestol
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
};
