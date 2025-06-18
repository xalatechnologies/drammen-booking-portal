
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Zone } from "@/components/booking/types";
import { getAmenityIcon } from "./utils/amenityIcons";
import { DescriptionTab } from "./tabs/DescriptionTab";
import { FeaturesTab } from "./tabs/FeaturesTab";
import { FaqTab } from "./tabs/FaqTab";
import { RulesTab } from "./tabs/RulesTab";

interface FacilityInfoTabsProps {
  description: string;
  capacity: number;
  equipment: string[];
  zones: Zone[];
  amenities: string[];
  address: string;
  zoneCards: React.ReactNode;
}

export function FacilityInfoTabs({ 
  description, 
  capacity, 
  equipment, 
  zones, 
  amenities, 
  address,
  zoneCards
}: FacilityInfoTabsProps) {
  return (
    <Tabs defaultValue="description" className="bg-white rounded-lg shadow-sm border">
      <TabsList className="w-full border-b p-0 h-auto bg-gray-50 rounded-none">
        <TabsTrigger 
          value="description" 
          className="flex-1 py-4 px-6 rounded-none text-base font-medium data-[state=active]:bg-[#1e3a8a] data-[state=active]:text-white data-[state=active]:border-b-0 data-[state=active]:shadow-none hover:bg-[#1e40af] hover:text-white transition-colors"
        >
          Om lokalet
        </TabsTrigger>
        <TabsTrigger 
          value="features" 
          className="flex-1 py-4 px-6 rounded-none text-base font-medium data-[state=active]:bg-[#1e3a8a] data-[state=active]:text-white data-[state=active]:border-b-0 data-[state=active]:shadow-none hover:bg-[#1e40af] hover:text-white transition-colors"
        >
          Fasiliteter
        </TabsTrigger>
        <TabsTrigger 
          value="rules" 
          className="flex-1 py-4 px-6 rounded-none text-base font-medium data-[state=active]:bg-[#1e3a8a] data-[state=active]:text-white data-[state=active]:border-b-0 data-[state=active]:shadow-none hover:bg-[#1e40af] hover:text-white transition-colors"
        >
          Regler
        </TabsTrigger>
        <TabsTrigger 
          value="faq" 
          className="flex-1 py-4 px-6 rounded-none text-base font-medium data-[state=active]:bg-[#1e3a8a] data-[state=active]:text-white data-[state=active]:border-b-0 data-[state=active]:shadow-none hover:bg-[#1e40af] hover:text-white transition-colors"
        >
          FAQ
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="description">
        <DescriptionTab 
          description={description} 
          capacity={capacity} 
          address={address}
          zones={zones}
        />
      </TabsContent>
      
      <TabsContent value="features">
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
