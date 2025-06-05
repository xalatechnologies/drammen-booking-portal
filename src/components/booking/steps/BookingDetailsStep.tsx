
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { Calendar, Clock, Users, MessageSquare, MapPin, Repeat, CreditCard, Trophy } from "lucide-react";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { BookingFormValues, Zone } from "../types";
import { EnhancedZoneSelector } from "../EnhancedZoneSelector";
import DateRangePicker from "../../search/DateRangePicker";
import TimeRangePicker from "../TimeRangePicker";
import { PriceBreakdown } from "../PriceBreakdown";
import { usePriceCalculation } from "@/hooks/usePriceCalculation";

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

  // Calculate price with more immediate feedback
  const { calculation, isLoading } = usePriceCalculation({
    facilityId: facility.id,
    zoneId: watchedValues.zoneId,
    startDate: watchedValues.date,
    endDate: watchedValues.endDate,
    timeSlot: watchedValues.timeSlot,
    customerType: watchedValues.customerType || 'private',
    bookingMode: watchedValues.bookingMode,
    eventType: watchedValues.eventType,
    ageGroup: watchedValues.ageGroup
  });

  return (
    <div className="space-y-6">
      {/* Customer Type, Event Type, and Age Group - In same line */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

        <FormField
          control={form.control}
          name="eventType"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-semibold text-gray-900 flex items-center gap-2">
                <Trophy className="h-5 w-5 text-slate-600" />
                Type arrangement
              </FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger className="h-11 border-gray-300 focus:border-slate-700">
                    <SelectValue placeholder="Velg type arrangement" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="training">Trening/Øvelse</SelectItem>
                    <SelectItem value="competition">Konkurranse/Turnering</SelectItem>
                    <SelectItem value="meeting">Møte/Kurs</SelectItem>
                    <SelectItem value="celebration">Fest/Feiring</SelectItem>
                    <SelectItem value="other">Annet</SelectItem>
                  </SelectContent>
                </Select>
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
                <Users className="h-5 w-5 text-slate-600" />
                Aldersgruppe
              </FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger className="h-11 border-gray-300 focus:border-slate-700">
                    <SelectValue placeholder="Velg aldersgruppe" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mixed">Blandet alder</SelectItem>
                    <SelectItem value="children">Barn (under 12 år)</SelectItem>
                    <SelectItem value="under-20">Ungdom (under 20 år)</SelectItem>
                    <SelectItem value="over-20">Voksne (over 20 år)</SelectItem>
                    <SelectItem value="adults">Voksne (over 67 år)</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

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

      {/* Date Range, Time Range, and Attendees */}
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

      {/* Price Calculation - Show as soon as we have basic info */}
      {(watchedValues.customerType && watchedValues.zoneId) && (
        <PriceBreakdown 
          calculation={calculation || { basePrice: 0, totalHours: 0, totalDays: 0, customerTypeDiscount: 0, weekendSurcharge: 0, subtotal: 0, finalPrice: 0, breakdown: [] }}
          isLoading={isLoading}
          showDetailed={true}
        />
      )}
    </div>
  );
}
