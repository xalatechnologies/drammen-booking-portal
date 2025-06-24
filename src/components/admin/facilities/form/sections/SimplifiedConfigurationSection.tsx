
import React, { forwardRef, useImperativeHandle, useEffect, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FacilityFormData } from "../FacilityFormSchema";
import { useOpeningHoursStore } from "@/stores/useOpeningHoursStore";
import { DollarSign, Clock, Wrench, Accessibility, Plus, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface SimplifiedConfigurationSectionProps {
  form: UseFormReturn<FacilityFormData>;
  facilityId?: number;
}

const EQUIPMENT_OPTIONS = [
  "Kunstgress", "Fotballmål", "Tilskuerplasser", "Garderober", "Kafeteria",
  "Projector", "Kitchen", "Lighting", "Wi-Fi", "Sound system", "Lockers",
  "Vending machines", "First aid", "Parking"
];

const AMENITIES_OPTIONS = [
  "Parking", "Wi-Fi", "Cafeteria", "Lockers", "Vending machines", "First aid",
  "Accessible parking", "Baby changing", "Elevator", "Air conditioning"
];

const ACCESSIBILITY_OPTIONS = [
  "wheelchair", "Elevator access", "Visual aids", "Accessible parking",
  "Audio assistance", "Braille signage", "Wide doorways", "Accessible restrooms"
];

const DAYS_OF_WEEK = [
  { key: 1, label: "Monday" },
  { key: 2, label: "Tuesday" }, 
  { key: 3, label: "Wednesday" },
  { key: 4, label: "Thursday" },
  { key: 5, label: "Friday" },
  { key: 6, label: "Saturday" },
  { key: 0, label: "Sunday" }
];

export const SimplifiedConfigurationSection = forwardRef<
  { saveData: () => Promise<boolean> },
  SimplifiedConfigurationSectionProps
>(({ form, facilityId }, ref) => {
  const { openingHours, fetchOpeningHours, saveOpeningHours, setOpeningHours, updateOpeningHour } = useOpeningHoursStore();
  const [selectedEquipment, setSelectedEquipment] = useState<string[]>(form.watch('equipment') || []);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(form.watch('amenities') || []);
  const [selectedAccessibility, setSelectedAccessibility] = useState<string[]>(form.watch('accessibility_features') || []);

  useEffect(() => {
    if (facilityId) {
      fetchOpeningHours(facilityId);
    } else {
      // Initialize default opening hours for new facilities
      const defaultHours = DAYS_OF_WEEK.map(day => ({
        facility_id: 0,
        day_of_week: day.key,
        open_time: "07:00",
        close_time: "23:00",
        is_open: day.key !== 0, // Closed on Sunday by default
      }));
      setOpeningHours(defaultHours);
    }
  }, [facilityId, fetchOpeningHours, setOpeningHours]);

  useImperativeHandle(ref, () => ({
    saveData: async () => {
      if (!facilityId) return true;
      
      try {
        const success = await saveOpeningHours(facilityId);
        if (success) {
          toast({
            title: "Success",
            description: "Configuration saved successfully",
          });
        }
        return success;
      } catch (error) {
        console.error('Error saving configuration:', error);
        return false;
      }
    }
  }));

  const toggleArrayItem = (items: string[], item: string, setter: (items: string[]) => void, fieldName: keyof FacilityFormData) => {
    const newItems = items.includes(item) 
      ? items.filter(i => i !== item)
      : [...items, item];
    setter(newItems);
    form.setValue(fieldName, newItems);
  };

  return (
    <div className="space-y-8">
      {/* Pricing */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-xl flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Pricing & Booking Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormField
              control={form.control}
              name="price_per_hour"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-medium">Price per Hour (NOK) *</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      step="0.01"
                      placeholder="450"
                      className="text-base h-12"
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
                  <FormLabel className="text-base font-medium">Minimum Booking (hours)</FormLabel>
                  <Select onValueChange={(value) => field.onChange(parseInt(value))} defaultValue={field.value?.toString()}>
                    <FormControl>
                      <SelectTrigger className="text-base h-12">
                        <SelectValue />
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
              name="booking_lead_time_hours"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-medium">Booking Lead Time (hours)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number"
                      placeholder="2"
                      className="text-base h-12"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="max_advance_booking_days"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-medium">Max Advance Booking (days)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number"
                      placeholder="365"
                      className="text-base h-12"
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
                  <FormLabel className="text-base font-medium">Cancellation Deadline (hours)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number"
                      placeholder="24"
                      className="text-base h-12"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </CardContent>
      </Card>

      {/* Opening Hours */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-xl flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Opening Hours
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {DAYS_OF_WEEK.map((day) => {
              const dayHour = openingHours.find(h => h.day_of_week === day.key);
              return (
                <div key={day.key} className="grid grid-cols-4 gap-4 items-center p-4 border rounded-lg">
                  <div className="font-medium text-base">{day.label}</div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={dayHour?.is_open || false}
                      onCheckedChange={(checked) => 
                        updateOpeningHour(day.key, { is_open: !!checked })
                      }
                    />
                    <span className="text-base">Open</span>
                  </div>
                  
                  {dayHour?.is_open && (
                    <>
                      <Input
                        type="time"
                        value={dayHour.open_time}
                        onChange={(e) => updateOpeningHour(day.key, { open_time: e.target.value })}
                        className="text-base h-10"
                      />
                      <Input
                        type="time"
                        value={dayHour.close_time}
                        onChange={(e) => updateOpeningHour(day.key, { close_time: e.target.value })}
                        className="text-base h-10"
                      />
                    </>
                  )}
                  
                  {!dayHour?.is_open && (
                    <>
                      <span className="text-gray-400 text-base">Closed</span>
                      <span className="text-gray-400 text-base">Closed</span>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Equipment & Features */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-xl flex items-center gap-2">
            <Wrench className="w-5 h-5" />
            Equipment & Features
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <FormLabel className="text-base font-medium mb-3 block">Equipment</FormLabel>
            <div className="flex flex-wrap gap-2 mb-3">
              {selectedEquipment.map((item) => (
                <Badge key={item} variant="default" className="text-sm px-3 py-1">
                  {item}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="ml-2 h-4 w-4 p-0"
                    onClick={() => toggleArrayItem(selectedEquipment, item, setSelectedEquipment, 'equipment')}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              {EQUIPMENT_OPTIONS.filter(item => !selectedEquipment.includes(item)).map((item) => (
                <Button
                  key={item}
                  type="button"
                  variant="outline"
                  size="sm"
                  className="text-sm"
                  onClick={() => toggleArrayItem(selectedEquipment, item, setSelectedEquipment, 'equipment')}
                >
                  <Plus className="h-3 w-3 mr-1" />
                  {item}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <FormLabel className="text-base font-medium mb-3 block">Amenities</FormLabel>
            <div className="flex flex-wrap gap-2 mb-3">
              {selectedAmenities.map((item) => (
                <Badge key={item} variant="secondary" className="text-sm px-3 py-1">
                  {item}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="ml-2 h-4 w-4 p-0"
                    onClick={() => toggleArrayItem(selectedAmenities, item, setSelectedAmenities, 'amenities')}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              {AMENITIES_OPTIONS.filter(item => !selectedAmenities.includes(item)).map((item) => (
                <Button
                  key={item}
                  type="button"
                  variant="outline"
                  size="sm"
                  className="text-sm"
                  onClick={() => toggleArrayItem(selectedAmenities, item, setSelectedAmenities, 'amenities')}
                >
                  <Plus className="h-3 w-3 mr-1" />
                  {item}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Accessibility */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-xl flex items-center gap-2">
            <Accessibility className="w-5 h-5" />
            Accessibility Features
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <div className="flex flex-wrap gap-2 mb-3">
              {selectedAccessibility.map((item) => (
                <Badge key={item} variant="outline" className="text-sm px-3 py-1">
                  {item}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="ml-2 h-4 w-4 p-0"
                    onClick={() => toggleArrayItem(selectedAccessibility, item, setSelectedAccessibility, 'accessibility_features')}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              {ACCESSIBILITY_OPTIONS.filter(item => !selectedAccessibility.includes(item)).map((item) => (
                <Button
                  key={item}
                  type="button"
                  variant="outline"
                  size="sm"
                  className="text-sm"
                  onClick={() => toggleArrayItem(selectedAccessibility, item, setSelectedAccessibility, 'accessibility_features')}
                >
                  <Plus className="h-3 w-3 mr-1" />
                  {item}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
});

SimplifiedConfigurationSection.displayName = "SimplifiedConfigurationSection";
