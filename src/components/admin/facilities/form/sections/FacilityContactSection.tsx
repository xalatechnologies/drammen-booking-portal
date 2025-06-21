
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
            <FormLabel>Contact Name</FormLabel>
            <FormControl>
              <Input placeholder="Contact person name" {...field} />
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
            <FormLabel>Contact Phone</FormLabel>
            <FormControl>
              <Input placeholder="+47 123 45 678" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="contact_email"
        render={({ field }) => (
          <FormItem className="md:col-span-2">
            <FormLabel>Contact Email</FormLabel>
            <FormControl>
              <Input 
                type="email" 
                placeholder="contact@facility.com" 
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
