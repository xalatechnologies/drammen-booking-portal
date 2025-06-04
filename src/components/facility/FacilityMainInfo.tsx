
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
    <div className="flex-grow p-4 flex flex-col justify-between min-w-0">
      <div>
        <div className="flex items-start gap-3 mb-2">
          <div className="flex-grow min-w-0">
            <h3 className="font-bold text-lg text-gray-900 truncate mb-1">{name}</h3>
            <div className="flex flex-wrap gap-1">
              {suitableFor.slice(0, 4).map((activity, index) => (
                <Badge key={index} variant="secondary" className="text-xs px-2 py-1 bg-emerald-50 text-emerald-700 border-emerald-200">
                  {activity}
                </Badge>
              ))}
              {suitableFor.length > 4 && (
                <Badge variant="secondary" className="text-xs px-2 py-1 bg-emerald-50 text-emerald-700 border-emerald-200">
                  +{suitableFor.length - 4}
                </Badge>
              )}
            </div>
          </div>
          <Badge variant="outline" className="bg-white text-gray-700 border-gray-200 font-medium text-xs px-2 py-1 flex-shrink-0">
            {area}
          </Badge>
        </div>
        
        <div className="flex items-center gap-1.5 text-sm text-gray-600 mb-3">
          <MapPin className="h-4 w-4 text-slate-500 flex-shrink-0" />
          <span 
            className="hover:text-slate-800 hover:underline cursor-pointer transition-colors truncate"
            onClick={onAddressClick}
            title="Klikk for å se på kart"
          >
            {address}
          </span>
        </div>
        
        <p className="text-gray-600 text-sm line-clamp-2">{description}</p>
      </div>
    </div>
  );
};

export default FacilityMainInfo;
