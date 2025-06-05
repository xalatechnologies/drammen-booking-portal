
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Zone } from "@/components/booking/types";
import { getAmenityIcon } from "./utils/amenityIcons";
import { DescriptionTab } from "./tabs/DescriptionTab";
import { FeaturesTab } from "./tabs/FeaturesTab";
import { AvailabilityTab } from "./tabs/AvailabilityTab";

interface FacilityInfoTabsProps {
  description: string;
  capacity: number;
  equipment: string[];
  zones: Zone[];
  amenities: string[];
  address: string;
  quickFacts: React.ReactNode;
  zoneCards: React.ReactNode;
}

export function FacilityInfoTabs({ 
  description, 
  capacity, 
  equipment, 
  zones, 
  amenities, 
  address,
  quickFacts,
  zoneCards
}: FacilityInfoTabsProps) {
  const [date] = useState<Date>(new Date());

  return (
    <Tabs defaultValue="description" className="bg-white rounded-lg shadow-sm border">
      <TabsList className="w-full border-b p-0 h-auto bg-gray-50 rounded-none">
        <TabsTrigger 
          value="description" 
          className="flex-1 py-4 px-6 rounded-none text-base font-medium data-[state=active]:bg-slate-700 data-[state=active]:text-white data-[state=active]:border-b-0 data-[state=active]:shadow-none hover:bg-slate-100 hover:text-slate-700 transition-colors"
        >
          Om lokalet
        </TabsTrigger>
        <TabsTrigger 
          value="features" 
          className="flex-1 py-4 px-6 rounded-none text-base font-medium data-[state=active]:bg-slate-700 data-[state=active]:text-white data-[state=active]:border-b-0 data-[state=active]:shadow-none hover:bg-slate-100 hover:text-slate-700 transition-colors"
        >
          Fasiliteter
        </TabsTrigger>
        <TabsTrigger 
          value="availability" 
          className="flex-1 py-4 px-6 rounded-none text-base font-medium data-[state=active]:bg-slate-700 data-[state=active]:text-white data-[state=active]:border-b-0 data-[state=active]:shadow-none hover:bg-slate-100 hover:text-slate-700 transition-colors"
        >
          Tilgjengelighet
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="description">
        <DescriptionTab 
          description={description} 
          capacity={capacity} 
          quickFacts={quickFacts} 
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
      
      <TabsContent value="availability">
        <AvailabilityTab 
          zones={zones}
          startDate={date} 
        />
      </TabsContent>
    </Tabs>
  );
}
