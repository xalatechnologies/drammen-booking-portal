
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { Calendar, Clock, Repeat } from "lucide-react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { BookingFormValues } from "../../types";
import DateRangePicker from "../../../search/DateRangePicker";
import TimeRangePicker from "../../TimeRangePicker";
import { useModelTranslation } from "@/hooks/useModelTranslation";
import { useTranslation } from "@/i18n/hooks/useTranslation";

interface BookingTimingSectionProps {
  form: UseFormReturn<BookingFormValues>;
}

export function BookingTimingSection({ form }: BookingTimingSectionProps) {
  const { getFieldLabel, getSectionTitle } = useModelTranslation();
  const { t } = useTranslation();
  const watchedValues = form.watch();

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
        <Clock className="h-5 w-5 text-slate-600" />
        {getSectionTitle('booking', 'timing')}
      </h3>

      {/* Booking Type */}
      <div className="space-y-3">
        <FormField
          control={form.control}
          name="bookingMode"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-semibold text-gray-900 flex items-center gap-2">
                <Repeat className="h-5 w-5 text-slate-600" />
                {getFieldLabel('booking', 'bookingMode')}
              </FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="grid grid-cols-2 gap-4"
                >
                  <div className="flex items-center space-x-3 border border-gray-200 rounded-lg p-4 hover:border-slate-300 transition-colors">
                    <RadioGroupItem value="one-time" id="one-time" className="border-gray-400 text-slate-700" />
                    <Label htmlFor="one-time" className="text-sm font-medium cursor-pointer">
                      {t('booking.types.engangs', {}, 'Engangsreservasjon')}
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 border border-gray-200 rounded-lg p-4 hover:border-slate-300 transition-colors">
                    <RadioGroupItem value="recurring" id="recurring" className="border-gray-400 text-slate-700" />
                    <Label htmlFor="recurring" className="text-sm font-medium cursor-pointer">
                      {t('booking.types.fastlan', {}, 'Gjentakende reservasjon')}
                    </Label>
                  </div>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Date Range and Time Range */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-semibold text-gray-900 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-slate-600" />
                {getFieldLabel('booking', 'date')}
              </FormLabel>
              <FormControl>
                <DateRangePicker
                  dateRange={field.value ? { from: field.value, to: watchedValues.endDate } : undefined}
                  setDateRange={(range) => {
                    field.onChange(range?.from);
                    if (range?.to) {
                      form.setValue('endDate', range.to);
                    }
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="timeSlot"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-semibold text-gray-900 flex items-center gap-2">
                <Clock className="h-5 w-5 text-slate-600" />
                {getFieldLabel('booking', 'timeSlot')}
              </FormLabel>
              <FormControl>
                <TimeRangePicker
                  timeRange={field.value}
                  setTimeRange={field.onChange}
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
