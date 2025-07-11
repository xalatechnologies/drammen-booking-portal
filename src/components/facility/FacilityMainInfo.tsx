
import React from "react";
import { MapPin, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AccessibilityBadges } from "./AccessibilityBadges";
import { useLanguage } from "@/contexts/LanguageContext";

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
  onAddressClick,
}) => {
  const { language } = useLanguage();

  const translations = {
    NO: {
      suitableFor: "Egnet for",
      more: "flere"
    },
    EN: {
      suitableFor: "Suitable for",
      more: "more"
    }
  };

  const t = translations[language];

  return (
    <div className="h-full flex flex-col justify-between py-2">
      {/* Header Section */}
      <div className="space-y-4">
        <div>
          <h3 className="text-2xl font-bold text-slate-900 mb-2 group-hover:text-slate-700 transition-colors leading-tight">
            {name}
          </h3>
          <Button
            variant="ghost"
            onClick={onAddressClick}
            className="text-slate-600 hover:text-slate-800 p-0 h-auto font-normal text-base hover:bg-transparent"
          >
            <MapPin className="h-4 w-4 mr-2 text-slate-500" />
            {address}
          </Button>
        </div>

        <p className="text-slate-600 text-base leading-relaxed line-clamp-2">
          {description}
        </p>
      </div>

      {/* Details Section */}
      <div className="space-y-6 mt-6">
        {/* Suitable For */}
        <div className="space-y-3">
          <div className="flex items-center text-slate-700">
            <Users className="h-5 w-5 mr-2 text-slate-500" />
            <span className="font-semibold text-base">{t.suitableFor}</span>
          </div>
          <div className="flex flex-wrap gap-2 ml-7">
            {suitableFor.slice(0, 4).map((activity, index) => (
              <span
                key={index}
                className="px-3 py-1.5 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
              >
                {activity}
              </span>
            ))}
            {suitableFor.length > 4 && (
              <span className="px-3 py-1.5 bg-slate-100 text-slate-600 rounded-full text-sm">
                +{suitableFor.length - 4} {t.more}
              </span>
            )}
          </div>
        </div>

        {/* Accessibility */}
        {accessibility && accessibility.length > 0 && (
          <div className="space-y-3">
            <div className="ml-7">
              <AccessibilityBadges accessibility={accessibility} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FacilityMainInfo;
