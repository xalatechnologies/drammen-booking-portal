
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Info, Calendar, List, HelpCircle, Shield } from "lucide-react";
import { DescriptionTab } from "./tabs/DescriptionTab";
import { AvailabilityTab } from "./tabs/AvailabilityTab";
import { FeaturesTab } from "./tabs/FeaturesTab";
import { FaqTab } from "./tabs/FaqTab";
import { RulesTab } from "./tabs/RulesTab";
import { Zone } from "@/components/booking/types";
import { getAmenityIcon } from "./utils/amenityIcons";

interface FacilityInfoTabsProps {
  description: string;
  capacity: number;
  equipment: string[];
  zones: Zone[];
  amenities: string[];
  address: string;
  zoneCards: React.ReactNode;
  facilityId?: string;
}

export function FacilityInfoTabs({
  description,
  capacity,
  equipment,
  zones,
  amenities,
  address,
  zoneCards,
  facilityId
}: FacilityInfoTabsProps) {
  return (
    <Tabs defaultValue="about" className="w-full">
      <TabsList className="grid w-full grid-cols-4 mb-6">
        <TabsTrigger value="about" className="flex items-center gap-2">
          <Info className="h-4 w-4" />
          Om lokalet
        </TabsTrigger>
        <TabsTrigger value="features" className="flex items-center gap-2">
          <List className="h-4 w-4" />
          Fasiliteter
        </TabsTrigger>
        <TabsTrigger value="faq" className="flex items-center gap-2">
          <HelpCircle className="h-4 w-4" />
          Ofte spurte spørsmål
        </TabsTrigger>
        <TabsTrigger value="rules" className="flex items-center gap-2">
          <Shield className="h-4 w-4" />
          Regler
        </TabsTrigger>
      </TabsList>

      <TabsContent value="about">
        <DescriptionTab 
          description={description} 
          capacity={capacity} 
          address={address} 
          zones={zones}
          facilityId={facilityId}
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

      <TabsContent value="faq">
        <FaqTab />
      </TabsContent>

      <TabsContent value="rules">
        <RulesTab />
      </TabsContent>
    </Tabs>
  );
}
