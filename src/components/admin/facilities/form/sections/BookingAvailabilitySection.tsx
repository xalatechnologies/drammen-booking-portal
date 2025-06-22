import React from "react";
import { UseFormReturn } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { FacilityFormData } from "../FacilityFormSchema";
import { AlertCircle, Clock, Percent, ThumbsUp } from "lucide-react";
import { MultiSelect } from "@/components/ui/multi-select";
import { BOOKING_TYPES } from "../FacilityFormSchema";
import { OpeningHoursEditor } from "./OpeningHoursEditor";
import { BlackoutPeriodsManager } from "./BlackoutPeriodsManager";


interface BookingAvailabilitySectionProps {
  form: UseFormReturn<FacilityFormData>;
}

export const BookingAvailabilitySection: React.FC<BookingAvailabilitySectionProps> = ({ form }) => {
  const bookingTypeOptions = BOOKING_TYPES.map(bt => ({ value: bt.value, label: bt.label }));

  return (
    <div className="space-y-8">
      {/* Booking Rules Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Booking Rules
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FormField
              control={form.control}
              name="booking_lead_time_hours"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">Booking Lead Time (Hours)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      className="h-11 text-base"
                      placeholder="e.g., 2"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="max_advance_booking_days"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">Max Advance Booking (Days)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      className="h-11 text-base"
                      placeholder="e.g., 365"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="cancellation_deadline_hours"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">Cancellation Deadline (Hours)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      className="h-11 text-base"
                      placeholder="e.g., 24"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="allowed_booking_types"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base">Allowed Booking Types</FormLabel>
                 <MultiSelect
                    options={bookingTypeOptions}
                    selected={field.value}
                    onChange={field.onChange}
                    className="w-full"
                  />
                <FormMessage />
              </FormItem>
            )}
          />
           <FormField
            control={form.control}
            name="has_auto_approval"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base flex items-center gap-2">
                     <ThumbsUp className="w-4 h-4" />
                    Automatic Approval
                  </FormLabel>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </CardContent>
      </Card>
      
      {/* Opening Hours */}
      <OpeningHoursEditor />

      {/* Blackout Periods */}
      <BlackoutPeriodsManager />
    </div>
  );
}; 