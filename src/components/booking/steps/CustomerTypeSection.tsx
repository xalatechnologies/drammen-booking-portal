
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { CreditCard } from "lucide-react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BookingFormValues } from "../types";

interface CustomerTypeSectionProps {
  form: UseFormReturn<BookingFormValues>;
}

export function CustomerTypeSection({ form }: CustomerTypeSectionProps) {
  return (
    <FormField
      control={form.control}
      name="customerType"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-base font-semibold text-gray-900 flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-slate-600" />
            Prisgruppe
          </FormLabel>
          <FormControl>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <SelectTrigger className="h-11 border-gray-300 focus:border-slate-700">
                <SelectValue placeholder="Velg prisgruppe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="private">Privatperson</SelectItem>
                <SelectItem value="nonprofit">Frivillig organisasjon</SelectItem>
                <SelectItem value="business">Bedrift/Næringsdrivende</SelectItem>
                <SelectItem value="youth">Ungdom (under 20 år)</SelectItem>
                <SelectItem value="senior">Senior (over 67 år)</SelectItem>
              </SelectContent>
            </Select>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
