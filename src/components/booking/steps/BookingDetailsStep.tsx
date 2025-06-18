
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { Calendar, Clock, Users, MessageSquare, Repeat, Trophy } from "lucide-react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { BookingFormValues, Zone } from "../types";
import { EnhancedZoneSelector } from "../EnhancedZoneSelector";
import DateRangePicker from "../../search/DateRangePicker";
import TimeRangePicker from "../TimeRangePicker";
import { PriceBreakdown } from "../PriceBreakdown";
import { usePriceCalculation } from "@/hooks/usePriceCalculation";
import { ActorType } from "@/types/pricing";
import { CustomerTypeSection } from "./CustomerTypeSection";
import { RecurrencePatternButton } from "../RecurrencePatternButton";
import { RecurringBookingModal } from "../RecurringBookingModal";
import { RecurrencePattern } from "@/utils/recurrenceEngine";

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
  recurrencePattern: RecurrencePattern | null;
  onRecurrencePatternChange: (pattern: RecurrencePattern | null) => void;
}

// Customer type mapping to ActorType
const customerTypeToActorType = (customerType: string): ActorType => {
  switch (customerType) {
    case 'nonprofit': return 'lag-foreninger';
    case 'business': return 'private-firma';
    case 'youth': return 'private-person';
    case 'senior': return 'private-person';
    default: return 'private-person';
  }
};

export function BookingDetailsStep({ 
  form, 
  facility, 
  recurrencePattern, 
  onRecurrencePatternChange 
}: BookingDetailsStepProps) {
  const watchedValues = form.watch();
  const [showRecurrenceModal, setShowRecurrenceModal] = useState(false);

  // Calculate price with more immediate feedback
  const { calculation, isLoading } = usePriceCalculation({
    facilityId: facility.id,
    zoneId: watchedValues.zoneId,
    startDate: watchedValues.date,
    endDate: watchedValues.endDate,
    timeSlot: watchedValues.timeSlot,
    customerType: watchedValues.customerType ? customerTypeToActorType(watchedValues.customerType) : 'private-person',
    bookingMode: watchedValues.bookingMode,
    eventType: watchedValues.eventType,
    ageGroup: watchedValues.ageGroup
  });

  // Show pricing when we have minimum required info
  const shouldShowPricing = watchedValues.customerType && watchedValues.zoneId && watchedValues.date;

  const handleApplyRecurrencePattern = (pattern: RecurrencePattern) => {
    onRecurrencePatternChange(pattern);
    
    // Update booking mode based on pattern
    if (pattern.weekdays.length > 0 && pattern.timeSlots.length > 0) {
      form.setValue('bookingMode', 'recurring');
    }
  };

  return (
    <div className="space-y-6">
      {/* Customer Type, Event Type, and Age Group */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <CustomerTypeSection form={form} />

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

      {/* Recurrence Pattern Button */}
      <div className="space-y-4">
        <Label className="text-base font-semibold text-gray-900 flex items-center gap-2">
          <Repeat className="h-5 w-5 text-slate-600" />
          Type reservasjon
        </Label>
        <RecurrencePatternButton 
          pattern={recurrencePattern} 
          onClick={() => setShowRecurrenceModal(true)} 
        />
        
        {recurrencePattern && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-blue-800">
            <p className="font-medium">Gjentakende reservasjon opprettet</p>
            <p className="text-sm mt-1">
              {recurrenceEngine.getPatternDescription(recurrencePattern)}
              {recurrencePattern.endDate && (
                <span> frem til {recurrencePattern.endDate.toLocaleDateString('nb-NO')}</span>
              )}
            </p>
          </div>
        )}
      </div>

      {/* Recurrence Pattern Modal */}
      <RecurringBookingModal
        isOpen={showRecurrenceModal}
        onClose={() => setShowRecurrenceModal(false)}
        onApplyPattern={handleApplyRecurrencePattern}
      />

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

      {/* Price Calculation */}
      {shouldShowPricing && (
        <div className="space-y-2">
          {!watchedValues.timeSlot && (
            <div className="text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded-lg p-3">
              💡 Prisberegning basert på estimert 2-timers booking. Velg tidsperiode for nøyaktig pris.
            </div>
          )}
          <PriceBreakdown 
            calculation={calculation || { 
              basePrice: 0, 
              totalHours: 2, 
              totalDays: 1, 
              actorTypeDiscount: 0, 
              timeSlotMultiplier: 1,
              bookingTypeDiscount: 0,
              weekendSurcharge: 0, 
              subtotal: 0, 
              finalPrice: 0, 
              requiresApproval: false,
              breakdown: [] 
            }}
            isLoading={isLoading}
            showDetailed={true}
          />
        </div>
      )}
    </div>
  );
}
