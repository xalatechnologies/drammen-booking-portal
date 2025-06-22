
import React, { useRef } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FacilityFeaturesSection } from "./sections/FacilityFeaturesSection";
import { FacilityPricingSection } from "./sections/FacilityPricingSection";
import { FacilityOpeningHoursSection } from "./sections/FacilityOpeningHoursSection";
import { FacilityBlackoutSection } from "./sections/FacilityBlackoutSection";
import { UseFormReturn } from "react-hook-form";
import { FacilityFormData } from "./FacilityFormSchema";
import { toast } from "@/hooks/use-toast";

interface FacilityFormTabsProps {
  facilityId?: number;
  title: string;
  actions: React.ReactNode;
  children: React.ReactNode;
  onSubmit: (e: React.FormEvent) => void;
  form?: UseFormReturn<FacilityFormData>;
}

export const FacilityFormTabs: React.FC<FacilityFormTabsProps> = ({
  facilityId,
  title,
  actions,
  children,
  onSubmit,
  form
}) => {
  const featuresRef = useRef<{ saveData: () => Promise<boolean> }>(null);
  const pricingRef = useRef<{ saveData: () => Promise<boolean> }>(null);
  const openingHoursRef = useRef<{ saveData: () => Promise<boolean> }>(null);
  const blackoutRef = useRef<{ saveData: () => Promise<boolean> }>(null);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // First submit the main form
      await onSubmit(e);
      
      // Then save all sections if they exist
      const savePromises = [];
      
      if (featuresRef.current) {
        savePromises.push(featuresRef.current.saveData());
      }
      
      if (pricingRef.current) {
        savePromises.push(pricingRef.current.saveData());
      }
      
      if (openingHoursRef.current) {
        savePromises.push(openingHoursRef.current.saveData());
      }
      
      if (blackoutRef.current) {
        savePromises.push(blackoutRef.current.saveData());
      }

      const results = await Promise.all(savePromises);
      const allSuccessful = results.every(result => result === true);
      
      if (allSuccessful) {
        toast({
          title: "Success",
          description: "All facility data saved successfully",
        });
      } else {
        toast({
          title: "Warning", 
          description: "Some sections failed to save properly",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error('Error saving facility data:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to save facility data",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleFormSubmit} className="space-y-6">
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="pricing">Pricing</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
          <TabsTrigger value="blackouts">Blackouts</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent>
              {children}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="features" className="space-y-6">
          {form && (
            <FacilityFeaturesSection 
              ref={featuresRef}
              form={form}
              equipment={form.watch('equipment')}
              amenities={form.watch('amenities')}
              capacity={form.watch('capacity')}
            />
          )}
        </TabsContent>

        <TabsContent value="pricing" className="space-y-6">
          {form && (
            <FacilityPricingSection 
              ref={pricingRef}
              form={form}
            />
          )}
        </TabsContent>

        <TabsContent value="schedule" className="space-y-6">
          <FacilityOpeningHoursSection 
            ref={openingHoursRef}
            facilityId={facilityId}
          />
        </TabsContent>

        <TabsContent value="blackouts" className="space-y-6">
          <FacilityBlackoutSection 
            ref={blackoutRef}
            facilityId={facilityId}
          />
        </TabsContent>
      </Tabs>

      {actions}
    </form>
  );
};
