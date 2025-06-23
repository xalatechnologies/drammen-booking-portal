
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Zone } from "@/components/booking/types";
import { getAmenityIcon } from "./utils/amenityIcons";
import { FeaturesTab } from "./tabs/FeaturesTab";
import { FaqTab } from "./tabs/FaqTab";
import { RulesTab } from "./tabs/RulesTab";
import { GeneralInfoTab } from "./tabs/GeneralInfoTab";
import { ZonesTab } from "./tabs/ZonesTab";
import { useLanguage } from "@/contexts/LanguageContext";

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
  facilityId = "",
  facilityName = ""
}: FacilityInfoTabsProps) {
  const { language } = useLanguage();

  const translations = {
    NO: {
      general: "Generell info",
      zones: "Soner",
      facilities: "Lokaler", 
      rules: "Regler",
      faq: "FAQ"
    },
    EN: {
      general: "General info",
      zones: "Zones",
      facilities: "Facilities",
      rules: "Rules", 
      faq: "FAQ"
    }
  };

  const t = translations[language];

  return (
    <Tabs defaultValue="general" className="bg-white rounded-lg shadow-sm border">
      <TabsList className="w-full border-b p-0 h-auto bg-gray-50 rounded-none">
        <TabsTrigger 
          value="general" 
          className="flex-1 py-4 px-6 rounded-none text-base font-medium data-[state=active]:bg-[#1e3a8a] data-[state=active]:text-white data-[state=active]:border-b-0 data-[state=active]:shadow-none hover:bg-[#1e40af] hover:text-white transition-colors"
        >
          {t.general}
        </TabsTrigger>
        <TabsTrigger 
          value="zones" 
          className="flex-1 py-4 px-6 rounded-none text-base font-medium data-[state=active]:bg-[#1e3a8a] data-[state=active]:text-white data-[state=active]:border-b-0 data-[state=active]:shadow-none hover:bg-[#1e40af] hover:text-white transition-colors"
        >
          {t.zones}
        </TabsTrigger>
        <TabsTrigger 
          value="facilities" 
          className="flex-1 py-4 px-6 rounded-none text-base font-medium data-[state=active]:bg-[#1e3a8a] data-[state=active]:text-white data-[state=active]:border-b-0 data-[state=active]:shadow-none hover:bg-[#1e40af] hover:text-white transition-colors"
        >
          {t.facilities}
        </TabsTrigger>
        <TabsTrigger 
          value="rules" 
          className="flex-1 py-4 px-6 rounded-none text-base font-medium data-[state=active]:bg-[#1e3a8a] data-[state=active]:text-white data-[state=active]:border-b-0 data-[state=active]:shadow-none hover:bg-[#1e40af] hover:text-white transition-colors"
        >
          {t.rules}
        </TabsTrigger>
        <TabsTrigger 
          value="faq" 
          className="flex-1 py-4 px-6 rounded-none text-base font-medium data-[state=active]:bg-[#1e3a8a] data-[state=active]:text-white data-[state=active]:border-b-0 data-[state=active]:shadow-none hover:bg-[#1e40af] hover:text-white transition-colors"
        >
          {t.faq}
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="general">
        <GeneralInfoTab 
          description={description}
          capacity={capacity}
          address={address}
          area={area}
          suitableFor={suitableFor}
          zones={zones}
          facilityId={facilityId}
          facilityName={facilityName}
        />
      </TabsContent>
      
      <TabsContent value="zones">
        <ZonesTab 
          zones={zones}
          facilityId={facilityId}
        />
      </TabsContent>
      
      <TabsContent value="facilities">
        <FeaturesTab 
          capacity={capacity} 
          equipment={equipment} 
          amenities={amenities}
          getAmenityIcon={getAmenityIcon}
        />
      </TabsContent>

      <TabsContent value="rules">
        <RulesTab />
      </TabsContent>

      <TabsContent value="faq">
        <FaqTab />
      </TabsContent>
    </Tabs>
  );
}
