
import React from "react";
import { format } from "date-fns";
import { nb, enUS } from "date-fns/locale";
import { Users, Clock, Calendar, CheckCircle, XCircle, Wrench, Info } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { AccessibilityBadges } from "./AccessibilityBadges";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

interface Facility {
  id: number;
  name: string;
  address: string;
  type: string;
  image: string;
  nextAvailable: string;
  capacity: number;
  accessibility: string[];
  area: string;
  suitableFor: string[];
  equipment: string[];
  openingHours: string;
  description: string;
  availableTimes?: {
    date: Date;
    slots: {
      start: string;
      end: string;
      available: boolean;
    }[];
  }[];
}

interface FacilityCardTabsProps {
  facility: Facility;
}

export function FacilityCardTabs({ facility }: FacilityCardTabsProps) {
  const { language } = useLanguage();
  
  const handleTabsClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const translations = {
    NO: {
      overview: "Oversikt",
      details: "Detaljer",
      capacity: "Kapasitet",
      people: "personer",
      accessibility: "Tilgjengelighet",
      equipment: "Tilgjengelig utstyr",
      more: "flere"
    },
    EN: {
      overview: "Overview",
      details: "Details",
      capacity: "Capacity",
      people: "people",
      accessibility: "Accessibility",
      equipment: "Available equipment",
      more: "more"
    }
  };

  const t = translations[language];

  return (
    <div onClick={handleTabsClick}>
      <Tabs defaultValue="overview" className="flex-grow">
        <TabsList className="grid w-full grid-cols-2 mb-3 h-10">
          <TabsTrigger value="overview" className="text-sm py-2">{t.overview}</TabsTrigger>
          <TabsTrigger value="details" className="text-sm py-2">{t.details}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-3 mt-0">
          <div className="flex items-center gap-1.5 text-base text-gray-600">
            <Users className="h-5 w-5 text-gray-500" />
            <span>{t.capacity}: {facility.capacity} {t.people}</span>
          </div>

          <div className="text-base text-gray-700">
            <p className="line-clamp-2 leading-relaxed">{facility.description}</p>
          </div>
        </TabsContent>
        
        <TabsContent value="details" className="space-y-3 mt-0">
          <div>
            <h4 className="text-base font-medium mb-2 text-gray-900">{t.accessibility}</h4>
            <AccessibilityBadges accessibility={facility.accessibility} />
          </div>

          <div>
            <h4 className="text-base font-medium mb-2 flex items-center gap-1.5 text-gray-900">
              <Wrench className="h-5 w-5 text-[#1e3a8a]" />
              <span>{t.equipment}</span>
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {facility.equipment.slice(0, 4).map((item, i) => (
                <Badge key={i} variant="outline" className="bg-[#1e3a8a] bg-opacity-10 text-[#1e3a8a] border-[#1e3a8a] text-sm py-1 px-2">
                  {item}
                </Badge>
              ))}
              {facility.equipment.length > 4 && (
                <Badge variant="outline" className="bg-[#1e3a8a] bg-opacity-10 text-[#1e3a8a] border-[#1e3a8a] text-sm py-1 px-2">
                  +{facility.equipment.length - 4} {t.more}
                </Badge>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
