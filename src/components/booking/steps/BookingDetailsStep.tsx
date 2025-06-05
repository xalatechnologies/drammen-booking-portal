
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
import { Slider } from "@/components/ui/slider";

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
  
  // Convert time to hour number for slider
  const timeToHour = (time: string) => {
    if (!time) return 8;
    const [hours] = time.split(':').map(Number);
    return hours;
  };

  // Convert hour number back to time string
  const hourToTime = (hour: number) => {
    return `${hour.toString().padStart(2, '0')}:00`;
  };

  const handleTimeRangeChange = (values: number[]) => {
    const [startHour, endHour] = values;
    form.setValue('timeSlot', `${hourToTime(startHour)}-${hourToTime(endHour)}`);
  };

  const getCurrentTimeRange = () => {
    const timeSlot = watchedValues.timeSlot || '08:00-10:00';
    if (timeSlot.includes('-')) {
      const [start, end] = timeSlot.split('-');
      return [timeToHour(start), timeToHour(end)];
    }
    return [8, 10];
  };

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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <FormField
          control={form.control}
          name="dateRange"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-semibold text-gray-900 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-slate-600" />
                Datoperiode
              </FormLabel>
              <FormControl>
                <DateRangePicker
                  dateRange={field.value}
                  setDateRange={field.onChange}
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
                Tidsperiode
              </FormLabel>
              <FormControl>
                <div className="space-y-3">
                  <Slider
                    value={getCurrentTimeRange()}
                    onValueChange={handleTimeRangeChange}
                    min={6}
                    max={23}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>{hourToTime(getCurrentTimeRange()[0])}</span>
                    <span>{hourToTime(getCurrentTimeRange()[1])}</span>
                  </div>
                </div>
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
                <Users className="h-5 w-5 text-slate-600" />
                Antall deltakere
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
