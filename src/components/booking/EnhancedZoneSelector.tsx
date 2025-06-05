
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Zap, Clock, AlertTriangle, CheckCircle, Info, MapPin, Building, Layers } from "lucide-react";
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
              <Badge variant="destructive" className="flex items-center gap-1 text-xs">
                <Building className="h-3 w-3" />
                Hele lokalet opptatt
              </Badge>
            );
          case 'sub-zone-conflict':
            return (
              <Badge variant="destructive" className="flex items-center gap-1 text-xs">
                <AlertTriangle className="h-3 w-3" />
                {conflict.conflictingZoneName} opptatt
              </Badge>
            );
          default:
            return (
              <Badge variant="destructive" className="flex items-center gap-1 text-xs">
                <AlertTriangle className="h-3 w-3" />
                Opptatt
              </Badge>
            );
        }
      }
      return (
        <Badge variant="secondary" className="flex items-center gap-1 text-xs">
          <AlertTriangle className="h-3 w-3" />
          Ikke tilgjengelig
        </Badge>
      );
    }
    
    return (
      <Badge variant="default" className="bg-green-100 text-green-800 flex items-center gap-1 text-xs">
        <CheckCircle className="h-3 w-3" />
        Tilgjengelig
      </Badge>
    );
  };

  // Smart zone organization
  const mainZones = zones.filter(zone => zone.isMainZone);
  const subZones = zones.filter(zone => !zone.isMainZone);
  
  // Find the best available option
  const attendees = form.watch("attendees") || 1;
  const recommendations = conflictManager.getBookingRecommendations(
    attendees,
    [],
    selectedDate,
    selectedTimeSlot
  );

  const renderZoneCard = (zone: Zone, isRecommended: boolean = false) => {
    const { isAvailable, conflict } = getZoneAvailability(zone);
    const isSelected = selectedZoneId === zone.id;
    
    return (
      <Card className={`transition-all cursor-pointer ${
        isSelected 
          ? 'ring-2 ring-navy-500 border-navy-200 bg-navy-50' 
          : isAvailable
            ? 'hover:border-navy-300 hover:shadow-sm'
            : 'opacity-60 hover:opacity-70'
      } ${isRecommended ? 'border-2 border-green-400 shadow-md' : ''}`}>
        <CardContent className="p-4">
          {isRecommended && (
            <div className="mb-2">
              <Badge className="bg-green-600 text-white text-xs">
                <Zap className="h-3 w-3 mr-1" />
                Anbefalt for deg
              </Badge>
            </div>
          )}
          
          <div className="flex justify-between items-start mb-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-base">{zone.name}</h3>
                {zone.isMainZone && (
                  <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300 text-xs">
                    <Building className="h-3 w-3 mr-1" />
                    Komplett
                  </Badge>
                )}
              </div>
              <p className="text-sm text-gray-600 mb-2 line-clamp-2">{zone.description}</p>
            </div>
            <div className="text-right ml-4">
              <div className="text-xl font-bold text-navy-900">{zone.pricePerHour} kr</div>
              <div className="text-xs text-gray-500">per time</div>
            </div>
          </div>
          
          {/* Quick facts */}
          <div className="grid grid-cols-2 gap-3 mb-3 text-sm">
            <div className="flex items-center gap-1 text-gray-600">
              <Users className="h-4 w-4" />
              <span>Opptil {zone.capacity}</span>
            </div>
            {zone.area && (
              <div className="flex items-center gap-1 text-gray-600">
                <MapPin className="h-4 w-4" />
                <span>{zone.area}</span>
              </div>
            )}
            <div className="flex items-center gap-1 text-gray-600">
              <Clock className="h-4 w-4" />
              <span>Min {zone.bookingRules.minBookingDuration}t</span>
            </div>
            <div className="text-right">
              {getStatusBadge(zone)}
            </div>
          </div>
          
          {/* Equipment highlights */}
          <div className="flex flex-wrap gap-1 mb-3">
            {zone.equipment.slice(0, 3).map((item, i) => (
              <Badge key={i} variant="outline" className="text-xs px-2 py-0.5">
                {item}
              </Badge>
            ))}
            {zone.equipment.length > 3 && (
              <Badge variant="outline" className="text-xs px-2 py-0.5">
                +{zone.equipment.length - 3} mer
              </Badge>
            )}
          </div>
          
          {/* Show included zones for main zones */}
          {zone.isMainZone && zone.subZones && (
            <div className="pt-2 border-t border-gray-200">
              <p className="text-xs text-gray-600 mb-1 flex items-center gap-1">
                <Layers className="h-3 w-3" />
                Inkluderer:
              </p>
              <div className="flex flex-wrap gap-1">
                {zone.subZones.map(subZoneId => {
                  const subZone = zones.find(z => z.id === subZoneId);
                  return subZone ? (
                    <Badge key={subZoneId} variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                      {subZone.name}
                    </Badge>
                  ) : null;
                })}
              </div>
            </div>
          )}
          
          {/* Conflict information */}
          {!isAvailable && conflict && (
            <Alert variant="destructive" className="mt-3">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="text-xs">
                {conflict.conflictType === 'whole-facility-conflict' 
                  ? `Hele lokalet er reservert av ${conflict.bookedBy}` 
                  : conflict.conflictType === 'sub-zone-conflict'
                  ? `${conflict.conflictingZoneName} er reservert av ${conflict.bookedBy}`
                  : `Reservert av ${conflict.bookedBy}`
                }
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <FormField
      control={form.control}
      name="zoneId"
      render={({ field }) => (
        <FormItem className="space-y-6">
          <FormLabel className="text-lg font-semibold flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Velg område
          </FormLabel>
          
          {/* Smart selection guide */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="font-medium text-blue-900 mb-2">Smart valg basert på dine behov</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-blue-800">
                  <div>
                    <strong>Hele lokalet:</strong> Best for store grupper eller når du trenger alt utstyret
                  </div>
                  <div>
                    <strong>Individuelle soner:</strong> Mer kostnadseffektivt for mindre grupper
                  </div>
                </div>
                {attendees && (
                  <p className="mt-2 text-blue-700">
                    <strong>For {attendees} personer:</strong> Vi anbefaler soner med kapasitet på minst {Math.ceil(attendees * 1.2)} personer
                  </p>
                )}
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
              {/* Recommended option first if available */}
              {recommendations.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-base font-medium text-gray-900 flex items-center gap-2">
                    <Zap className="h-4 w-4 text-green-600" />
                    Anbefalt for deg
                  </h3>
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem 
                      value={recommendations[0].id} 
                      id={recommendations[0].id}
                      disabled={!getZoneAvailability(recommendations[0]).isAvailable}
                      className="mt-2"
                    />
                    <Label htmlFor={recommendations[0].id} className="flex-1 cursor-pointer">
                      {renderZoneCard(recommendations[0], true)}
                    </Label>
                  </div>
                </div>
              )}

              {/* Main zones section */}
              {mainZones.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-base font-medium text-gray-900 flex items-center gap-2">
                    <Building className="h-4 w-4 text-blue-600" />
                    Hele lokalet
                  </h3>
                  {mainZones.map((zone) => {
                    const isRecommended = recommendations[0]?.id === zone.id;
                    if (isRecommended) return null; // Already shown in recommended section
                    
                    return (
                      <div key={zone.id} className="flex items-center space-x-3">
                        <RadioGroupItem 
                          value={zone.id} 
                          id={zone.id}
                          disabled={!getZoneAvailability(zone).isAvailable}
                          className="mt-2"
                        />
                        <Label htmlFor={zone.id} className="flex-1 cursor-pointer">
                          {renderZoneCard(zone)}
                        </Label>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Individual zones section */}
              {subZones.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-base font-medium text-gray-900 flex items-center gap-2">
                    <Layers className="h-4 w-4 text-gray-600" />
                    Individuelle soner
                  </h3>
                  <div className="grid gap-3">
                    {subZones.map((zone) => {
                      const isRecommended = recommendations[0]?.id === zone.id;
                      if (isRecommended) return null; // Already shown in recommended section
                      
                      return (
                        <div key={zone.id} className="flex items-center space-x-3">
                          <RadioGroupItem 
                            value={zone.id} 
                            id={zone.id}
                            disabled={!getZoneAvailability(zone).isAvailable}
                            className="mt-2"
                          />
                          <Label htmlFor={zone.id} className="flex-1 cursor-pointer">
                            {renderZoneCard(zone)}
                          </Label>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </RadioGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
