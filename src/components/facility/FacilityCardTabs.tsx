
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
      <Tabs defaultValue="overview" className="flex-grow mt-3">
        <TabsList className="grid w-full grid-cols-2 mb-3 h-9 bg-gray-50 p-1 rounded-lg">
          <TabsTrigger value="overview" className="text-xs py-1.5 rounded-md data-[state=active]:bg-white data-[state=active]:text-blue-700 data-[state=active]:shadow-sm">{t.overview}</TabsTrigger>
          <TabsTrigger value="details" className="text-xs py-1.5 rounded-md data-[state=active]:bg-white data-[state=active]:text-blue-700 data-[state=active]:shadow-sm">{t.details}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4 mt-0">
          <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
            <p className="line-clamp-2 leading-relaxed text-gray-700 text-xs">{facility.description}</p>
          </div>
        </TabsContent>
        
        <TabsContent value="details" className="space-y-4 mt-0">
          <div>
            <h4 className="text-xs font-medium mb-2 text-gray-900 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
              {t.accessibility}
            </h4>
            <AccessibilityBadges accessibility={facility.accessibility} />
          </div>

          <div>
            <h4 className="text-xs font-medium mb-2 flex items-center gap-2 text-gray-900">
              <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
              <span>{t.equipment}</span>
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {facility.equipment.slice(0, 4).map((item, i) => (
                <Badge key={i} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs py-0.5 px-2 rounded-full">
                  {item}
                </Badge>
              ))}
              {facility.equipment.length > 4 && (
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs py-0.5 px-2 rounded-full">
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
