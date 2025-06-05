
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { Calendar, Clock, Users, MessageSquare, MapPin } from "lucide-react";
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
    <div className="space-y-3">
      {/* Smart grid layout for maximum efficiency */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Date */}
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-1.5 text-sm font-medium text-gray-900">
                <Calendar className="h-3.5 w-3.5 text-slate-600" />
                Dato
              </FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal h-8 border-gray-300 hover:border-slate-400 text-sm",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "dd.MM.yyyy")
                      ) : (
                        <span>Velg dato</span>
                      )}
                      <CalendarIcon className="ml-auto h-3.5 w-3.5 opacity-50" />
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

        {/* Time Slot */}
        <FormField
          control={form.control}
          name="timeSlot"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-1.5 text-sm font-medium text-gray-900">
                <Clock className="h-3.5 w-3.5 text-slate-600" />
                Tidspunkt
              </FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="h-8 border-gray-300 focus:border-slate-700 text-sm">
                    <SelectValue placeholder="Velg tid" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {availableTimeSlots.map((slot) => (
                    <SelectItem key={slot} value={slot} className="text-sm">
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

      {/* Zone Selection - full width for prominence */}
      <FormField
        control={form.control}
        name="zoneId"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-1.5 text-sm font-medium text-gray-900">
              <MapPin className="h-3.5 w-3.5 text-slate-600" />
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

      {/* Compact booking mode selection */}
      <FormField
        control={form.control}
        name="bookingMode"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-medium text-gray-900">Type</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="flex flex-row gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="one-time" id="one-time" className="border-gray-400 text-slate-700 w-3.5 h-3.5" />
                  <Label htmlFor="one-time" className="text-xs font-medium">Engang</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="recurring" id="recurring" className="border-gray-400 text-slate-700 w-3.5 h-3.5" />
                  <Label htmlFor="recurring" className="text-xs font-medium">Gjentakende</Label>
                </div>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Smart two-column layout for efficiency */}
      <div className="grid grid-cols-2 gap-3">
        <FormField
          control={form.control}
          name="attendees"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-1.5 text-sm font-medium text-gray-900">
                <Users className="h-3.5 w-3.5 text-slate-600" />
                Deltakere
              </FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min="1"
                  max="1000"
                  placeholder="1"
                  className="h-8 border-gray-300 focus:border-slate-700 text-sm"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Empty space for visual balance */}
        <div></div>
      </div>

      {/* Purpose - compact textarea */}
      <FormField
        control={form.control}
        name="purpose"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-1.5 text-sm font-medium text-gray-900">
              <MessageSquare className="h-3.5 w-3.5 text-slate-600" />
              Formål
            </FormLabel>
            <FormControl>
              <Textarea
                placeholder="Kort beskrivelse av aktiviteten..."
                className="resize-none h-16 border-gray-300 focus:border-slate-700 text-sm"
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
