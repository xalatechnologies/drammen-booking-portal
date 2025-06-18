
import React from "react";
import { MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";

interface FacilityHeaderProps {
  name: string;
  address: string;
  onShare: () => void;
  isFavorited: boolean;
  onToggleFavorite: () => void;
}

export function FacilityHeader({ 
  name, 
  address
}: FacilityHeaderProps) {
  const { language } = useLanguage();
  
  const translations = {
    NO: {
      sportsCenter: "Idrettsanlegg"
    },
    EN: {
      sportsCenter: "Sports Facility"
    }
  };

  const t = translations[language];

  return (
    <div>
      <div className="flex items-center gap-3 mb-2">
        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 px-3 py-1 rounded-full text-sm font-medium">
          {t.sportsCenter}
        </Badge>
      </div>
      <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">{name}</h1>
      <div className="flex items-center text-gray-600 mb-6">
        <MapPin className="h-5 w-5 mr-2 text-blue-600" />
        <span>{address}</span>
      </div>
    </div>
  );
}
