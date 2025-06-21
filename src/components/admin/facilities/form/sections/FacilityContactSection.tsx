
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FacilityFormData } from "../FacilityFormSchema";

interface FacilityContactSectionProps {
  form: UseFormReturn<FacilityFormData>;
}

export const FacilityContactSection: React.FC<FacilityContactSectionProps> = ({ form }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField
        control={form.control}
        name="contact_name"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-medium">Contact Name</FormLabel>
            <FormControl>
              <Input placeholder="Contact person name" className="h-9 text-sm" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="contact_phone"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-medium">Contact Phone</FormLabel>
            <FormControl>
              <Input placeholder="+47 123 45 678" className="h-9 text-sm" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="md:col-span-2">
        <FormField
          control={form.control}
          name="contact_email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium">Contact Email</FormLabel>
              <FormControl>
                <Input 
                  type="email" 
                  placeholder="contact@facility.com" 
                  className="h-9 text-sm"
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
