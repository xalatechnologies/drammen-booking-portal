
import React, { useState } from "react";
import { CheckCircle, Info, Clock, Share2, Heart, Users, Map } from "lucide-react";
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
    <Card className="mb-4 shadow-sm border-blue-100">
      <CardContent className="p-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-1">{zone.name}</h3>
          <p className="text-sm text-gray-600 mb-3">{zone.description}</p>
          
          <div className="flex items-center gap-4 mb-3">
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <Users className="h-4 w-4" />
              <span>Maks {zone.capacity}</span>
            </div>
            {zone.area && (
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <Map className="h-4 w-4" />
                <span>{zone.area}</span>
              </div>
            )}
          </div>
          
          <div className="flex flex-wrap gap-1 mb-4">
            {zone.equipment.slice(0, 2).map((item, i) => (
              <Badge key={i} variant="outline" className="text-xs">
                {item}
              </Badge>
            ))}
            {zone.equipment.length > 2 && (
              <Badge variant="outline" className="text-xs">
                +{zone.equipment.length - 2} mer
              </Badge>
            )}
          </div>
        </div>
        
        <div className="text-center mb-4">
          <div className="text-2xl font-bold text-gray-900">{zone.pricePerHour} kr</div>
          <div className="text-gray-500 text-sm">per time</div>
        </div>
        
        <div className="p-3 bg-green-50 rounded-lg mb-4 text-center">
          <p className="text-green-800 text-sm">
            <CheckCircle className="inline h-4 w-4 mr-1" />
            Tilgjengelig for umiddelbar booking
          </p>
        </div>

        <Button 
          className="w-full bg-[#0B3D91] hover:bg-blue-700 text-white font-medium shadow-sm h-12 mb-3"
          onClick={() => onBookClick(zone.id)}
        >
          Reserver {zone.name}
        </Button>
      </CardContent>
    </Card>
  );
}
