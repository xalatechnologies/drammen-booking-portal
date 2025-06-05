
import React from "react";
import { Users, Map, Clock, CheckCircle } from "lucide-react";
import { Card } from "@/components/ui/card";

interface FacilityQuickFactsProps {
  capacity: number;
  area: string;
  openingHours: string;
  zoneCount: number;
}

export function FacilityQuickFacts({ capacity, area, openingHours, zoneCount }: FacilityQuickFactsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-1">
          <Users className="h-4 w-4 text-blue-600" />
          <span className="text-sm font-medium text-gray-500">Kapasitet</span>
        </div>
        <p className="font-bold">{capacity}</p>
      </Card>
      
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-1">
          <Map className="h-4 w-4 text-green-600" />
          <span className="text-sm font-medium text-gray-500">Areal</span>
        </div>
        <p className="font-bold">{area}</p>
      </Card>
      
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-1">
          <Clock className="h-4 w-4 text-purple-600" />
          <span className="text-sm font-medium text-gray-500">Åpent</span>
        </div>
        <p className="font-bold text-sm">06:00-23:00</p>
      </Card>
      
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-1">
          <CheckCircle className="h-4 w-4 text-emerald-600" />
          <span className="text-sm font-medium text-gray-500">Soner</span>
        </div>
        <p className="font-bold text-emerald-600">{zoneCount}</p>
      </Card>
    </div>
  );
}
