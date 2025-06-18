
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { MapPin, Info } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { BookingFormValues, Zone } from "./types";
import { FormField, FormItem, FormControl, FormMessage, FormLabel } from "@/components/ui/form";
import { ZoneConflictManager, ExistingBooking } from "@/utils/zoneConflictManager";
import { ZoneCard } from "./ZoneCard";

interface EnhancedZoneSelectorProps {
  form: UseFormReturn<BookingFormValues>;
  zones: Zone[];
  selectedDate: Date;
  selectedTimeSlot: string;
  existingBookings?: ExistingBooking[];
  onZoneSelect?: (zone: Zone) => void;
}

export function EnhancedZoneSelector({ 
  form, 
  zones, 
  selectedDate, 
  selectedTimeSlot,
  existingBookings = [],
  onZoneSelect
}: EnhancedZoneSelectorProps) {
  const selectedZoneId = form.watch("zoneId");
  const attendees = form.watch("attendees") || 1;
  const conflictManager = new ZoneConflictManager(zones, existingBookings);
  
  const getZoneAvailability = (zone: Zone) => {
    const conflict = conflictManager.checkZoneConflict(zone.id, selectedDate, selectedTimeSlot);
    return {
      isAvailable: !conflict && zone.isActive,
      conflict: conflict ? {
        id: `conflict-${zone.id}`,
        zoneId: zone.id,
        date: selectedDate,
        timeSlot: selectedTimeSlot,
        bookedBy: conflict.bookedBy || 'Ukjent'
      } as ExistingBooking : null
    };
  };

  // Organize zones - show main zones first, then sub zones
  const mainZones = zones.filter(zone => zone.isMainZone);
  const subZones = zones.filter(zone => !zone.isMainZone);

  return (
    <FormField
      control={form.control}
      name="zoneId"
      render={({ field }) => (
        <FormItem className="space-y-4">
          <FormLabel className="text-lg font-semibold flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Velg område
          </FormLabel>
          
          {/* Smart tip */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <Info className="h-4 w-4 text-slate-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-slate-800">
                <p><strong>For {attendees} personer:</strong> Vi anbefaler soner med kapasitet på minst {Math.ceil(attendees * 1.2)} personer</p>
              </div>
            </div>
          </div>

          <FormControl>
            <RadioGroup
              onValueChange={(value) => {
                field.onChange(value);
                const selectedZone = zones.find(z => z.id === value);
                if (selectedZone && onZoneSelect) {
                  onZoneSelect(selectedZone);
                }
              }}
              value={field.value}
              className="space-y-3"
            >
              {/* Main zones first, then sub zones */}
              {[...mainZones, ...subZones]
                .sort((a, b) => {
                  // Available zones before unavailable
                  const aAvailable = getZoneAvailability(a).isAvailable;
                  const bAvailable = getZoneAvailability(b).isAvailable;
                  if (aAvailable && !bAvailable) return -1;
                  if (!aAvailable && bAvailable) return 1;
                  return 0;
                })
                .map((zone) => {
                  const { isAvailable, conflict } = getZoneAvailability(zone);
                  const isSelected = selectedZoneId === zone.id;
                  
                  return (
                    <div key={zone.id} className="flex items-start space-x-3">
                      <RadioGroupItem 
                        value={zone.id} 
                        id={zone.id}
                        disabled={!isAvailable}
                        className="mt-4"
                      />
                      <Label htmlFor={zone.id} className="flex-1 cursor-pointer">
                        <ZoneCard
                          zone={zone}
                          isSelected={isSelected}
                          isAvailable={isAvailable}
                          conflict={conflict}
                        />
                      </Label>
                    </div>
                  );
                })}
            </RadioGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
