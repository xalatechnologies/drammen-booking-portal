
import React, { useState } from "react";
import { format, addDays, startOfWeek, isBefore, startOfDay } from "date-fns";
import { nb } from "date-fns/locale";
import { ChevronLeft, ChevronRight, Calendar, Users, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Zone } from "@/components/booking/types";
import { isDateUnavailable, isNorwegianHoliday } from "@/utils/holidaysAndAvailability";
import { ZoneConflictManager, ExistingBooking } from "@/utils/zoneConflictManager";

interface AvailabilityTabProps {
  zones: Zone[];
  startDate: Date;
  showLegend?: boolean;
}

interface SelectedSlot {
  zoneId: string;
  date: Date;
  timeSlot: string;
}

export function AvailabilityTab({ zones, startDate, showLegend = true }: AvailabilityTabProps) {
  const [currentWeekStart, setCurrentWeekStart] = useState(startOfWeek(startDate, { weekStartsOn: 1 }));
  const [selectedSlots, setSelectedSlots] = useState<SelectedSlot[]>([]);
  const [isSelecting, setIsSelecting] = useState(false);
  
  // Mock existing bookings for demo
  const existingBookings: ExistingBooking[] = [
    {
      id: "1",
      zoneId: "whole-facility",
      date: new Date(2025, 5, 19),
      timeSlot: "14:00",
      bookedBy: "Drammen Fotballklubb"
    },
    {
      id: "2", 
      zoneId: "zone-1",
      date: new Date(2025, 5, 20),
      timeSlot: "10:00",
      bookedBy: "Lokale Basketlag"
    }
  ];

  const conflictManager = new ZoneConflictManager(zones, existingBookings);
  const timeSlots = ["08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00"];
  const weekDays = Array(7).fill(0).map((_, i) => addDays(currentWeekStart, i));

  const today = startOfDay(new Date());
  const currentWeekStartDay = startOfDay(currentWeekStart);
  const canGoPrevious = !isBefore(addDays(currentWeekStartDay, -7), today);

  const getAvailabilityStatus = (zoneId: string, date: Date, timeSlot: string) => {
    const unavailableCheck = isDateUnavailable(date);
    if (unavailableCheck.isUnavailable) {
      return 'unavailable';
    }

    const conflict = conflictManager.checkZoneConflict(zoneId, date, timeSlot);
    if (conflict) {
      return 'busy';
    }

    return 'available';
  };

  const isSlotSelected = (zoneId: string, date: Date, timeSlot: string) => {
    return selectedSlots.some(slot => 
      slot.zoneId === zoneId && 
      format(slot.date, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd') && 
      slot.timeSlot === timeSlot
    );
  };

  const handleSlotClick = (zoneId: string, date: Date, timeSlot: string, availability: string) => {
    if (availability !== 'available') return;

    const slotKey = `${zoneId}-${format(date, 'yyyy-MM-dd')}-${timeSlot}`;
    const isSelected = isSlotSelected(zoneId, date, timeSlot);

    if (isSelected) {
      // Remove from selection
      setSelectedSlots(prev => prev.filter(slot => 
        !(slot.zoneId === zoneId && 
          format(slot.date, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd') && 
          slot.timeSlot === timeSlot)
      ));
    } else {
      // Add to selection
      setSelectedSlots(prev => [...prev, { zoneId, date, timeSlot }]);
    }
  };

  const clearSelection = () => {
    setSelectedSlots([]);
  };

  const getStatusColor = (status: string, isSelected: boolean) => {
    if (isSelected) {
      return 'bg-blue-500 hover:bg-blue-600 border-blue-600 ring-2 ring-blue-300';
    }
    
    switch (status) {
      case 'available':
        return 'bg-green-100 hover:bg-green-200 border-green-400 hover:border-green-500';
      case 'busy':
        return 'bg-red-100 border-red-400 cursor-not-allowed';
      case 'unavailable':
      default:
        return 'bg-gray-100 border-gray-400 cursor-not-allowed';
    }
  };

  const renderZoneCalendar = (zone: Zone) => (
    <div className="space-y-4">
      {/* Zone Info Header - Larger fonts */}
      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
        <div>
          <h4 className="text-lg font-semibold text-gray-900">{zone.name}</h4>
          <p className="text-sm text-gray-600">Klikk på ledige timer for å velge tidsrom</p>
        </div>
        <div className="flex gap-3">
          <div className="flex items-center gap-2 bg-white px-3 py-2 rounded border text-sm">
            <Users className="h-4 w-4 text-blue-600" />
            <span className="font-medium">{zone.capacity}</span>
          </div>
          <div className="flex items-center gap-2 bg-white px-3 py-2 rounded border text-sm">
            <DollarSign className="h-4 w-4 text-green-600" />
            <span className="font-medium">{zone.pricePerHour} kr/t</span>
          </div>
        </div>
      </div>

      {/* Selection Info */}
      {selectedSlots.filter(slot => slot.zoneId === zone.id).length > 0 && (
        <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="text-sm text-blue-800">
            <span className="font-medium">
              {selectedSlots.filter(slot => slot.zoneId === zone.id).length} timer valgt
            </span>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={clearSelection}
            className="text-xs"
          >
            Fjern valg
          </Button>
        </div>
      )}

      {/* Week Navigation - Larger fonts */}
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentWeekStart(addDays(currentWeekStart, -7))}
          className="flex items-center gap-2 h-9 px-4 text-sm"
          disabled={!canGoPrevious}
        >
          <ChevronLeft className="h-4 w-4" />
          Forrige
        </Button>
        
        <div className="flex items-center gap-2 text-sm font-medium bg-white px-4 py-2 rounded-lg border shadow-sm">
          <Calendar className="h-4 w-4" />
          {format(currentWeekStart, "dd.MM", { locale: nb })} - {format(addDays(currentWeekStart, 6), "dd.MM.yyyy", { locale: nb })}
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentWeekStart(addDays(currentWeekStart, 7))}
          className="flex items-center gap-2 h-9 px-4 text-sm"
        >
          Neste
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Calendar with larger elements */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-8 gap-2 mb-4">
            <div className="p-2 text-sm font-medium text-gray-500">Tid</div>
            {weekDays.map((day, i) => {
              const holidayCheck = isNorwegianHoliday(day);
              const isToday = format(day, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
              return (
                <div key={i} className={`p-2 text-center rounded ${isToday ? 'bg-blue-100 border border-blue-300' : 'bg-gray-50'}`}>
                  <div className={`text-sm font-medium ${isToday ? 'text-blue-800' : 'text-gray-700'}`}>
                    {format(day, "EEE", { locale: nb })}
                  </div>
                  <div className={`text-sm font-bold ${isToday ? 'text-blue-900' : 'text-gray-900'}`}>
                    {format(day, "dd.MM", { locale: nb })}
                  </div>
                  {holidayCheck.isHoliday && (
                    <div className="text-xs text-red-600 truncate" title={holidayCheck.name}>
                      {holidayCheck.name?.substring(0, 8)}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Time Slots Grid - Larger elements */}
          <div className="space-y-2">
            {timeSlots.map((timeSlot) => (
              <div key={timeSlot} className="grid grid-cols-8 gap-2">
                <div className="p-3 text-sm font-medium text-gray-700 flex items-center bg-gray-50 rounded">
                  {timeSlot}
                </div>
                {weekDays.map((day, dayIndex) => {
                  const availability = getAvailabilityStatus(zone.id, day, timeSlot);
                  const isSelected = isSlotSelected(zone.id, day, timeSlot);
                  const statusColor = getStatusColor(availability, isSelected);
                  
                  return (
                    <div key={dayIndex} className="relative">
                      <button
                        className={`w-full h-10 rounded-md border-2 transition-all duration-200 ${statusColor} ${
                          availability === 'available' 
                            ? 'cursor-pointer shadow-sm hover:shadow-md transform hover:scale-105' 
                            : 'cursor-not-allowed opacity-75'
                        }`}
                        disabled={availability !== 'available'}
                        onClick={() => handleSlotClick(zone.id, day, timeSlot, availability)}
                      >
                        {/* No text content - just the colored button */}
                      </button>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Legend with larger fonts */}
      {showLegend && (
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="grid grid-cols-3 gap-6 text-sm">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 rounded bg-green-100 border-2 border-green-400"></div>
              <span>Ledig</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 rounded bg-red-100 border-2 border-red-400"></div>
              <span>Opptatt</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 rounded bg-gray-100 border-2 border-gray-400"></div>
              <span>Ikke tilgjengelig</span>
            </div>
          </div>
          {selectedSlots.length > 0 && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded bg-blue-500 border-2 border-blue-600"></div>
                <span>Valgt ({selectedSlots.length} timer)</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Enhanced Zone Tabs with larger fonts */}
      <Tabs defaultValue={zones[0]?.id} className="w-full">
        <TabsList className="grid w-full grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1 h-auto p-1 bg-gray-100 rounded-lg">
          {zones.map((zone) => (
            <TabsTrigger 
              key={zone.id} 
              value={zone.id}
              className="flex flex-col items-center p-3 h-auto data-[state=active]:bg-[#1e3a8a] data-[state=active]:text-white hover:bg-[#1e40af] hover:text-white transition-colors rounded-md"
            >
              <span className="font-medium text-sm">{zone.name}</span>
              <div className="flex items-center gap-4 mt-2 text-xs opacity-75">
                <div className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  <span>{zone.capacity}</span>
                </div>
                <div className="flex items-center gap-1">
                  <DollarSign className="h-3 w-3" />
                  <span>{zone.pricePerHour}kr</span>
                </div>
              </div>
            </TabsTrigger>
          ))}
        </TabsList>

        {zones.map((zone) => (
          <TabsContent key={zone.id} value={zone.id} className="mt-6">
            {renderZoneCalendar(zone)}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
