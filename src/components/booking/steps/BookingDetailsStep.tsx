
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { Calendar, Clock, Users, MessageSquare, MapPin, Repeat } from "lucide-react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { BookingFormValues, Zone } from "../types";
import { EnhancedZoneSelector } from "../EnhancedZoneSelector";
import DateRangePicker from "../../search/DateRangePicker";
import TimeRangePicker from "../TimeRangePicker";

export interface BookingDetailsStepProps {
  form: UseFormReturn<BookingFormValues>;
  facility: {
    id: string | undefined;
    name: string;
    zones: Zone[];
    availableTimes: {
      date: Date;
      slots: { start: string; end: string; available: boolean }[];
    }[];
  };
}

export function BookingDetailsStep({ form, facility }: BookingDetailsStepProps) {
  const watchedValues = form.watch();

  return (
    <div className="space-y-6">
      {/* Booking Type */}
      <div className="space-y-3">
        <FormField
          control={form.control}
          name="bookingMode"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-semibold text-gray-900 flex items-center gap-2">
                <Repeat className="h-5 w-5 text-slate-600" />
                Type reservasjon
              </FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="grid grid-cols-2 gap-4"
                >
                  <div className="flex items-center space-x-3 border border-gray-200 rounded-lg p-4 hover:border-slate-300 transition-colors">
                    <RadioGroupItem value="one-time" id="one-time" className="border-gray-400 text-slate-700" />
                    <Label htmlFor="one-time" className="text-sm font-medium cursor-pointer">Engangsreservasjon</Label>
                  </div>
                  <div className="flex items-center space-x-3 border border-gray-200 rounded-lg p-4 hover:border-slate-300 transition-colors">
                    <RadioGroupItem value="recurring" id="recurring" className="border-gray-400 text-slate-700" />
                    <Label htmlFor="recurring" className="text-sm font-medium cursor-pointer">Gjentakende reservasjon</Label>
                  </div>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Date Range, Time Range, and Attendees on same line */}
      <div className="grid grid-cols-1 md:grid-cols-7 gap-6">
        <div className="md:col-span-3">
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-semibold text-gray-900 flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-slate-600" />
                  Datoperiode
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
        </div>

        <div className="md:col-span-3">
          <FormField
            control={form.control}
            name="timeSlot"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-semibold text-gray-900 flex items-center gap-2">
                  <Clock className="h-5 w-5 text-slate-600" />
                  Tidsperiode
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

        <div className="md:col-span-1">
          <FormField
            control={form.control}
            name="attendees"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-semibold text-gray-900 flex items-center gap-2">
                  <Users className="h-5 w-5 text-slate-600" />
                  Antall
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="1"
                    max="1000"
                    placeholder="1"
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

      {/* Purpose */}
      <FormField
        control={form.control}
        name="purpose"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-base font-semibold text-gray-900 flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-slate-600" />
              Formål med reservasjonen
            </FormLabel>
            <FormControl>
              <Textarea
                placeholder="Beskriv kort hva lokalet skal brukes til..."
                className="resize-none h-24 border-gray-300 focus:border-slate-700 text-base"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Zone Selection */}
      <EnhancedZoneSelector
        form={form}
        zones={facility.zones}
        selectedDate={watchedValues.date || new Date()}
        selectedTimeSlot={watchedValues.timeSlot || ""}
      />
    </div>
  );
}
