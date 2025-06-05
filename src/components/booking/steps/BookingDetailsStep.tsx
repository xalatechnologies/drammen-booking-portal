
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
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { BookingFormValues, Zone } from "../types";
import { ZoneSelector } from "../ZoneSelector";

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
  
  const availableTimeSlots = [
    "08:00-10:00", "10:00-12:00", "12:00-14:00",
    "14:00-16:00", "16:00-18:00", "18:00-20:00", "20:00-22:00"
  ];

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

      {/* Date and Time Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-semibold text-gray-900 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-slate-600" />
                Dato
              </FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-4 text-left font-normal h-11 border-gray-300 hover:border-slate-400 text-base",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "dd.MM.yyyy")
                      ) : (
                        <span>Velg dato</span>
                      )}
                      <CalendarIcon className="ml-auto h-5 w-5 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
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
                Tidspunkt
              </FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="h-11 border-gray-300 focus:border-slate-700 text-base">
                    <SelectValue placeholder="Velg tidspunkt" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {availableTimeSlots.map((slot) => (
                    <SelectItem key={slot} value={slot} className="text-base">
                      {slot}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Zone Selection */}
      <FormField
        control={form.control}
        name="zoneId"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-base font-semibold text-gray-900 flex items-center gap-2">
              <MapPin className="h-5 w-5 text-slate-600" />
              Område/Sone
            </FormLabel>
            <ZoneSelector
              form={form}
              zones={facility.zones}
              selectedDate={watchedValues.date || new Date()}
              selectedTimeSlot={watchedValues.timeSlot || ""}
            />
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Attendees and Purpose */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

        <div className="md:col-span-2">
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
        </div>
      </div>
    </div>
  );
}
