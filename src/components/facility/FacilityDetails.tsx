
import React from "react";
import { Button } from "@/components/ui/button";
import { Users, Calendar, Clock, Wrench } from "lucide-react";

interface FacilityDetailsProps {
  capacity: number;
  nextAvailable: string;
  openingHours: string;
  equipment: string[];
  onDetailsClick: (e: React.MouseEvent) => void;
}

const FacilityDetails: React.FC<FacilityDetailsProps> = ({
  capacity,
  nextAvailable,
  openingHours,
  equipment,
  onDetailsClick
}) => {
  return (
    <div className="w-72 p-4 flex flex-col justify-between border-l border-gray-100 bg-gradient-to-br from-gray-50/80 to-slate-50/80 flex-shrink-0">
      <div className="space-y-4">
        {/* Capacity and Hours */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2 text-sm">
            <Users className="h-4 w-4 text-amber-600 flex-shrink-0" />
            <div>
              <div className="text-xs text-gray-500 font-medium">Kapasitet</div>
              <div className="text-gray-800 font-semibold">{capacity}</div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-emerald-600 flex-shrink-0" />
            <div>
              <div className="text-xs text-gray-500 font-medium">Neste ledig</div>
              <div className="text-gray-800 font-semibold text-xs">{nextAvailable}</div>
            </div>
          </div>
        </div>

        {/* Opening Hours */}
        <div className="flex items-start gap-2 text-sm">
          <Clock className="h-4 w-4 text-slate-600 flex-shrink-0 mt-0.5" />
          <div>
            <div className="text-xs text-gray-500 font-medium mb-1">Åpningstider</div>
            <div className="text-xs text-gray-700 leading-relaxed">{openingHours}</div>
          </div>
        </div>
        
        {/* Equipment */}
        {equipment.length > 0 && (
          <div className="flex items-start gap-2 text-sm">
            <Wrench className="h-4 w-4 text-indigo-600 flex-shrink-0 mt-0.5" />
            <div>
              <div className="text-xs text-gray-500 font-medium mb-1">Utstyr</div>
              <div className="text-xs text-gray-700 leading-relaxed">
                {equipment.slice(0, 3).join(", ")}
                {equipment.length > 3 && "..."}
              </div>
            </div>
          </div>
        )}
      </div>
      
      <Button 
        size="sm" 
        className="bg-slate-800 hover:bg-slate-700 text-white w-full mt-4 font-medium shadow-sm"
        onClick={onDetailsClick}
      >
        Se detaljer
      </Button>
    </div>
  );
};

export default FacilityDetails;
