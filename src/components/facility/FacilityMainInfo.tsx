
import React from "react";
import { Badge } from "@/components/ui/badge";
import { MapPin } from "lucide-react";

interface FacilityMainInfoProps {
  name: string;
  address: string;
  suitableFor: string[];
  area: string;
  description: string;
  onAddressClick: (e: React.MouseEvent) => void;
}

const FacilityMainInfo: React.FC<FacilityMainInfoProps> = ({
  name,
  address,
  suitableFor,
  area,
  description,
  onAddressClick
}) => {
  return (
    <div className="flex-grow p-6 flex flex-col justify-between min-w-0 bg-gradient-to-br from-white to-gray-50/30">
      <div>
        <div className="flex items-start gap-4 mb-3">
          <div className="flex-grow min-w-0">
            <h3 className="font-bold text-xl text-slate-800 truncate mb-2 group-hover:text-slate-900 transition-colors">{name}</h3>
            <div className="flex flex-wrap gap-2">
              {suitableFor.slice(0, 4).map((activity, index) => (
                <Badge key={index} variant="secondary" className="text-xs px-3 py-1.5 bg-emerald-100 text-emerald-800 border-emerald-200 font-medium hover:bg-emerald-200 transition-colors">
                  {activity}
                </Badge>
              ))}
              {suitableFor.length > 4 && (
                <Badge variant="secondary" className="text-xs px-3 py-1.5 bg-emerald-100 text-emerald-800 border-emerald-200 font-medium">
                  +{suitableFor.length - 4}
                </Badge>
              )}
            </div>
          </div>
          <Badge variant="outline" className="bg-gradient-to-r from-white to-gray-50 text-slate-700 border-slate-200 font-semibold text-sm px-3 py-1.5 flex-shrink-0 shadow-sm">
            {area}
          </Badge>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-slate-600 mb-4 group-hover:text-slate-700 transition-colors">
          <MapPin className="h-4 w-4 text-slate-500 flex-shrink-0" />
          <span 
            className="hover:text-emerald-700 hover:underline cursor-pointer transition-colors truncate font-medium"
            onClick={onAddressClick}
            title="Klikk for å se på kart"
          >
            {address}
          </span>
        </div>
        
        <p className="text-slate-600 text-sm line-clamp-3 leading-relaxed">{description}</p>
      </div>
    </div>
  );
};

export default FacilityMainInfo;
