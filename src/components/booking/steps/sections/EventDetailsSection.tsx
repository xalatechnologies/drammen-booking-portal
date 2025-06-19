
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { Trophy, Users as UsersIcon } from "lucide-react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { BookingFormValues } from "../../types";
import { EnumSelect } from "@/components/common/EnumSelect";
import { useModelTranslation } from "@/hooks/useModelTranslation";

interface EventDetailsSectionProps {
  form: UseFormReturn<BookingFormValues>;
}

export function EventDetailsSection({ form }: EventDetailsSectionProps) {
  const { getFieldLabel, getFieldPlaceholder, getSectionTitle } = useModelTranslation();

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
        <Trophy className="h-5 w-5 text-slate-600" />
        {getSectionTitle('booking', 'eventDetails')}
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <FormField
          control={form.control}
          name="eventType"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-semibold text-gray-900 flex items-center gap-2">
                <Trophy className="h-5 w-5 text-slate-600" />
                {getFieldLabel('booking', 'eventType')}
              </FormLabel>
              <FormControl>
                <EnumSelect
                  enumType="EventType"
                  value={field.value}
                  onValueChange={field.onChange}
                  placeholder={getFieldPlaceholder('booking', 'eventType')}
                  showDescription={false}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="ageGroup"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-semibold text-gray-900 flex items-center gap-2">
                <UsersIcon className="h-5 w-5 text-slate-600" />
                {getFieldLabel('booking', 'ageGroup')}
              </FormLabel>
              <FormControl>
                <EnumSelect
                  enumType="AgeGroup"
                  value={field.value}
                  onValueChange={field.onChange}
                  placeholder={getFieldPlaceholder('booking', 'ageGroup')}
                  showDescription={false}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="attendees"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-semibold text-gray-900 flex items-center gap-2">
                <UsersIcon className="h-5 w-5 text-slate-600" />
                {getFieldLabel('booking', 'attendees')}
              </FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min="1"
                  max="1000"
                  placeholder={getFieldPlaceholder('booking', 'attendees')}
                  className="h-11 border-gray-300 focus:border-slate-700 text-base"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
