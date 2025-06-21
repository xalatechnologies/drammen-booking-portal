
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FacilityImageManagement } from "./FacilityImageManagement";

interface FacilityFormTabsProps {
  facilityId?: number;
  children: React.ReactNode;
}

export const FacilityFormTabs: React.FC<FacilityFormTabsProps> = ({
  facilityId,
  children
}) => {
  return (
    <Tabs defaultValue="details" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="details">Facility Details</TabsTrigger>
        <TabsTrigger value="images" disabled={!facilityId}>
          Images ({facilityId ? 'Available' : 'Save facility first'})
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="details" className="space-y-6">
        {children}
      </TabsContent>
      
      <TabsContent value="images" className="space-y-6">
        {facilityId ? (
          <FacilityImageManagement facilityId={facilityId} />
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            Please save the facility first before managing images.
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
};
