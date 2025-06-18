
import React, { useState } from "react";
import { format, addDays, startOfWeek } from "date-fns";
import { nb } from "date-fns/locale";
import { ChevronLeft, ChevronRight, Calendar, Users, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
    <div className="space-y-4">
      {/* Zone Info Header */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{zone.name}</h3>
              <p className="text-sm text-gray-600 mt-1">
                Klikk på en ledig time for å starte booking
              </p>
            </div>
            <div className="flex gap-3">
              <div className="flex items-center gap-2 bg-white p-2 rounded-lg border">
                <Users className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium">{zone.capacity}</span>
              </div>
              <div className="flex items-center gap-2 bg-white p-2 rounded-lg border">
                <DollarSign className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium">{zone.pricePerHour} kr/t</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Week Days Header */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-8 gap-2 mb-4">
            <div className="p-2 text-xs font-medium text-gray-500">Tid</div>
            {weekDays.map((day, i) => {
              const holidayCheck = isNorwegianHoliday(day);
              const isToday = format(day, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
              return (
                <div key={i} className={`p-2 text-center rounded-lg ${isToday ? 'bg-blue-100 border-2 border-blue-300' : 'bg-gray-50'}`}>
                  <div className={`text-xs font-medium ${isToday ? 'text-blue-800' : 'text-gray-700'}`}>
                    {format(day, "EEE", { locale: nb })}
                  </div>
                  <div className={`text-sm font-bold ${isToday ? 'text-blue-900' : 'text-gray-900'}`}>
                    {format(day, "dd.MM", { locale: nb })}
                  </div>
                  {holidayCheck.isHoliday && (
                    <div className="text-xs text-red-600 mt-1 truncate" title={holidayCheck.name}>
                      {holidayCheck.name}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Time Slots Grid */}
          <div className="space-y-2">
            {timeSlots.map((timeSlot) => (
              <div key={timeSlot} className="grid grid-cols-8 gap-2">
                <div className="p-3 text-sm font-medium text-gray-700 flex items-center bg-gray-50 rounded-lg">
                  {timeSlot}
                </div>
                {weekDays.map((day, dayIndex) => {
                  const availability = getAvailabilityStatus(zone.id, day, timeSlot);
                  const statusColor = getStatusColor(availability.status, availability.reason);
                  const statusText = getStatusText(availability.status, availability.reason);
                  
                  return (
                    <div key={dayIndex} className="relative">
                      <button
                        className={`w-full h-10 rounded-lg text-xs font-medium border-2 transition-all duration-200 ${statusColor} ${
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
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-2">Tilgjengelighet per sone</h2>
        <p className="text-gray-600 mb-6">
          Velg en sone og se ledige tider. Klikk på en ledig time for å starte booking.
        </p>
      </div>

      {/* Week Navigation */}
      <div className="flex items-center justify-between mb-6">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentWeekStart(addDays(currentWeekStart, -7))}
          className="flex items-center gap-2"
        >
          <ChevronLeft className="h-4 w-4" />
          Forrige uke
        </Button>
        
        <div className="flex items-center gap-2 text-sm font-medium bg-white px-4 py-2 rounded-lg border shadow-sm">
          <Calendar className="h-4 w-4" />
          {format(currentWeekStart, "dd.MM", { locale: nb })} - {format(addDays(currentWeekStart, 6), "dd.MM.yyyy", { locale: nb })}
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentWeekStart(addDays(currentWeekStart, 7))}
          className="flex items-center gap-2"
        >
          Neste uke
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Legend */}
      <Card className="bg-gray-50">
        <CardContent className="p-4">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-green-100 border-2 border-green-200"></div>
              <span>Ledig</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-red-100 border-2 border-red-200"></div>
              <span>Opptatt</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-red-200 border-2 border-red-300"></div>
              <span>Hele lokalet</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-amber-100 border-2 border-amber-200"></div>
              <span>Helg/begrenset</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-gray-200 border-2 border-gray-300"></div>
              <span>Utilgjengelig</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Zone Tabs */}
      <Tabs defaultValue={zones[0]?.id} className="w-full">
        <TabsList className="grid w-full grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-1 h-auto p-1 bg-gray-100">
          {zones.map((zone) => (
            <TabsTrigger 
              key={zone.id} 
              value={zone.id}
              className="flex flex-col items-start p-3 h-auto data-[state=active]:bg-[#1e3a8a] data-[state=active]:text-white hover:bg-[#1e40af] hover:text-white transition-colors"
            >
              <span className="font-medium">{zone.name}</span>
              <div className="flex items-center gap-2 mt-1 text-xs opacity-75">
                <Users className="h-3 w-3" />
                <span>{zone.capacity}</span>
                <DollarSign className="h-3 w-3 ml-1" />
                <span>{zone.pricePerHour}kr</span>
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
