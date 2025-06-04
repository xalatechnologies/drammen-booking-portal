
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Calendar, Clock, Wrench, Shield } from "lucide-react";

interface FacilityDetailsProps {
  capacity: number;
  nextAvailable: string;
  openingHours: string;
  equipment: string[];
  accessibility: string[];
  onDetailsClick: (e: React.MouseEvent) => void;
}

const FacilityDetails: React.FC<FacilityDetailsProps> = ({
  capacity,
  nextAvailable,
  openingHours,
  equipment,
  accessibility,
  onDetailsClick
}) => {
  const getAccessibilityIcon = (type: string) => {
    switch (type) {
      case 'wheelchair':
        return '♿';
      case 'hearing-loop':
        return '🔊';
      case 'sign-language':
        return '👋';
      default:
        return '✓';
    }
  };

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
        
        {/* Equipment */}
        {equipment.length > 0 && (
          <div className="flex items-start gap-3 text-sm p-3 rounded-lg bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-200/60">
            <Wrench className="h-4 w-4 text-indigo-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <div className="text-xs text-indigo-700 font-semibold uppercase tracking-wide mb-1">Utstyr</div>
              <div className="text-xs text-slate-700 leading-relaxed font-medium">
                {equipment.slice(0, 4).join(", ")}
                {equipment.length > 4 && ` +${equipment.length - 4} mer`}
              </div>
            </div>
          </div>
        )}

        {/* Accessibility */}
        {accessibility.length > 0 && (
          <div className="flex items-start gap-3 text-sm p-3 rounded-lg bg-gradient-to-br from-purple-50 to-violet-50 border border-purple-200/60">
            <Shield className="h-4 w-4 text-purple-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <div className="text-xs text-purple-700 font-semibold uppercase tracking-wide mb-2">Tilgjengelighet</div>
              <div className="flex flex-wrap gap-1">
                {accessibility.map((item, index) => (
                  <Badge 
                    key={index} 
                    variant="secondary" 
                    className="text-xs px-2 py-1 bg-purple-100 text-purple-800 border-purple-200 font-medium"
                  >
                    {getAccessibilityIcon(item)} {item === 'wheelchair' ? 'Rullestol' : item === 'hearing-loop' ? 'Høreløkke' : item === 'sign-language' ? 'Tegnspråk' : item}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        )}
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
