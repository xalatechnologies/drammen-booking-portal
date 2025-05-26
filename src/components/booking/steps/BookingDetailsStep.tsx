
import React from "react";
import { z } from "zod";
import { format, addDays, addMonths } from "date-fns";
import { nb } from "date-fns/locale";
import {
  CalendarDays,
  Clock,
  Users,
  Info,
  CalendarRange,
  Repeat,
  HelpCircle,
  PlusCircle,
} from "lucide-react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  RadioGroup,
  RadioGroupItem
} from "@/components/ui/radio-group";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { getRecurrenceDescription } from "@/utils/bookingConflict";
import { UseFormReturn } from "react-hook-form";
import { BookingFormValues } from "../types";

interface BookingDetailsStepProps {
  form: UseFormReturn<BookingFormValues>;
  availableTimeSlots: {
    date: Date;
    slots: { start: string; end: string; available: boolean }[];
  }[];
  maxCapacity: number;
}

export function BookingDetailsStep({ form, availableTimeSlots, maxCapacity }: BookingDetailsStepProps) {
  // Get current selected date from form
  const selectedDate = form.watch("date") || new Date();
  const bookingMode = form.watch("bookingMode");
  const recurrenceData = form.watch("recurrence");
  const recurrenceFrequency = recurrenceData?.frequency;
  const recurrenceInterval = recurrenceData?.interval;
  const recurrenceCount = recurrenceData?.count;
  const recurrenceUntil = recurrenceData?.until;
  
  // Get available time slots for the selected date
  const availableSlotsForDate = availableTimeSlots.find(
    (dateSlots) => 
      dateSlots.date && selectedDate && dateSlots.date.toDateString() === selectedDate.toDateString()
  )?.slots || [];

  // Calculate default end date suggestion (1 week from start)
  const suggestedEndDate = selectedDate ? addDays(selectedDate, 7) : addDays(new Date(), 7);

  const getBookingModeDescription = (mode: 'one-time' | 'date-range' | 'recurring') => {
    switch (mode) {
      case 'one-time':
        return 'Reserver for en enkelt dag og tidsintervall.';
      case 'date-range':
        return 'Reserver for flere påfølgende dager i samme tidsintervall.';
      case 'recurring':
        return 'Opprett en gjentagende reservasjon med fast mønster.';
      default:
        return '';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 pb-2 border-b">
        <Info className="h-5 w-5 text-blue-600" />
        <h3 className="text-xl font-medium">Reservasjonsdetaljer</h3>
      </div>
      
      {/* Booking Mode Selection - Enhanced with icons and cards */}
      <FormField
        control={form.control}
        name="bookingMode"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-base">Velg type reservasjon</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2"
              >
                <div className={`border-2 rounded-lg p-4 cursor-pointer transition-all
                  ${field.value === 'one-time' 
                    ? 'border-blue-600 bg-blue-50/50' 
                    : 'border-gray-200 hover:border-blue-200'}`}
                >
                  <FormItem className="flex flex-col items-center space-y-2 space-x-0">
                    <FormControl>
                      <RadioGroupItem value="one-time" className="sr-only" />
                    </FormControl>
                    <CalendarDays className="h-8 w-8 text-blue-600" />
                    <FormLabel className="font-medium text-center cursor-pointer">
                      Enkelt dag
                    </FormLabel>
                    <p className="text-xs text-center text-gray-500">
                      {getBookingModeDescription('one-time')}
                    </p>
                  </FormItem>
                </div>
                
                <div className={`border-2 rounded-lg p-4 cursor-pointer transition-all
                  ${field.value === 'date-range' 
                    ? 'border-blue-600 bg-blue-50/50' 
                    : 'border-gray-200 hover:border-blue-200'}`}
                >
                  <FormItem className="flex flex-col items-center space-y-2 space-x-0">
                    <FormControl>
                      <RadioGroupItem value="date-range" className="sr-only" />
                    </FormControl>
                    <CalendarRange className="h-8 w-8 text-blue-600" />
                    <FormLabel className="font-medium text-center cursor-pointer">
                      Datointervall
                    </FormLabel>
                    <p className="text-xs text-center text-gray-500">
                      {getBookingModeDescription('date-range')}
                    </p>
                  </FormItem>
                </div>
                
                <div className={`border-2 rounded-lg p-4 cursor-pointer transition-all
                  ${field.value === 'recurring' 
                    ? 'border-blue-600 bg-blue-50/50' 
                    : 'border-gray-200 hover:border-blue-200'}`}
                >
                  <FormItem className="flex flex-col items-center space-y-2 space-x-0">
                    <FormControl>
                      <RadioGroupItem value="recurring" className="sr-only" />
                    </FormControl>
                    <Repeat className="h-8 w-8 text-blue-600" />
                    <FormLabel className="font-medium text-center cursor-pointer">
                      Gjentakende
                    </FormLabel>
                    <p className="text-xs text-center text-gray-500">
                      {getBookingModeDescription('recurring')}
                    </p>
                  </FormItem>
                </div>
              </RadioGroup>
            </FormControl>
          </FormItem>
        )}
      />
      
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="flex items-center gap-1.5 mb-2">
                  <CalendarDays className="h-4 w-4 text-blue-600" />
                  {bookingMode === 'date-range' ? 'Startdato' : bookingMode === 'recurring' ? 'Første dato' : 'Dato'}
                </FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className="w-full pl-3 text-left font-normal flex justify-between items-center h-10"
                      >
                        {field.value ? format(field.value, "EEEE d. MMMM yyyy", { locale: nb }) : "Velg dato"}
                        <CalendarDays className="h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={(date) => date && field.onChange(date)}
                      className="rounded border shadow-sm p-3 pointer-events-auto"
                      disabled={(date) => {
                        // Disable dates without available slots and past dates
                        const isPastDate = date < new Date(new Date().setHours(0, 0, 0, 0));
                        const hasNoSlots = !availableTimeSlots.some(
                          (dateSlots) => dateSlots.date && dateSlots.date.toDateString() === date.toDateString()
                        );
                        return isPastDate || hasNoSlots;
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormDescription>
                  Kun datoer med ledige tider vises.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* End date for date range mode */}
          {bookingMode === 'date-range' && (
            <FormField
              control={form.control}
              name="endDate"
              render={({ field }) => (
                <FormItem className="flex flex-col mt-4">
                  <FormLabel className="flex items-center gap-1.5 mb-2">
                    <CalendarDays className="h-4 w-4 text-blue-600" />
                    Sluttdato
                  </FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className="w-full pl-3 text-left font-normal flex justify-between items-center h-10"
                        >
                          {field.value ? format(field.value, "EEEE d. MMMM yyyy", { locale: nb }) : format(suggestedEndDate, "EEEE d. MMMM yyyy", { locale: nb })}
                          <CalendarDays className="h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value || suggestedEndDate}
                        onSelect={(date) => date && field.onChange(date)}
                        className="rounded border shadow-sm p-3 pointer-events-auto"
                        disabled={(date) => {
                          return selectedDate ? date < selectedDate : false;
                        }}
                        defaultMonth={selectedDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    Må være etter startdatoen.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>

        <div className="flex flex-col space-y-4">
          <FormField
            control={form.control}
            name="timeSlot"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-1.5 mb-2">
                  <Clock className="h-4 w-4 text-blue-600" />
                  Tidsintervall
                </FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="h-10">
                      <SelectValue placeholder="Velg tidspunkt" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {availableSlotsForDate.filter(slot => slot.available).length > 0 ? (
                      availableSlotsForDate
                        .filter(slot => slot.available)
                        .map((slot, i) => (
                          <SelectItem key={i} value={`${slot.start}-${slot.end}`}>
                            {slot.start} - {slot.end}
                          </SelectItem>
                        ))
                    ) : (
                      <SelectItem disabled value="no-slots">
                        Ingen ledige tidspunkter denne dagen
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
                <FormDescription>
                  {bookingMode === 'date-range' 
                    ? 'Samme tidsintervall brukes for alle dager i perioden.' 
                    : bookingMode === 'recurring' 
                      ? 'Samme tidsintervall brukes for alle gjentagelser.' 
                      : 'Kun ledige tider vises.'}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

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
                    {...field} 
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                    value={field.value || ''}
                    min={1} 
                    max={maxCapacity} 
                    className="h-10"
                  />
                </FormControl>
                <FormDescription className="flex items-center">
                  <span>Maksimal kapasitet: {maxCapacity} personer</span>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span>
                          <HelpCircle className="h-4 w-4 text-blue-600 ml-1 inline cursor-help" />
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">Antall deltakere hjelper oss å sørge for at lokalet er riktig klargjort.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Recurring booking options - Enhanced UI */}
          {bookingMode === 'recurring' && (
            <RecurringBookingOptions
              form={form}
              recurrenceFrequency={recurrenceFrequency}
              recurrenceInterval={recurrenceInterval}
              recurrenceUntil={recurrenceUntil}
              recurrenceCount={recurrenceCount}
              selectedDate={selectedDate}
            />
          )}
        </div>
      </div>

      <FormField
        control={form.control}
        name="purpose"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-1.5 mb-2">
              <Info className="h-4 w-4 text-blue-600" />
              Formål med reservasjonen
            </FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Beskriv aktiviteten eller arrangementet som skal gjennomføres" 
                className="min-h-[100px] resize-y" 
                {...field} 
              />
            </FormControl>
            <FormDescription>
              Gi en kort beskrivelse av hva lokalet skal brukes til. Dette hjelper administrasjonen å vurdere reservasjonen.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}

interface RecurringBookingOptionsProps {
  form: UseFormReturn<BookingFormValues>;
  recurrenceFrequency?: 'daily' | 'weekly' | 'monthly';
  recurrenceInterval?: number;
  recurrenceUntil?: Date;
  recurrenceCount?: number;
  selectedDate: Date;
}

function RecurringBookingOptions({
  form, 
  recurrenceFrequency,
  recurrenceInterval,
  recurrenceUntil,
  recurrenceCount,
  selectedDate
}: RecurringBookingOptionsProps) {
  return (
    <div className="bg-blue-50 p-4 rounded-md border border-blue-100 mb-2">
      <h4 className="font-medium text-blue-700 flex items-center mb-2">
        <Repeat className="h-4 w-4 mr-1" />
        Gjentagelsesinnstillinger
      </h4>
      
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="recurrence.frequency"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm">Frekvens</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder="Velg frekvens" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="daily">Daglig</SelectItem>
                    <SelectItem value="weekly">Ukentlig</SelectItem>
                    <SelectItem value="monthly">Månedlig</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="recurrence.interval"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm">Intervall</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    {...field} 
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                    value={field.value || ''}
                    min={1} 
                    max={30}
                    className="h-9"
                  />
                </FormControl>
                <FormDescription className="text-xs">
                  {recurrenceFrequency === 'daily' && 'Hver X dag'}
                  {recurrenceFrequency === 'weekly' && 'Hver X uke'}
                  {recurrenceFrequency === 'monthly' && 'Hver X måned'}
                </FormDescription>
              </FormItem>
            )}
          />
        </div>
        
        <div className="pt-2 border-t border-blue-100">
          <FormLabel className="text-sm mb-2 block">Gjentagelsen avsluttes:</FormLabel>
          
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="recurrence.count"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center gap-2">
                    <FormLabel className="text-sm whitespace-nowrap mb-0">Etter</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        {...field} 
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                        value={field.value || ''}
                        min={1} 
                        max={100}
                        disabled={!!recurrenceUntil}
                        placeholder="10"
                        className="h-9"
                      />
                    </FormControl>
                    <span className="text-sm">ganger</span>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="recurrence.until"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center gap-2">
                    <FormLabel className="text-sm whitespace-nowrap mb-0">På dato</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={field.value ? "outline" : "secondary"}
                            className="h-9 px-3"
                            onClick={() => {
                              if (!field.value) {
                                // Default to 3 months in the future if not set
                                field.onChange(addMonths(new Date(), 3));
                                form.setValue('recurrence.count', undefined);
                              }
                            }}
                          >
                            {field.value 
                              ? format(field.value, "dd.MM.yy") 
                              : <PlusCircle className="h-4 w-4 mr-1" />
                            }
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value || undefined}
                          onSelect={(date) => {
                            field.onChange(date);
                            if (date) {
                              form.setValue('recurrence.count', undefined);
                            }
                          }}
                          disabled={(date) => date <= selectedDate}
                          initialFocus
                          className="rounded p-3 pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                    {field.value && (
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="h-6 w-6 p-0 rounded-full"
                        onClick={() => field.onChange(undefined)}
                      >
                        ×
                      </Button>
                    )}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <p className="text-xs text-blue-700 mt-2">
            Velg enten antall ganger eller sluttdato for gjentagelsen.
          </p>
        </div>
        
        {/* Preview of recurrence pattern */}
        {(recurrenceFrequency && recurrenceInterval) && (
          <div className="text-sm mt-2 bg-blue-100 p-2 rounded text-blue-800">
            <span className="font-medium">Mønster:</span> {getRecurrenceDescription(
              recurrenceFrequency,
              recurrenceInterval
            )}
            {recurrenceUntil && (
              <span> til {format(recurrenceUntil, "d. MMMM yyyy", { locale: nb })}</span>
            )}
            {recurrenceCount && (
              <span> for {recurrenceCount} ganger</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
