
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { Users } from "lucide-react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { BookingFormValues } from "../../types";
import { CustomerTypeSection } from "./CustomerTypeSection";
import { useModelTranslation } from "@/hooks/useModelTranslation";

interface CustomerInfoSectionProps {
  form: UseFormReturn<BookingFormValues>;
}

export function CustomerInfoSection({ form }: CustomerInfoSectionProps) {
  const { getSectionTitle } = useModelTranslation();
  
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
        <Users className="h-5 w-5 text-slate-600" />
        {getSectionTitle('booking', 'customerInfo')}
      </h3>
      <CustomerTypeSection form={form} />
    </div>
  );
}
