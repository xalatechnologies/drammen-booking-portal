
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FacilityFormData, FACILITY_TYPES } from "../FacilityFormSchema";

interface FacilityBasicSectionProps {
  form: UseFormReturn<FacilityFormData>;
}

export const FacilityBasicSection: React.FC<FacilityBasicSectionProps> = ({ form }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-medium">Facility Name *</FormLabel>
            <FormControl>
              <Input placeholder="Enter facility name" className="h-9 text-sm" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="type"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-medium">Facility Type *</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue placeholder="Select facility type" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {FACILITY_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="area"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-medium">Area/Location *</FormLabel>
            <FormControl>
              <Input placeholder="e.g., Drammen, Kongsberg" className="h-9 text-sm" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="capacity"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-medium">Capacity *</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                placeholder="Number of people"
                className="h-9 text-sm"
                {...field}
                onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="area_sqm"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-medium">Area (m²)</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                placeholder="Square meters"
                className="h-9 text-sm"
                {...field}
                onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="md:col-span-2">
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium">Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Describe the facility and its features"
                  className="min-h-[80px] text-sm"
                  {...field}
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
