
import React, { useState } from "react";
import { useTranslation } from "@/i18n";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EnhancedAboutTab } from "./tabs/EnhancedAboutTab";
import { AvailabilityTab } from "./tabs/AvailabilityTab";
import { EnhancedFeaturesTab } from "./tabs/EnhancedFeaturesTab";
import { EnhancedRulesTab } from "./tabs/EnhancedRulesTab";
import { ZonesTab } from "./tabs/ZonesTab";
import { Zone } from "@/components/booking/types";
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
  facilityName: string;
  selectedSlots: SelectedTimeSlot[];
  onSlotsChange: (slots: SelectedTimeSlot[]) => void;
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
  selectedSlots,
  onSlotsChange
}: FacilityInfoTabsProps) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("description");

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  return (
    <div className="w-full">
      <Tabs defaultValue="description" className="w-full">
        <TabsList className="grid w-full grid-cols-5 h-auto p-1 bg-gray-100 rounded-lg mb-6">
          <TabsTrigger 
            value="description" 
            className="data-[state=active]:bg-white data-[state=active]:shadow-sm font-medium text-base py-3 px-4"
          >
            {t('facility.tabs.description')}
          </TabsTrigger>
          <TabsTrigger 
            value="availability" 
            className="data-[state=active]:bg-white data-[state=active]:shadow-sm font-medium text-base py-3 px-4"
          >
            {t('facility.tabs.availability')}
          </TabsTrigger>
          <TabsTrigger 
            value="zones" 
            className="data-[state=active]:bg-white data-[state=active]:shadow-sm font-medium text-base py-3 px-4"
          >
            {t('facility.tabs.zones')}
          </TabsTrigger>
          <TabsTrigger 
            value="features" 
            className="data-[state=active]:bg-white data-[state=active]:shadow-sm font-medium text-base py-3 px-4"
          >
            {t('facility.tabs.features')}
          </TabsTrigger>
          <TabsTrigger 
            value="rules" 
            className="data-[state=active]:bg-white data-[state=active]:shadow-sm font-medium text-base py-3 px-4"
          >
            {t('facility.tabs.rules')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="description" className="mt-0">
          <EnhancedAboutTab 
            description={description} 
            address={address}
            area={area}
            capacity={capacity}
          />
        </TabsContent>

        <TabsContent value="availability" className="mt-0">
          <AvailabilityTab 
            zones={zones} 
            facilityId={facilityId} 
            facilityName={facilityName}
            selectedSlots={selectedSlots}
            onSlotsChange={onSlotsChange}
          />
        </TabsContent>

        <TabsContent value="zones" className="mt-0">
          <ZonesTab zones={zones} />
        </TabsContent>

        <TabsContent value="features" className="mt-0">
          <EnhancedFeaturesTab amenities={amenities} equipment={equipment} />
        </TabsContent>

        <TabsContent value="rules" className="mt-0">
          <EnhancedRulesTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
