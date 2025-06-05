
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Users, AlertTriangle, CheckCircle, Info, MapPin, Building, Clock } from "lucide-react";
import { BookingFormValues, Zone } from "./types";
import { FormField, FormItem, FormControl, FormMessage, FormLabel } from "@/components/ui/form";
import { ZoneConflictManager, ExistingBooking } from "@/utils/zoneConflictManager";
import { Alert, AlertDescription } from "@/components/ui/alert";

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
      conflict
    };
  };

  const getStatusBadge = (zone: Zone) => {
    const { isAvailable, conflict } = getZoneAvailability(zone);
    
    if (!isAvailable) {
      if (conflict) {
        return (
          <Badge variant="destructive" className="text-xs">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Opptatt
          </Badge>
        );
      }
      return (
        <Badge variant="secondary" className="text-xs">
          <AlertTriangle className="h-3 w-3 mr-1" />
          Ikke tilgjengelig
        </Badge>
      );
    }
    
    return (
      <Badge variant="default" className="bg-green-100 text-green-800 text-xs">
        <CheckCircle className="h-3 w-3 mr-1" />
        Tilgjengelig
      </Badge>
    );
  };

  const renderZoneCard = (zone: Zone) => {
    const { isAvailable, conflict } = getZoneAvailability(zone);
    const isSelected = selectedZoneId === zone.id;
    
    return (
      <Card className={`transition-all cursor-pointer ${
        isSelected 
          ? 'ring-2 ring-slate-700 border-slate-300 bg-slate-50' 
          : isAvailable
            ? 'hover:border-slate-300 hover:shadow-sm'
            : 'opacity-60'
      }`}>
        <CardContent className="p-4">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-semibold text-base">{zone.name}</h3>
                {zone.isMainZone && (
                  <Badge variant="outline" className="bg-slate-100 text-slate-800 text-xs">
                    <Building className="h-3 w-3 mr-1" />
                    Komplett
                  </Badge>
                )}
              </div>
              
              {/* Compact info row */}
              <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>{zone.capacity}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>Min {zone.bookingRules.minBookingDuration}t</span>
                </div>
                <div className="ml-auto">
                  {getStatusBadge(zone)}
                </div>
              </div>

              {/* Equipment preview */}
              {zone.equipment.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {zone.equipment.slice(0, 2).map((item, i) => (
                    <Badge key={i} variant="outline" className="text-xs px-2 py-0.5">
                      {item}
                    </Badge>
                  ))}
                  {zone.equipment.length > 2 && (
                    <Badge variant="outline" className="text-xs px-2 py-0.5">
                      +{zone.equipment.length - 2}
                    </Badge>
                  )}
                </div>
              )}

              {/* Sub-zones for main zone */}
              {zone.isMainZone && zone.subZones && (
                <p className="text-xs text-gray-500">
                  Inkluderer: {zone.subZones.map(id => zones.find(z => z.id === id)?.name).filter(Boolean).join(", ")}
                </p>
              )}
            </div>
            
            {/* Price */}
            <div className="text-right ml-4">
              <div className="text-lg font-bold text-gray-900">{zone.pricePerHour} kr</div>
              <div className="text-xs text-gray-500">per time</div>
            </div>
          </div>
          
          {/* Conflict warning */}
          {!isAvailable && conflict && (
            <Alert variant="destructive" className="mt-3">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="text-xs">
                {conflict.conflictType === 'whole-facility-conflict' 
                  ? `Hele lokalet er reservert av ${conflict.bookedBy}` 
                  : `Reservert av ${conflict.bookedBy}`
                }
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    );
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
                .map((zone) => (
                  <div key={zone.id} className="flex items-start space-x-3">
                    <RadioGroupItem 
                      value={zone.id} 
                      id={zone.id}
                      disabled={!getZoneAvailability(zone).isAvailable}
                      className="mt-4"
                    />
                    <Label htmlFor={zone.id} className="flex-1 cursor-pointer">
                      {renderZoneCard(zone)}
                    </Label>
                  </div>
                ))}
            </RadioGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
