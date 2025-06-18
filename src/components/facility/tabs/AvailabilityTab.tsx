
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
}

export function AvailabilityTab({ zones, startDate }: AvailabilityTabProps) {
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
      return { 
        status: 'unavailable', 
        reason: unavailableCheck.reason,
        details: unavailableCheck.details 
      };
    }

    const conflict = conflictManager.checkZoneConflict(zoneId, date, timeSlot);
    if (conflict) {
      return { 
        status: 'booked', 
        reason: conflict.conflictType,
        details: conflict.bookedBy 
      };
    }

    return { status: 'available' };
  };

  const getStatusColor = (status: string, reason?: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800 border-green-200 hover:bg-green-200';
      case 'booked':
        return reason === 'whole-facility-conflict' 
          ? 'bg-red-200 text-red-900 border-red-300' 
          : 'bg-red-100 text-red-800 border-red-200';
      case 'unavailable':
        switch (reason) {
          case 'past':
            return 'bg-gray-200 text-gray-600 border-gray-300';
          case 'weekend':
            return 'bg-amber-100 text-amber-800 border-amber-200';
          case 'holiday':
            return 'bg-red-300 text-red-900 border-red-400';
          default:
            return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        }
      default:
        return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  const getStatusText = (status: string, reason?: string) => {
    switch (status) {
      case 'available':
        return 'Ledig';
      case 'booked':
        return reason === 'whole-facility-conflict' ? 'Hele lokalet' : 'Opptatt';
      case 'unavailable':
        switch (reason) {
          case 'past':
            return 'Fortid';
          case 'weekend':
            return 'Helg';
          case 'holiday':
            return 'Helligdag';
          default:
            return 'Stengt';
        }
      default:
        return 'Ukjent';
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
                  const statusColor = getStatusColor(availability.status, availability.reason);
                  const statusText = getStatusText(availability.status, availability.reason);
                  
                  return (
                    <div key={dayIndex} className="relative">
                      <button
                        className={`w-full h-8 rounded text-xs font-medium border transition-all duration-200 ${statusColor} ${
                          availability.status === 'available' 
                            ? 'cursor-pointer shadow-sm hover:shadow-md hover:scale-105' 
                            : 'cursor-not-allowed opacity-75'
                        }`}
                        disabled={availability.status !== 'available'}
                        title={availability.details || statusText}
                        onClick={() => {
                          if (availability.status === 'available') {
                            console.log(`Booking ${zone.name} on ${format(day, 'dd.MM.yyyy')} at ${timeSlot}`);
                          }
                        }}
                      >
                        {statusText}
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
      {/* Compact Legend */}
      <div className="p-3 bg-gray-50 rounded-lg">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded bg-green-100 border border-green-200"></div>
            <span>Ledig</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded bg-red-100 border border-red-200"></div>
            <span>Opptatt</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded bg-red-200 border border-red-300"></div>
            <span>Hele lokalet</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded bg-amber-100 border border-amber-200"></div>
            <span>Helg/begrenset</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded bg-gray-200 border border-gray-300"></div>
            <span>Utilgjengelig</span>
          </div>
        </div>
      </div>

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
