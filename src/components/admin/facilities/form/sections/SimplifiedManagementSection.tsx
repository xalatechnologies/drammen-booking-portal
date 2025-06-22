
import React, { forwardRef, useImperativeHandle, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FacilityImageManagement } from "../../FacilityImageManagement";
import { ZoneManagementView } from "../../ZoneManagementView";
import { FacilityBlackoutSection } from "./FacilityBlackoutSection";
import { Images, Map, Calendar } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface SimplifiedManagementSectionProps {
  facilityId: number;
}

export const SimplifiedManagementSection = forwardRef<
  { saveData: () => Promise<boolean> },
  SimplifiedManagementSectionProps
>(({ facilityId }, ref) => {
  const [activeTab, setActiveTab] = useState("images");

  useImperativeHandle(ref, () => ({
    saveData: async () => {
      try {
        // Management sections don't need explicit saving as they handle their own state
        toast({
          title: "Success",
          description: "Management settings are automatically saved",
        });
        return true;
      } catch (error) {
        console.error('Error in management section:', error);
        return false;
      }
    }
  }));

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Facility Management</h2>
        <p className="text-gray-600 text-lg">Manage images, zones, and availability for this facility</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 h-12 text-base">
          <TabsTrigger value="images" className="text-base font-medium">
            <Images className="w-4 h-4 mr-2" />
            Images
          </TabsTrigger>
          <TabsTrigger value="zones" className="text-base font-medium">
            <Map className="w-4 h-4 mr-2" />
            Zones
          </TabsTrigger>
          <TabsTrigger value="blackouts" className="text-base font-medium">
            <Calendar className="w-4 h-4 mr-2" />
            Blackout Periods
          </TabsTrigger>
        </TabsList>

        <TabsContent value="images" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Facility Images</CardTitle>
            </CardHeader>
            <CardContent>
              <FacilityImageManagement facilityId={facilityId} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="zones" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Zone Management</CardTitle>
            </CardHeader>
            <CardContent>
              <ZoneManagementView selectedFacilityId={facilityId} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="blackouts" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Blackout Periods</CardTitle>
            </CardHeader>
            <CardContent>
              <FacilityBlackoutSection 
                facilityId={facilityId} 
                form={null as any} // Not needed for this simplified version
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
});

SimplifiedManagementSection.displayName = "SimplifiedManagementSection";
