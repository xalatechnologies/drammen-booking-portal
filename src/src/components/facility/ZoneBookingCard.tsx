
import React from "react";
import { CheckCircle, Users, Map } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Zone } from "@/components/booking/types";

interface ZoneBookingCardProps {
  zone: Zone;
  facilityName: string;
  onBookClick: (zoneId: string) => void;
}

export function ZoneBookingCard({ zone, facilityName, onBookClick }: ZoneBookingCardProps) {
  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="font-medium text-base mb-1">{zone.name}</h3>
          <div className="flex items-center gap-3 text-sm text-gray-600 mb-2">
            <div className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              <span>{zone.capacity}</span>
            </div>
            {zone.area && (
              <div className="flex items-center gap-1">
                <Map className="h-3 w-3" />
                <span>{zone.area}</span>
              </div>
            )}
          </div>
        </div>
        <div className="text-right">
          <div className="text-lg font-bold text-gray-900">{zone.pricePerHour} kr</div>
          <div className="text-xs text-gray-500">per time</div>
        </div>
      </div>
      
      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{zone.description}</p>
      
      <div className="flex flex-wrap gap-1 mb-3">
        {zone.equipment.slice(0, 2).map((item, i) => (
          <Badge key={i} variant="outline" className="text-xs py-0.5 px-2">
            {item}
          </Badge>
        ))}
        {zone.equipment.length > 2 && (
          <Badge variant="outline" className="text-xs py-0.5 px-2">
            +{zone.equipment.length - 2}
          </Badge>
        )}
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 text-xs text-green-600">
          <CheckCircle className="h-3 w-3" />
          <span>Tilgjengelig</span>
        </div>
        <Button 
          size="sm"
          className="bg-[#1e3a8a] hover:bg-[#1e40af] text-white h-8 text-xs"
          onClick={() => onBookClick(zone.id)}
        >
          Reserver
        </Button>
      </div>
    </div>
  );
}
