
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Users, Zap } from "lucide-react";
import { BookingFormValues, Zone } from "./types";
import { FormField, FormItem, FormControl, FormMessage, FormLabel } from "@/components/ui/form";

interface ZoneSelectorProps {
  form: UseFormReturn<BookingFormValues>;
  zones: Zone[];
  selectedDate: Date;
  selectedTimeSlot: string;
}

export function ZoneSelector({ form, zones, selectedDate, selectedTimeSlot }: ZoneSelectorProps) {
  const selectedZoneId = form.watch("zoneId");
  
  // Mock function to check zone availability - in real app this would check against bookings
  const isZoneAvailable = (zoneId: string): boolean => {
    // For demo purposes, make some zones randomly unavailable
    const unavailableZones = ["zone-2"]; // Simulate zone 2 being busy
    return !unavailableZones.includes(zoneId);
  };

  const getZonePrice = (zone: Zone): number => {
    return zone.pricePerHour;
  };

  return (
    <FormField
      control={form.control}
      name="zoneId"
      render={({ field }) => (
        <FormItem className="space-y-3">
          <FormLabel className="text-base font-semibold">Velg sone</FormLabel>
          <FormControl>
            <RadioGroup
              onValueChange={field.onChange}
              value={field.value}
              className="space-y-3"
            >
              {zones.map((zone) => {
                const isAvailable = isZoneAvailable(zone.id);
                const price = getZonePrice(zone);
                
                return (
                  <div key={zone.id} className="flex items-center space-x-3">
                    <RadioGroupItem 
                      value={zone.id} 
                      id={zone.id}
                      disabled={!isAvailable}
                    />
                    <Label 
                      htmlFor={zone.id} 
                      className={`flex-1 cursor-pointer ${!isAvailable ? 'opacity-50' : ''}`}
                    >
                      <Card className={`transition-all ${
                        selectedZoneId === zone.id 
                          ? 'ring-2 ring-blue-500 border-blue-200' 
                          : 'hover:border-gray-300'
                      } ${!isAvailable ? 'bg-gray-50' : ''}`}>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h3 className="font-semibold text-lg">{zone.name}</h3>
                              <p className="text-sm text-gray-600 mb-2">{zone.description}</p>
                            </div>
                            <div className="text-right">
                              <div className="text-lg font-bold">{price} kr</div>
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
                                <Zap className="h-4 w-4" />
                                <span>{zone.area}</span>
                              </div>
                            )}
                          </div>
                          
                          <div className="flex flex-wrap gap-1 mb-2">
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
                            <Badge 
                              variant={isAvailable ? "default" : "destructive"}
                              className={isAvailable ? "bg-green-100 text-green-800" : ""}
                            >
                              {isAvailable ? "Tilgjengelig" : "Opptatt"}
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
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
