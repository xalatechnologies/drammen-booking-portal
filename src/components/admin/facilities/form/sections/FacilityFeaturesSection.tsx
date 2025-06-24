
import React, { forwardRef, useImperativeHandle } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UseFormReturn } from "react-hook-form";
import { FacilityFormData } from "../FacilityFormSchema";

interface FacilityFeaturesSectionProps {
  form: UseFormReturn<FacilityFormData>;
  equipment?: string[];
  amenities?: string[];
  capacity?: number;
}

export interface FeaturesSectionRef {
  saveData: () => Promise<boolean>;
}

export const FacilityFeaturesSection = forwardRef<FeaturesSectionRef, FacilityFeaturesSectionProps>(
  ({ form, equipment = [], amenities = [], capacity = 1 }, ref) => {
    useImperativeHandle(ref, () => ({
      saveData: async () => {
        try {
          // Save features data logic here
          console.log('Saving features data');
          return true;
        } catch (error) {
          console.error('Error saving features data:', error);
          return false;
        }
      }
    }));

    return (
      <Card>
        <CardHeader>
          <CardTitle>Features & Equipment</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="capacity">Capacity</Label>
            <Input
              id="capacity"
              type="number"
              {...form.register('capacity', { valueAsNumber: true })}
            />
          </div>
          
          <div className="text-center py-8 text-gray-500">
            <p>Equipment and amenities management will be available soon...</p>
          </div>
        </CardContent>
      </Card>
    );
  }
);

FacilityFeaturesSection.displayName = "FacilityFeaturesSection";
