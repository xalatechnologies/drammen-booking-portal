
import React from "react";
import { format } from "date-fns";
import { nb } from "date-fns/locale";
import { Users, Clock, Calendar, CheckCircle, XCircle, Wrench, Info } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { AccessibilityBadges } from "./AccessibilityBadges";
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
  const handleTabsClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div onClick={handleTabsClick}>
      <Tabs defaultValue="overview" className="flex-grow">
        <TabsList className="grid w-full grid-cols-3 mb-3 h-10 glass border-white/30 bg-navy-50/50">
          <TabsTrigger value="overview" className="text-sm py-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-navy-600 data-[state=active]:to-navy-700 data-[state=active]:text-white">Oversikt</TabsTrigger>
          <TabsTrigger value="details" className="text-sm py-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-navy-600 data-[state=active]:to-navy-700 data-[state=active]:text-white">Detaljer</TabsTrigger>
          <TabsTrigger value="availability" className="text-sm py-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-navy-600 data-[state=active]:to-navy-700 data-[state=active]:text-white">Ledighet</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-3 mt-0">
          <div className="flex items-center gap-1.5 text-base text-navy-600">
            <Users className="h-5 w-5 text-navy-500" />
            <span>Kapasitet: {facility.capacity} personer</span>
          </div>

          <div className="text-base text-navy-700">
            <p className="line-clamp-2 leading-relaxed">{facility.description}</p>
          </div>

          <div>
            <h4 className="text-base font-medium mb-2 text-navy-900">Egnet for</h4>
            <div className="flex flex-wrap gap-1.5">
              {facility.suitableFor.slice(0, 3).map((item, i) => (
                <Badge key={i} variant="outline" className="bg-navy-50 text-navy-700 border-navy-200 text-sm py-1 px-2">
                  {item}
                </Badge>
              ))}
              {facility.suitableFor.length > 3 && (
                <Badge variant="outline" className="bg-navy-50 text-navy-700 border-navy-200 text-sm py-1 px-2">
                  +{facility.suitableFor.length - 3} flere
                </Badge>
              )}
            </div>
          </div>

          <div>
            <h4 className="text-base font-medium mb-1 flex items-center gap-1.5 text-navy-900">
              <Clock className="h-5 w-5 text-green-600" />
              <span>Åpningstider</span>
            </h4>
            <p className="text-sm text-navy-600">{facility.openingHours}</p>
          </div>
        </TabsContent>
        
        <TabsContent value="details" className="space-y-3 mt-0">
          <div>
            <h4 className="text-base font-medium mb-2 text-navy-900">Tilgjengelighet</h4>
            <AccessibilityBadges accessibility={facility.accessibility} />
          </div>

          <div>
            <h4 className="text-base font-medium mb-2 flex items-center gap-1.5 text-navy-900">
              <Wrench className="h-5 w-5 text-navy-600" />
              <span>Tilgjengelig utstyr</span>
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {facility.equipment.slice(0, 4).map((item, i) => (
                <Badge key={i} variant="outline" className="bg-navy-50 text-navy-700 border-navy-200 text-sm py-1 px-2">
                  {item}
                </Badge>
              ))}
              {facility.equipment.length > 4 && (
                <Badge variant="outline" className="bg-navy-50 text-navy-700 border-navy-200 text-sm py-1 px-2">
                  +{facility.equipment.length - 4} flere
                </Badge>
              )}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="availability" className="mt-0">
          <div className="glass p-3 rounded-lg border border-white/30 bg-navy-50/30">
            <h4 className="text-base font-medium mb-2 flex items-center gap-1.5">
              <Calendar className="h-5 w-5 text-navy-600" />
              <span>Tilgjengelighet</span>
            </h4>
            
            {facility.availableTimes && facility.availableTimes[0]?.slots.map((slot, i) => (
              <div key={i} className="flex justify-between items-center py-1 border-b last:border-0 border-white/20">
                <span className="text-sm">
                  {format(facility.availableTimes![0].date, "EEE d. MMM", { locale: nb })} • {slot.start}-{slot.end}
                </span>
                {slot.available ? (
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-sm gap-1 flex items-center">
                    <CheckCircle className="h-3 w-3" />
                    <span>Ledig</span>
                  </Badge>
                ) : (
                  <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 text-sm gap-1 flex items-center">
                    <XCircle className="h-3 w-3" />
                    <span>Opptatt</span>
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
