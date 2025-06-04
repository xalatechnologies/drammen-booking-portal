
import React from "react";
import { Badge } from "@/components/ui/badge";
import { MapPin } from "lucide-react";

interface FacilityMainInfoProps {
  name: string;
  address: string;
  suitableFor: string[];
  equipment: string[];
  area: string;
  description: string;
  accessibility: string[];
  onAddressClick: (e: React.MouseEvent) => void;
}

const FacilityMainInfo: React.FC<FacilityMainInfoProps> = ({
  name,
  address,
  suitableFor,
  equipment,
  area,
  description,
  accessibility,
  onAddressClick
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
    <div className="flex-grow p-6 flex flex-col justify-between min-w-0 bg-gradient-to-br from-white to-gray-50/20">
      <div>
        <div className="flex items-start gap-4 mb-3">
          <div className="flex-grow min-w-0">
            <h3 className="font-bold text-xl text-slate-800 truncate mb-2 group-hover:text-slate-900 transition-colors">{name}</h3>
            
            {/* Address right after title */}
            <div className="flex items-center gap-2 text-sm text-slate-600 mb-3 group-hover:text-slate-700 transition-colors">
              <MapPin className="h-4 w-4 text-slate-500 flex-shrink-0" />
              <span 
                className="hover:text-emerald-700 hover:underline cursor-pointer transition-colors truncate font-medium"
                onClick={onAddressClick}
                title="Klikk for å se på kart"
              >
                {address}
              </span>
            </div>
            
            {/* Suitable For tags - smaller */}
            <div className="flex flex-wrap gap-1.5 mb-2">
              {suitableFor.slice(0, 3).map((activity, index) => (
                <Badge key={index} variant="secondary" className="text-xs px-2 py-1 bg-emerald-100 text-emerald-800 border-emerald-200/60 font-medium hover:bg-emerald-200 transition-colors">
                  {activity}
                </Badge>
              ))}
              {suitableFor.length > 3 && (
                <Badge variant="secondary" className="text-xs px-2 py-1 bg-emerald-100 text-emerald-800 border-emerald-200/60 font-medium">
                  +{suitableFor.length - 3}
                </Badge>
              )}
            </div>

            {/* Equipment tags - smaller */}
            <div className="flex flex-wrap gap-1.5 mb-2">
              {equipment.slice(0, 3).map((item, index) => (
                <Badge key={index} variant="secondary" className="text-xs px-2 py-1 bg-blue-100 text-blue-800 border-blue-200/60 font-medium hover:bg-blue-200 transition-colors">
                  {item}
                </Badge>
              ))}
              {equipment.length > 3 && (
                <Badge variant="secondary" className="text-xs px-2 py-1 bg-blue-100 text-blue-800 border-blue-200/60 font-medium">
                  +{equipment.length - 3}
                </Badge>
              )}
            </div>

            {/* Accessibility tags - smaller */}
            {accessibility.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-3">
                {accessibility.slice(0, 3).map((item, index) => (
                  <Badge 
                    key={index} 
                    variant="secondary" 
                    className="text-xs px-2 py-1 bg-purple-100 text-purple-800 border-purple-200 font-medium"
                  >
                    {getAccessibilityIcon(item)} {item === 'wheelchair' ? 'Rullestol' : item === 'hearing-loop' ? 'Høreløkke' : item === 'sign-language' ? 'Tegnspråk' : item}
                  </Badge>
                ))}
                {accessibility.length > 3 && (
                  <Badge variant="secondary" className="text-xs px-2 py-1 bg-purple-100 text-purple-800 border-purple-200 font-medium">
                    +{accessibility.length - 3}
                  </Badge>
                )}
              </div>
            )}
          </div>
          <Badge variant="outline" className="bg-gradient-to-r from-white to-gray-50 text-slate-700 border-slate-200/60 font-semibold text-sm px-3 py-1.5 flex-shrink-0 shadow-sm">
            {area}
          </Badge>
        </div>
        
        <p className="text-slate-600 text-sm line-clamp-3 leading-relaxed">{description}</p>
      </div>
    </div>
  );
};

export default FacilityMainInfo;
