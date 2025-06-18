
import React, { useState } from "react";
import { format, addDays, startOfWeek } from "date-fns";
import { nb } from "date-fns/locale";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
      startDate: new Date(2025, 5, 19, 14, 0),
      endDate: new Date(2025, 5, 19, 16, 0),
      bookedBy: "Drammen Fotballklubb",
      bookingType: "whole-facility"
    },
    {
      id: "2", 
      zoneId: "zone-1",
      startDate: new Date(2025, 5, 20, 10, 0),
      endDate: new Date(2025, 5, 20, 12, 0),
      bookedBy: "Lokale Basketlag",
      bookingType: "zone"
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
        return 'bg-green-100 text-green-800 border-green-200';
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

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-2">Tilgjengelighet per sone</h2>
        <p className="text-gray-600 mb-6">
          Oversikt over ledige tider for alle soner. Klikk på en ledig time for å starte booking.
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
        
        <div className="flex items-center gap-2 text-sm font-medium">
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-green-100 border border-green-200"></div>
              <span>Ledig</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-red-100 border border-red-200"></div>
              <span>Opptatt</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-red-200 border border-red-300"></div>
              <span>Hele lokalet</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-amber-100 border border-amber-200"></div>
              <span>Begrenset</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Zones Grid */}
      <div className="space-y-6">
        {zones.map((zone) => (
          <Card key={zone.id} className="overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{zone.name}</CardTitle>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {zone.capacity} personer
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {zone.pricePerHour} kr/time
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <div className="min-w-[700px]">
                  {/* Week Days Header */}
                  <div className="grid grid-cols-8 border-b bg-gray-50">
                    <div className="p-3 text-sm font-medium text-gray-600">Tid</div>
                    {weekDays.map((day, i) => {
                      const holidayCheck = isNorwegianHoliday(day);
                      return (
                        <div key={i} className="p-3 text-center">
                          <div className="text-sm font-medium">
                            {format(day, "EEE", { locale: nb })}
                          </div>
                          <div className="text-xs text-gray-600">
                            {format(day, "dd.MM", { locale: nb })}
                          </div>
                          {holidayCheck.isHoliday && (
                            <div className="text-xs text-red-600 mt-1">
                              {holidayCheck.name}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Time Slots */}
                  {timeSlots.map((timeSlot) => (
                    <div key={timeSlot} className="grid grid-cols-8 border-b hover:bg-gray-50">
                      <div className="p-3 text-sm font-medium border-r bg-white">
                        {timeSlot}
                      </div>
                      {weekDays.map((day, dayIndex) => {
                        const availability = getAvailabilityStatus(zone.id, day, timeSlot);
                        const statusColor = getStatusColor(availability.status, availability.reason);
                        const statusText = getStatusText(availability.status, availability.reason);
                        
                        return (
                          <div key={dayIndex} className="p-2 border-r">
                            <button
                              className={`w-full h-8 rounded text-xs font-medium border transition-colors ${statusColor} ${
                                availability.status === 'available' 
                                  ? 'hover:bg-green-200 cursor-pointer' 
                                  : 'cursor-not-allowed'
                              }`}
                              disabled={availability.status !== 'available'}
                              title={availability.details || statusText}
                            >
                              {statusText}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
