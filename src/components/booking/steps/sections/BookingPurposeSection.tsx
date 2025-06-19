
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { MessageSquare } from "lucide-react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { BookingFormValues } from "../../types";
import { useModelTranslation } from "@/hooks/useModelTranslation";

interface BookingPurposeSectionProps {
  form: UseFormReturn<BookingFormValues>;
}

export function BookingPurposeSection({ form }: BookingPurposeSectionProps) {
  const { getFieldLabel, getFieldPlaceholder, getSectionTitle } = useModelTranslation();

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
        <MessageSquare className="h-5 w-5 text-slate-600" />
        {getSectionTitle('booking', 'purpose')}
      </h3>
      
      <FormField
        control={form.control}
        name="purpose"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-base font-semibold text-gray-900 flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-slate-600" />
              {getFieldLabel('booking', 'purpose')}
            </FormLabel>
            <FormControl>
              <Textarea
                placeholder={getFieldPlaceholder('booking', 'purpose')}
                className="resize-none h-24 border-gray-300 focus:border-slate-700 text-base"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
