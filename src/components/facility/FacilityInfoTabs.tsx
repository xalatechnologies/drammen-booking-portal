
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DescriptionTab } from "./tabs/DescriptionTab";
import { EnhancedAboutTab } from "./tabs/EnhancedAboutTab";
import { AvailabilityTab } from "./tabs/AvailabilityTab";
import { ZonesTab } from "./tabs/ZonesTab";
import { RulesTab } from "./tabs/RulesTab";
import { FaqTab } from "./tabs/FaqTab";
import { Zone } from "@/components/booking/types";
import { useLanguage } from "@/contexts/LanguageContext";
import { SelectedTimeSlot } from "@/utils/recurrenceEngine";

interface FacilityInfoTabsProps {
  description: string;
  capacity: number;
  equipment: string[];
  zones: Zone[];
  amenities: string[];
  address: string;
  area: string;
  suitableFor: string[];
  facilityId?: string;
  facilityName?: string;
  selectedSlots?: SelectedTimeSlot[];
  onSlotClick?: (zoneId: string, date: Date, timeSlot: string, availability: string) => void;
}

export function FacilityInfoTabs({ 
  description, 
  capacity, 
  equipment, 
  zones, 
  amenities, 
  address,
  area,
  suitableFor,
  facilityId,
  facilityName,
  selectedSlots = [],
  onSlotClick
}: FacilityInfoTabsProps) {
  const { language } = useLanguage();
  
  const translations = {
    NO: {
      availability: "Tilgjengelighet",
      about: "Om lokalet", 
      zones: "Soner",
      rules: "Regler",
      faq: "Spørsmål og svar"
    },
    EN: {
      availability: "Availability",
      about: "About",
      zones: "Zones", 
      rules: "Rules",
      faq: "FAQ"
    }
  };
  
  const t = translations[language];

  return (
    <Tabs defaultValue="availability" className="w-full">
      <TabsList className="grid w-full grid-cols-5 mb-6 h-12 text-base">
        <TabsTrigger value="availability" className="text-base font-medium">{t.availability}</TabsTrigger>
        <TabsTrigger value="about" className="text-base font-medium">{t.about}</TabsTrigger>
        <TabsTrigger value="zones" className="text-base font-medium">{t.zones}</TabsTrigger>
        <TabsTrigger value="rules" className="text-base font-medium">{t.rules}</TabsTrigger>
        <TabsTrigger value="faq" className="text-base font-medium">{t.faq}</TabsTrigger>
      </TabsList>
      
      <TabsContent value="availability" className="space-y-6 text-base">
        <AvailabilityTab 
          zones={zones} 
          startDate={new Date()}
          facilityId={facilityId}
          facilityName={facilityName}
          selectedSlots={selectedSlots}
          onSlotClick={onSlotClick}
        />
      </TabsContent>
      
      <TabsContent value="about" className="space-y-6 text-base">
        <EnhancedAboutTab 
          description={description}
          capacity={capacity}
          amenities={amenities}
          address={address}
          openingHours="08:00-22:00"
          area={area}
          zones={zones}
          hasAutoApproval={true}
        />
      </TabsContent>
      
      <TabsContent value="zones" className="space-y-6 text-base">
        <ZonesTab zones={zones} />
      </TabsContent>
      
      <TabsContent value="rules" className="space-y-6 text-base">
        <RulesTab />
      </TabsContent>
      
      <TabsContent value="faq" className="space-y-6 text-base">
        <FaqTab />
      </TabsContent>
    </Tabs>
  );
}
