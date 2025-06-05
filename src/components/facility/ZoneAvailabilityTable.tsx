
import React from "react";
import { format } from "date-fns";
import { nb } from "date-fns/locale";
import { Info } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { isDateUnavailable, isNorwegianHoliday } from "@/utils/holidaysAndAvailability";
import { Zone } from "@/components/booking/types";

interface ZoneAvailabilityTableProps {
  zones: Zone[];
  startDate: Date;
  timeSlots: string[];
}

export function ZoneAvailabilityTable({ zones, startDate, timeSlots }: ZoneAvailabilityTableProps) {
  // Mock function to get zone availability - in real app this would check against bookings
  const getZoneAvailability = (zoneId: string, date: Date, timeSlot: string): {
    available: boolean;
    reason?: string;
  } => {
    const unavailableCheck = isDateUnavailable(date);
    if (unavailableCheck.isUnavailable) {
      return { available: false, reason: unavailableCheck.reason };
    }
    
    // Simulate some bookings
    if (zoneId === "zone-2" && timeSlot === "10:00" && date.getDate() === startDate.getDate()) {
      return { available: false, reason: "booked" };
    }
    if (zoneId === "whole-facility" && timeSlot === "14:00" && date.getDate() === startDate.getDate()) {
      return { available: false, reason: "booked" };
    }
    
    // Random availability for demo
    return { available: Math.random() > 0.2 };
  };

  const getStatusBadge = (available: boolean, reason?: string) => {
    if (!available) {
      switch (reason) {
        case 'past':
          return <Badge variant="secondary" className="text-xs">Fortid</Badge>;
        case 'weekend':
          return <Badge variant="outline" className="text-xs bg-amber-100 text-amber-800">Helg</Badge>;
        case 'holiday':
          return <Badge variant="destructive" className="text-xs">Helligdag</Badge>;
        case 'maintenance':
          return <Badge variant="outline" className="text-xs bg-yellow-100 text-yellow-800">Vedlikehold</Badge>;
        case 'booked':
          return <Badge variant="destructive" className="text-xs">Opptatt</Badge>;
        default:
          return <Badge variant="destructive" className="text-xs">Ikke tilgjengelig</Badge>;
      }
    }
    return <Badge variant="default" className="text-xs bg-green-100 text-green-800">Ledig</Badge>;
  };

  return (
    <Card className="p-6">
      <h2 className="text-xl font-medium mb-4">Tilgjengelighet per sone</h2>
      
      {/* Legend */}
      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
        <h3 className="text-sm font-medium mb-2">Forklaring:</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
          <div className="flex items-center">
            <Badge variant="default" className="text-xs bg-green-100 text-green-800 mr-2">Ledig</Badge>
            <span>Tilgjengelig</span>
          </div>
          <div className="flex items-center">
            <Badge variant="destructive" className="text-xs mr-2">Opptatt</Badge>
            <span>Reservert</span>
          </div>
          <div className="flex items-center">
            <Badge variant="outline" className="text-xs bg-amber-100 text-amber-800 mr-2">Helg</Badge>
            <span>Helgetilgang</span>
          </div>
        </div>
      </div>
      
      <div className="border rounded-lg overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[120px]">Sone / Tid</TableHead>
              {[0, 1, 2, 3, 4].map(day => {
                const currentDate = new Date(startDate.getTime() + day * 24 * 60 * 60 * 1000);
                const holidayCheck = isNorwegianHoliday(currentDate);
                
                return (
                  <TableHead key={day} className="text-center min-w-[100px]">
                    <div>
                      {format(currentDate, "EEE d.MMM", { locale: nb })}
                      {holidayCheck.isHoliday && (
                        <div className="text-xs text-red-600 mt-1">{holidayCheck.name}</div>
                      )}
                    </div>
                  </TableHead>
                );
              })}
            </TableRow>
          </TableHeader>
          <TableBody>
            {timeSlots.map((timeSlot, timeIndex) => (
              <React.Fragment key={timeSlot}>
                <TableRow className="bg-gray-50 font-medium">
                  <TableCell colSpan={6} className="text-sm font-semibold text-gray-700">
                    {timeSlot}
                  </TableCell>
                </TableRow>
                {zones.map((zone) => (
                  <TableRow key={`${timeSlot}-${zone.id}`}>
                    <TableCell className="font-medium pl-8">
                      {zone.name}
                      <div className="text-xs text-gray-500">{zone.pricePerHour} kr/time</div>
                    </TableCell>
                    {[0, 1, 2, 3, 4].map(day => {
                      const currentDate = new Date(startDate.getTime() + day * 24 * 60 * 60 * 1000);
                      const availability = getZoneAvailability(zone.id, currentDate, timeSlot);
                      
                      return (
                        <TableCell key={day} className="text-center">
                          {getStatusBadge(availability.available, availability.reason)}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </div>
      
      <p className="text-sm text-gray-500 mt-4">
        <Info className="h-4 w-4 inline-block mr-1" />
        Tabellen viser tilgjengelighet for hver sone. Du kan booke individuelle soner eller hele lokalet.
      </p>
    </Card>
  );
}
