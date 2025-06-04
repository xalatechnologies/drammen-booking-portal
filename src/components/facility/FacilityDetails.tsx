
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Calendar, Clock } from "lucide-react";

interface FacilityDetailsProps {
  capacity: number;
  nextAvailable: string;
  openingHours: string;
  onDetailsClick: (e: React.MouseEvent) => void;
}

const FacilityDetails: React.FC<FacilityDetailsProps> = ({
  capacity,
  nextAvailable,
  openingHours,
  onDetailsClick
}) => {
  return (
    <div className="w-96 p-6 flex flex-col justify-between border-l border-slate-200/80 bg-gradient-to-br from-slate-50/40 via-white to-slate-50/30 flex-shrink-0 rounded-r-lg">
      <div className="space-y-4">
        {/* Capacity and Availability */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2 text-sm p-3 rounded-lg bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200/60">
            <Users className="h-4 w-4 text-amber-600 flex-shrink-0" />
            <div>
              <div className="text-xs text-amber-700 font-semibold uppercase tracking-wide">Kapasitet</div>
              <div className="text-slate-800 font-bold text-lg">{capacity}</div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm p-3 rounded-lg bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-200/60">
            <Calendar className="h-4 w-4 text-emerald-600 flex-shrink-0" />
            <div>
              <div className="text-xs text-emerald-700 font-semibold uppercase tracking-wide">Neste ledig</div>
              <div className="text-slate-800 font-semibold text-xs leading-tight">{nextAvailable}</div>
            </div>
          </div>
        </div>

        {/* Opening Hours */}
        <div className="flex items-start gap-3 text-sm p-3 rounded-lg bg-gradient-to-br from-slate-50 to-gray-50 border border-slate-200/60">
          <Clock className="h-4 w-4 text-slate-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <div className="text-xs text-slate-700 font-semibold uppercase tracking-wide mb-1">Åpningstider</div>
            <div className="text-xs text-slate-700 leading-relaxed font-medium">{openingHours}</div>
          </div>
        </div>
      </div>
      
      <Button 
        size="sm" 
        className="bg-gradient-to-r from-slate-800 to-slate-700 hover:from-slate-700 hover:to-slate-600 text-white w-full mt-4 font-semibold shadow-sm hover:shadow-md transition-all duration-200 py-2.5"
        onClick={onDetailsClick}
      >
        Se detaljer
      </Button>
    </div>
  );
};

export default FacilityDetails;
