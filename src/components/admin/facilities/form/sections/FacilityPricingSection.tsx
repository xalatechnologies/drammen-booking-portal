
import React, { forwardRef, useImperativeHandle } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UseFormReturn } from "react-hook-form";
import { FacilityFormData } from "../FacilityFormSchema";

interface FacilityPricingSectionProps {
  form: UseFormReturn<FacilityFormData>;
  facilityId?: number;
}

export interface PricingSectionRef {
  saveData: () => Promise<boolean>;
}

export const FacilityPricingSection = forwardRef<PricingSectionRef, FacilityPricingSectionProps>(
  ({ form, facilityId }, ref) => {
    useImperativeHandle(ref, () => ({
      saveData: async () => {
        try {
          console.log('Saving pricing data for facility:', facilityId);
          return true;
        } catch (error) {
          console.error('Error saving pricing data:', error);
          return false;
        }
      }
    }));

    return (
      <Card>
        <CardHeader>
          <CardTitle>Pricing Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="price_per_hour">Price per Hour</Label>
            <Input
              id="price_per_hour"
              type="number"
              step="0.01"
              {...form.register('price_per_hour', { valueAsNumber: true })}
            />
          </div>
          
          <div className="text-center py-8 text-gray-500">
            <p>Advanced pricing rules will be available soon...</p>
          </div>
        </CardContent>
      </Card>
    );
  }
);

FacilityPricingSection.displayName = "FacilityPricingSection";
