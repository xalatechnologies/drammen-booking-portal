
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Zap, Clock, AlertTriangle, CheckCircle, Info, MapPin } from "lucide-react";
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
        switch (conflict.conflictType) {
          case 'whole-facility-conflict':
            return (
              <Badge variant="destructive" className="flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" />
                Hele lokalet opptatt
              </Badge>
            );
          case 'sub-zone-conflict':
            return (
              <Badge variant="destructive" className="flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" />
                {conflict.conflictingZoneName} opptatt
              </Badge>
            );
          default:
            return (
              <Badge variant="destructive" className="flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" />
                Opptatt
              </Badge>
            );
        }
      }
      return (
        <Badge variant="secondary" className="flex items-center gap-1">
          <AlertTriangle className="h-3 w-3" />
          Ikke tilgjengelig
        </Badge>
      );
    }
    
    return (
      <Badge variant="default" className="bg-green-100 text-green-800 flex items-center gap-1">
        <CheckCircle className="h-3 w-3" />
        Tilgjengelig
      </Badge>
    );
  };

  const getAlternativeSuggestions = (zone: Zone) => {
    if (getZoneAvailability(zone).isAvailable) return null;
    
    const alternatives = conflictManager.getAlternativeZones(
      zone.id,
      selectedDate,
      selectedTimeSlot,
      form.watch("attendees") || 1
    );
    
    if (alternatives.length === 0) return null;
    
    return (
      <Alert className="mt-2">
        <Info className="h-4 w-4" />
        <AlertDescription>
          <strong>Alternative forslag:</strong>{" "}
          {alternatives.slice(0, 2).map(alt => alt.name).join(", ")}
          {alternatives.length > 2 && ` (+${alternatives.length - 2} flere)`}
        </AlertDescription>
      </Alert>
    );
  };

  return (
    <FormField
      control={form.control}
      name="zoneId"
      render={({ field }) => (
        <FormItem className="space-y-4">
          <FormLabel className="text-lg font-semibold">Velg sone</FormLabel>
          
          {/* Zone hierarchy explanation */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-blue-600 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-blue-900 mb-1">Soneinndeling</p>
                <p className="text-blue-800">
                  Du kan velge hele lokalet eller individuelle soner. 
                  Booking av hele lokalet reserverer alle soner samtidig.
                </p>
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
              className="space-y-4"
            >
              {zones.map((zone) => {
                const { isAvailable, conflict } = getZoneAvailability(zone);
                const isMainZone = zone.isMainZone;
                
                return (
                  <div key={zone.id} className="space-y-2">
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem 
                        value={zone.id} 
                        id={zone.id}
                        disabled={!isAvailable}
                      />
                      <Label 
                        htmlFor={zone.id} 
                        className={`flex-1 cursor-pointer ${!isAvailable ? 'opacity-60' : ''}`}
                      >
                        <Card className={`transition-all ${
                          selectedZoneId === zone.id 
                            ? 'ring-2 ring-blue-500 border-blue-200' 
                            : 'hover:border-gray-300'
                        } ${!isAvailable ? 'bg-gray-50' : ''} ${
                          isMainZone ? 'border-2 border-blue-300 bg-blue-50' : ''
                        }`}>
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start mb-3">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <h3 className="font-semibold text-lg">{zone.name}</h3>
                                  {isMainZone && (
                                    <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">
                                      Hele lokalet
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-sm text-gray-600 mb-2">{zone.description}</p>
                              </div>
                              <div className="text-right">
                                <div className="text-lg font-bold">{zone.pricePerHour} kr</div>
                                <div className="text-sm text-gray-500">per time</div>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-4 mb-3">
                              <div className="flex items-center gap-1 text-sm text-gray-600">
                                <Users className="h-4 w-4" />
                                <span>Maks {zone.capacity} personer</span>
                              </div>
                              {zone.area && (
                                <div className="flex items-center gap-1 text-sm text-gray-600">
                                  <MapPin className="h-4 w-4" />
                                  <span>{zone.area}</span>
                                </div>
                              )}
                              <div className="flex items-center gap-1 text-sm text-gray-600">
                                <Clock className="h-4 w-4" />
                                <span>Min {zone.bookingRules.minBookingDuration}t</span>
                              </div>
                            </div>
                            
                            <div className="flex flex-wrap gap-1 mb-3">
                              {zone.equipment.slice(0, 3).map((item, i) => (
                                <Badge key={i} variant="outline" className="text-xs">
                                  {item}
                                </Badge>
                              ))}
                              {zone.equipment.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{zone.equipment.length - 3} mer
                                </Badge>
                              )}
                            </div>
                            
                            <div className="flex justify-between items-center">
                              {getStatusBadge(zone)}
                              
                              {zone.adminInfo.contactPersonName && (
                                <div className="text-xs text-gray-500">
                                  Kontakt: {zone.adminInfo.contactPersonName}
                                </div>
                              )}
                            </div>

                            {/* Show zone hierarchy for main zones */}
                            {isMainZone && zone.subZones && (
                              <div className="mt-3 pt-3 border-t border-gray-200">
                                <p className="text-xs text-gray-600 mb-1">Inkluderer soner:</p>
                                <div className="flex flex-wrap gap-1">
                                  {zone.subZones.map(subZoneId => {
                                    const subZone = zones.find(z => z.id === subZoneId);
                                    return subZone ? (
                                      <Badge key={subZoneId} variant="outline" className="text-xs">
                                        {subZone.name}
                                      </Badge>
                                    ) : null;
                                  })}
                                </div>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      </Label>
                    </div>
                    
                    {/* Show conflict details and alternatives */}
                    {!isAvailable && conflict && (
                      <div className="ml-8 space-y-2">
                        <Alert variant="destructive">
                          <AlertTriangle className="h-4 w-4" />
                          <AlertDescription>
                            <strong>Ikke tilgjengelig:</strong>{" "}
                            {conflict.conflictType === 'whole-facility-conflict' 
                              ? `Hele lokalet er reservert av ${conflict.bookedBy}` 
                              : conflict.conflictType === 'sub-zone-conflict'
                              ? `${conflict.conflictingZoneName} er allerede reservert av ${conflict.bookedBy}`
                              : `Reservert av ${conflict.bookedBy}`
                            }
                          </AlertDescription>
                        </Alert>
                        {getAlternativeSuggestions(zone)}
                      </div>
                    )}
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
