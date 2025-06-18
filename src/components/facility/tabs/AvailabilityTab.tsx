
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

export function AvailabilityTab({ zones, startDate, showLegend = true }: AvailabilityTabProps) {
  const [currentWeekStart, setCurrentWeekStart] = useState(startOfWeek(startDate, { weekStartsOn: 1 }));
  
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-400 hover:bg-green-500 border-green-500';
      case 'busy':
        return 'bg-red-400 border-red-500 cursor-not-allowed';
      case 'unavailable':
      default:
        return 'bg-gray-400 border-gray-500 cursor-not-allowed';
    }
  };

  const renderZoneCalendar = (zone: Zone) => (
    <div className="space-y-3">
      {/* Zone Info Header - More Compact */}
      <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
        <div>
          <h4 className="font-semibold text-gray-900">{zone.name}</h4>
          <p className="text-xs text-gray-600">Klikk på en ledig time for å starte booking</p>
        </div>
        <div className="flex gap-2">
          <div className="flex items-center gap-1 bg-white px-2 py-1 rounded border text-xs">
            <Users className="h-3 w-3 text-blue-600" />
            <span className="font-medium">{zone.capacity}</span>
          </div>
          <div className="flex items-center gap-1 bg-white px-2 py-1 rounded border text-xs">
            <DollarSign className="h-3 w-3 text-green-600" />
            <span className="font-medium">{zone.pricePerHour} kr/t</span>
          </div>
        </div>
      </div>

      {/* Week Navigation - Above Calendar */}
      <div className="flex items-center justify-between mb-3">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentWeekStart(addDays(currentWeekStart, -7))}
          className="flex items-center gap-1 h-8 px-3 text-xs"
          disabled={!canGoPrevious}
        >
          <ChevronLeft className="h-3 w-3" />
          Forrige
        </Button>
        
        <div className="flex items-center gap-1 text-xs font-medium bg-white px-3 py-1 rounded-lg border shadow-sm">
          <Calendar className="h-3 w-3" />
          {format(currentWeekStart, "dd.MM", { locale: nb })} - {format(addDays(currentWeekStart, 6), "dd.MM.yyyy", { locale: nb })}
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentWeekStart(addDays(currentWeekStart, 7))}
          className="flex items-center gap-1 h-8 px-3 text-xs"
        >
          Neste
          <ChevronRight className="h-3 w-3" />
        </Button>
      </div>

      {/* Compact Calendar */}
      <Card>
        <CardContent className="p-3">
          <div className="grid grid-cols-8 gap-1 mb-3">
            <div className="p-1 text-xs font-medium text-gray-500">Tid</div>
            {weekDays.map((day, i) => {
              const holidayCheck = isNorwegianHoliday(day);
              const isToday = format(day, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
              return (
                <div key={i} className={`p-1 text-center rounded ${isToday ? 'bg-blue-100 border border-blue-300' : 'bg-gray-50'}`}>
                  <div className={`text-xs font-medium ${isToday ? 'text-blue-800' : 'text-gray-700'}`}>
                    {format(day, "EEE", { locale: nb })}
                  </div>
                  <div className={`text-xs font-bold ${isToday ? 'text-blue-900' : 'text-gray-900'}`}>
                    {format(day, "dd.MM", { locale: nb })}
                  </div>
                  {holidayCheck.isHoliday && (
                    <div className="text-xs text-red-600 truncate" title={holidayCheck.name}>
                      {holidayCheck.name?.substring(0, 6)}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Time Slots Grid - More Compact */}
          <div className="space-y-1">
            {timeSlots.map((timeSlot) => (
              <div key={timeSlot} className="grid grid-cols-8 gap-1">
                <div className="p-2 text-xs font-medium text-gray-700 flex items-center bg-gray-50 rounded">
                  {timeSlot}
                </div>
                {weekDays.map((day, dayIndex) => {
                  const availability = getAvailabilityStatus(zone.id, day, timeSlot);
                  const statusColor = getStatusColor(availability);
                  
                  return (
                    <div key={dayIndex} className="relative">
                      <button
                        className={`w-full h-8 rounded border-2 transition-all duration-200 ${statusColor} ${
                          availability === 'available' 
                            ? 'cursor-pointer shadow-sm hover:shadow-md hover:scale-105' 
                            : 'cursor-not-allowed opacity-75'
                        }`}
                        disabled={availability !== 'available'}
                        onClick={() => {
                          if (availability === 'available') {
                            console.log(`Booking ${zone.name} on ${format(day, 'dd.MM.yyyy')} at ${timeSlot}`);
                          }
                        }}
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
    <div className="space-y-4">
      {/* Simplified legend - only 3 colors */}
      {showLegend && (
        <div className="p-3 bg-gray-50 rounded-lg">
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-green-400 border-2 border-green-500"></div>
              <span>Ledig</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-red-400 border-2 border-red-500"></div>
              <span>Opptatt</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-gray-400 border-2 border-gray-500"></div>
              <span>Ikke tilgjengelig</span>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Zone Tabs */}
      <Tabs defaultValue={zones[0]?.id} className="w-full">
        <TabsList className="grid w-full grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1 h-auto p-1 bg-gray-100 rounded-lg">
          {zones.map((zone) => (
            <TabsTrigger 
              key={zone.id} 
              value={zone.id}
              className="flex flex-col items-center p-2 h-auto data-[state=active]:bg-[#1e3a8a] data-[state=active]:text-white hover:bg-[#1e40af] hover:text-white transition-colors rounded-md"
            >
              <span className="font-medium text-sm">{zone.name}</span>
              <div className="flex items-center gap-3 mt-1 text-xs opacity-75">
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
          <TabsContent key={zone.id} value={zone.id} className="mt-4">
            {renderZoneCalendar(zone)}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
