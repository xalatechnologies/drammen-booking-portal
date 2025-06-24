
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FacilityListView } from "./FacilityListView";
import { FacilityFormView } from "./FacilityFormView";
import { OpeningHoursManagement } from "./OpeningHoursManagement";
import { BlackoutPeriodsManagement } from "./BlackoutPeriodsManagement";
import { ZoneManagementView } from "./ZoneManagementView";
import { PricingRulesManagement } from "./PricingRulesManagement";
import { FacilityAnalyticsDashboard } from "./FacilityAnalyticsDashboard";

interface FacilityManagementTabsProps {
  selectedFacilityId?: number;
  onFacilitySelect?: (id: number) => void;
}

export const FacilityManagementTabs: React.FC<FacilityManagementTabsProps> = ({
  selectedFacilityId,
  onFacilitySelect
}) => {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="facilities" className="w-full">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="facilities">Facilities</TabsTrigger>
          <TabsTrigger value="zones">Zones</TabsTrigger>
          <TabsTrigger value="hours">Opening Hours</TabsTrigger>
          <TabsTrigger value="blackouts">Blackouts</TabsTrigger>
          <TabsTrigger value="pricing">Pricing</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="facilities" className="space-y-4">
          <FacilityListView 
            selectedFacilityId={selectedFacilityId}
            onFacilitySelect={onFacilitySelect}
          />
        </TabsContent>

        <TabsContent value="zones" className="space-y-4">
          <ZoneManagementView selectedFacilityId={selectedFacilityId?.toString()} />
        </TabsContent>

        <TabsContent value="hours" className="space-y-4">
          <OpeningHoursManagement selectedFacilityId={selectedFacilityId?.toString()} />
        </TabsContent>

        <TabsContent value="blackouts" className="space-y-4">
          {selectedFacilityId && (
            <BlackoutPeriodsManagement facilityId={selectedFacilityId.toString()} />
          )}
        </TabsContent>

        <TabsContent value="pricing" className="space-y-4">
          <PricingRulesManagement selectedFacilityId={selectedFacilityId} />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <FacilityAnalyticsDashboard selectedFacilityId={selectedFacilityId?.toString()} />
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <div className="text-center py-8 text-muted-foreground">
            Settings management coming soon...
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
