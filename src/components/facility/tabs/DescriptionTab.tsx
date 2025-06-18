
import React from "react";
import { MapPin, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { AvailabilityTab } from "./AvailabilityTab";
import { Zone } from "@/components/booking/types";

interface DescriptionTabProps {
  description: string;
  capacity: number;
  address: string;
  zones?: Zone[];
}

export function DescriptionTab({ description, capacity, address, zones = [] }: DescriptionTabProps) {
  return (
    <div className="p-6 space-y-6">
      {/* General Information */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Generell informasjon</h3>
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-gray-700">
            <MapPin className="h-4 w-4 text-gray-500" />
            <span>{address}</span>
          </div>
          
          <div className="flex items-center gap-2 text-gray-700">
            <Users className="h-4 w-4 text-gray-500" />
            <span>Kapasitet: {capacity} personer</span>
          </div>
          
          <div>
            <p className="text-gray-700 leading-relaxed">{description}</p>
          </div>
          
          <div className="pt-4 border-t border-gray-100">
            <h4 className="font-medium text-gray-900 mb-2">Egnet for</h4>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Idrett</Badge>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Trening</Badge>
              <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">Arrangementer</Badge>
              <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">Grupper</Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Availability Calendar */}
      {zones.length > 0 && (
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-semibold mb-4">Tilgjengelighet</h3>
          <AvailabilityTab zones={zones} startDate={new Date()} />
        </div>
      )}
    </div>
  );
}
