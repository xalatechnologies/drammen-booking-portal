
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
        <Badge variant="outline" className="bg-[#1e3a8a] bg-opacity-10 text-[#1e3a8a] border-[#1e3a8a]">
          {t.sportsCenter}
        </Badge>
      </div>
      <h1 className="text-3xl font-bold text-gray-900 mb-3">{name}</h1>
      <div className="flex items-center text-gray-600 mb-4">
        <MapPin className="h-5 w-5 mr-2" />
        <span>{address}</span>
      </div>
    </div>
  );
}
