
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { FacilityFormData, BOOKING_TYPES } from "../FacilityFormSchema";

interface FacilityConfigSectionProps {
  form: UseFormReturn<FacilityFormData>;
}

export const FacilityConfigSection: React.FC<FacilityConfigSectionProps> = ({ form }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <FormField
          control={form.control}
          name="price_per_hour"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price per Hour (NOK)</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  step="0.01"
                  placeholder="450.00"
                  {...field}
                  onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="time_slot_duration"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Time Slot Duration (hours)</FormLabel>
              <Select onValueChange={(value) => field.onChange(parseInt(value))} defaultValue={field.value?.toString()}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="1">1 hour</SelectItem>
                  <SelectItem value="2">2 hours</SelectItem>
                  <SelectItem value="3">3 hours</SelectItem>
                  <SelectItem value="4">4 hours</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <FormField
          control={form.control}
          name="booking_lead_time_hours"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Booking Lead Time (hours)</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  placeholder="2"
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                />
              </FormControl>
              <FormDescription>Minimum hours before booking starts</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="max_advance_booking_days"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Max Advance Booking (days)</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  placeholder="365"
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                />
              </FormControl>
              <FormDescription>Maximum days in advance for booking</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="cancellation_deadline_hours"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cancellation Deadline (hours)</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  placeholder="24"
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                />
              </FormControl>
              <FormDescription>Hours before booking for free cancellation</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="space-y-4">
        <FormField
          control={form.control}
          name="allowed_booking_types"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Allowed Booking Types</FormLabel>
              <div className="grid grid-cols-2 gap-4">
                {BOOKING_TYPES.map((type) => (
                  <FormItem key={type.value} className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value?.includes(type.value as any)}
                        onCheckedChange={(checked) => {
                          const updatedTypes = checked
                            ? [...(field.value || []), type.value]
                            : (field.value || []).filter((value) => value !== type.value);
                          field.onChange(updatedTypes);
                        }}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="text-sm font-normal">
                        {type.label}
                      </FormLabel>
                    </div>
                  </FormItem>
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex items-center space-x-8">
          <FormField
            control={form.control}
            name="has_auto_approval"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Auto Approval</FormLabel>
                  <FormDescription>
                    Automatically approve eligible bookings
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="is_featured"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Featured Facility</FormLabel>
                  <FormDescription>
                    Show in featured listings
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );
};
