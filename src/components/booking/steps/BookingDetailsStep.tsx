
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { Calendar, CalendarRange, Repeat } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ZoneSelector } from "../ZoneSelector";
import { BookingFormValues, Zone } from "../types";
import { format } from "date-fns";
import { nb } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface BookingDetailsStepProps {
  form: UseFormReturn<BookingFormValues>;
  maxCapacity: number;
  zones: Zone[];
  availableTimeSlots: {
    date: Date;
    slots: { start: string; end: string; available: boolean }[];
  }[];
}

export function BookingDetailsStep({ form, maxCapacity, zones, availableTimeSlots }: BookingDetailsStepProps) {
  const bookingMode = form.watch("bookingMode");
  const selectedDate = form.watch("date");
  const selectedTimeSlot = form.watch("timeSlot");
  const selectedZoneId = form.watch("zoneId");
  
  // Find selected zone to get its capacity
  const selectedZone = zones.find(zone => zone.id === selectedZoneId);
  const effectiveMaxCapacity = selectedZone?.capacity || maxCapacity;

  // Get available time slots for selected date
  const daySlots = availableTimeSlots.find(
    day => day.date.toDateString() === selectedDate?.toDateString()
  )?.slots || [];

  return (
    <div className="space-y-6">
      {/* Booking Mode Selection */}
      <FormField
        control={form.control}
        name="bookingMode"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel className="text-base font-semibold">Type booking</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="grid grid-cols-1 md:grid-cols-3 gap-4"
              >
                <div className="flex items-center space-x-3">
                  <RadioGroupItem value="one-time" id="one-time" />
                  <Label htmlFor="one-time" className="flex-1 cursor-pointer">
                    <Card className={cn(
                      "transition-all",
                      bookingMode === "one-time" ? "ring-2 ring-blue-500 border-blue-200" : "hover:border-gray-300"
                    )}>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <Calendar className="h-5 w-5 text-blue-600" />
                          <div>
                            <h3 className="font-medium">Engangsreservasjon</h3>
                            <p className="text-sm text-gray-600">Én spesifikk dato</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Label>
                </div>
                
                <div className="flex items-center space-x-3">
                  <RadioGroupItem value="date-range" id="date-range" />
                  <Label htmlFor="date-range" className="flex-1 cursor-pointer">
                    <Card className={cn(
                      "transition-all",
                      bookingMode === "date-range" ? "ring-2 ring-blue-500 border-blue-200" : "hover:border-gray-300"
                    )}>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <CalendarRange className="h-5 w-5 text-green-600" />
                          <div>
                            <h3 className="font-medium">Periode</h3>
                            <p className="text-sm text-gray-600">Flere påfølgende dager</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Label>
                </div>
                
                <div className="flex items-center space-x-3">
                  <RadioGroupItem value="recurring" id="recurring" />
                  <Label htmlFor="recurring" className="flex-1 cursor-pointer">
                    <Card className={cn(
                      "transition-all",
                      bookingMode === "recurring" ? "ring-2 ring-blue-500 border-blue-200" : "hover:border-gray-300"
                    )}>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <Repeat className="h-5 w-5 text-purple-600" />
                          <div>
                            <h3 className="font-medium">Gjentakende</h3>
                            <p className="text-sm text-gray-600">Regelmessige reservasjoner</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Label>
                </div>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Date Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Startdato</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP", { locale: nb })
                      ) : (
                        <span>Velg dato</span>
                      )}
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) => date < new Date() || date < new Date("1900-01-01")}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* End Date for range and recurring bookings */}
        {(bookingMode === "date-range" || bookingMode === "recurring") && (
          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Sluttdato</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP", { locale: nb })
                        ) : (
                          <span>Velg sluttdato</span>
                        )}
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date < new Date() || date < new Date("1900-01-01")}
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
            <FormLabel>Tidspunkt</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Velg tidspunkt" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {daySlots.map((slot) => (
                  <SelectItem 
                    key={`${slot.start}-${slot.end}`} 
                    value={`${slot.start}-${slot.end}`}
                    disabled={!slot.available}
                  >
                    {slot.start} - {slot.end} {!slot.available && "(Opptatt)"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Zone Selection */}
      <ZoneSelector 
        form={form}
        zones={zones}
        selectedDate={selectedDate || new Date()}
        selectedTimeSlot={selectedTimeSlot || ""}
      />

      {/* Purpose */}
      <FormField
        control={form.control}
        name="purpose"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Formål med reservasjonen</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Beskriv formålet med reservasjonen..."
                className="min-h-[100px]"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Attendees */}
      <FormField
        control={form.control}
        name="attendees"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Antall deltakere</FormLabel>
            <FormControl>
              <Input
                type="number"
                min="1"
                max={effectiveMaxCapacity}
                {...field}
                onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
              />
            </FormControl>
            <p className="text-sm text-gray-600">
              Maksimalt {effectiveMaxCapacity} deltakere for valgt sone
            </p>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
