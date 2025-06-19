
import React from "react";
import { FacilityLocation } from "../FacilityLocation";
import { useLanguage } from "@/contexts/LanguageContext";

interface DescriptionTabProps {
  description: string;
  capacity: number;
  address: string;
}

export function DescriptionTab({ description, capacity, address }: DescriptionTabProps) {
  const { language } = useLanguage();

  const translations = {
    NO: {
      location: "Lokasjon"
    },
    EN: {
      location: "Location"
    }
  };

  const t = translations[language];

  return (
    <div className="p-6 space-y-6">
      {/* Description only */}
      <div>
        <p className="text-gray-700 leading-relaxed">{description}</p>
      </div>

      {/* Location Map */}
      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{t.location}</h3>
        <div className="h-64 rounded-lg overflow-hidden border">
          <FacilityLocation address={address} />
        </div>
      </div>
    </div>
  );
}
