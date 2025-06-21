
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FacilityFormData } from "../FacilityFormSchema";

interface FacilityAddressSectionProps {
  form: UseFormReturn<FacilityFormData>;
}

export const FacilityAddressSection: React.FC<FacilityAddressSectionProps> = ({ form }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="md:col-span-2">
        <FormField
          control={form.control}
          name="address_street"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium">Street Address *</FormLabel>
              <FormControl>
                <Input placeholder="Street name and number" className="h-9 text-sm" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="address_city"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-medium">City *</FormLabel>
            <FormControl>
              <Input placeholder="City name" className="h-9 text-sm" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="address_postal_code"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-medium">Postal Code *</FormLabel>
            <FormControl>
              <Input placeholder="e.g., 3019" className="h-9 text-sm" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="address_country"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-medium">Country</FormLabel>
            <FormControl>
              <Input className="h-9 text-sm" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-2 gap-3">
        <FormField
          control={form.control}
          name="latitude"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium">Latitude</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  step="any"
                  placeholder="59.7428"
                  className="h-9 text-sm"
                  {...field}
                  onChange={(e) => field.onChange(parseFloat(e.target.value) || undefined)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="longitude"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium">Longitude</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  step="any"
                  placeholder="10.2045"
                  className="h-9 text-sm"
                  {...field}
                  onChange={(e) => field.onChange(parseFloat(e.target.value) || undefined)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};
