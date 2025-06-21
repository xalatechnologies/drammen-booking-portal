
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { FacilityFormData, EQUIPMENT_OPTIONS, AMENITIES_OPTIONS, ACCESSIBILITY_OPTIONS } from "../FacilityFormSchema";

interface FacilityFeaturesSectionProps {
  form: UseFormReturn<FacilityFormData>;
}

export const FacilityFeaturesSection: React.FC<FacilityFeaturesSectionProps> = ({ form }) => {
  return (
    <div className="space-y-8">
      <FormField
        control={form.control}
        name="equipment"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-lg font-semibold">Equipment</FormLabel>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {EQUIPMENT_OPTIONS.map((equipment) => (
                <FormItem key={equipment} className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value?.includes(equipment)}
                      onCheckedChange={(checked) => {
                        const updatedEquipment = checked
                          ? [...(field.value || []), equipment]
                          : (field.value || []).filter((value) => value !== equipment);
                        field.onChange(updatedEquipment);
                      }}
                    />
                  </FormControl>
                  <FormLabel className="text-sm font-normal">
                    {equipment}
                  </FormLabel>
                </FormItem>
              ))}
            </div>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="amenities"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-lg font-semibold">Amenities</FormLabel>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {AMENITIES_OPTIONS.map((amenity) => (
                <FormItem key={amenity} className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value?.includes(amenity)}
                      onCheckedChange={(checked) => {
                        const updatedAmenities = checked
                          ? [...(field.value || []), amenity]
                          : (field.value || []).filter((value) => value !== amenity);
                        field.onChange(updatedAmenities);
                      }}
                    />
                  </FormControl>
                  <FormLabel className="text-sm font-normal">
                    {amenity}
                  </FormLabel>
                </FormItem>
              ))}
            </div>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="accessibility_features"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-lg font-semibold">Accessibility Features</FormLabel>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {ACCESSIBILITY_OPTIONS.map((feature) => (
                <FormItem key={feature} className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value?.includes(feature)}
                      onCheckedChange={(checked) => {
                        const updatedFeatures = checked
                          ? [...(field.value || []), feature]
                          : (field.value || []).filter((value) => value !== feature);
                        field.onChange(updatedFeatures);
                      }}
                    />
                  </FormControl>
                  <FormLabel className="text-sm font-normal">
                    {feature}
                  </FormLabel>
                </FormItem>
              ))}
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
