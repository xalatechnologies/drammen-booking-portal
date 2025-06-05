
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { Calendar, Clock, Users, MessageSquare, MapPin } from "lucide-react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
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
    "08:00-10:00",
    "10:00-12:00", 
    "12:00-14:00",
    "14:00-16:00",
    "16:00-18:00",
    "18:00-20:00",
    "20:00-22:00"
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 pb-2 border-b">
        <Calendar className="h-5 w-5 text-blue-600" />
        <h3 className="text-xl font-medium">Reservasjonsdetaljer</h3>
      </div>
      
      {/* Booking Mode Selection */}
      <FormField
        control={form.control}
        name="bookingMode"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel className="text-base font-medium">Type reservasjon</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="flex flex-col space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="one-time" id="one-time" />
                  <Label htmlFor="one-time">Engangsreservasjon</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="date-range" id="date-range" />
                  <Label htmlFor="date-range">Periode (flere dager)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="recurring" id="recurring" />
                  <Label htmlFor="recurring">Gjentakende reservasjon</Label>
                </div>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Date Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel className="flex items-center gap-1.5 mb-2">
                <Calendar className="h-4 w-4 text-blue-600" />
                {watchedValues.bookingMode === 'date-range' ? 'Startdato' : 'Dato'}
              </FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal h-10",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "dd.MM.yyyy")
                      ) : (
                        <span>Velg dato</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
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
        
        {watchedValues.bookingMode === 'date-range' && (
          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="flex items-center gap-1.5 mb-2">
                  <Calendar className="h-4 w-4 text-blue-600" />
                  Sluttdato
                </FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal h-10",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "dd.MM.yyyy")
                        ) : (
                          <span>Velg sluttdato</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => 
                        date < new Date() || 
                        (watchedValues.date && date <= watchedValues.date)
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
      </div>

      {/* Time Slot Selection */}
      <FormField
        control={form.control}
        name="timeSlot"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-1.5 mb-2">
              <Clock className="h-4 w-4 text-blue-600" />
              Tidspunkt
            </FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Velg et tidsintervall" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {availableTimeSlots.map((slot) => (
                  <SelectItem key={slot} value={slot}>
                    {slot}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Zone Selection */}
      <FormField
        control={form.control}
        name="zoneId"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-1.5 mb-2">
              <MapPin className="h-4 w-4 text-blue-600" />
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

      {/* Purpose */}
      <FormField
        control={form.control}
        name="purpose"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-1.5 mb-2">
              <MessageSquare className="h-4 w-4 text-blue-600" />
              Formål med reservasjonen
            </FormLabel>
            <FormControl>
              <Textarea
                placeholder="Beskriv formålet med reservasjonen..."
                className="resize-none min-h-[80px]"
                {...field}
              />
            </FormControl>
            <FormDescription>
              Gi en kort beskrivelse av aktiviteten eller arrangementet.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Number of Attendees */}
      <FormField
        control={form.control}
        name="attendees"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-1.5 mb-2">
              <Users className="h-4 w-4 text-blue-600" />
              Antall deltakere
            </FormLabel>
            <FormControl>
              <Input
                type="number"
                min="1"
                max="1000"
                placeholder="1"
                className="h-10"
                {...field}
                onChange={(e) => field.onChange(Number(e.target.value))}
              />
            </FormControl>
            <FormDescription>
              Angi forventet antall personer som vil bruke lokalet.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
