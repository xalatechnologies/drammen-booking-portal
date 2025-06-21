import React from "react";
import { format } from "date-fns";
import { nb } from "date-fns/locale";
import { Info, AlertTriangle, Lock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { isDateUnavailable, isNorwegianHoliday } from "@/utils/holidaysAndAvailability";
import { Zone } from "@/components/booking/types";
import { ZoneConflictManager, ExistingBooking } from "@/utils/zoneConflictManager";

interface ZoneAvailabilityTableProps {
  zones: Zone[];
  startDate: Date;
  timeSlots: string[];
  existingBookings?: ExistingBooking[];
}

export function ZoneAvailabilityTable({ 
  zones, 
  startDate, 
  timeSlots, 
  existingBookings = [] 
}: ZoneAvailabilityTableProps) {
  const conflictManager = new ZoneConflictManager(zones, existingBookings);

  const getZoneAvailability = (zoneId: string, date: Date, timeSlot: string) => {
    const unavailableCheck = isDateUnavailable(date);
    if (unavailableCheck.isUnavailable) {
      return { available: false, reason: unavailableCheck.reason, details: unavailableCheck.details };
    }
    
    const conflict = conflictManager.checkZoneConflict(zoneId, date, timeSlot);
    if (conflict) {
      return { 
        available: false, 
        reason: 'conflict', 
        conflictType: conflict.conflict_type,
        conflictDetails: 'Booked by another user'
      };
    }
    
    return { available: true };
  };

  const getStatusBadge = (available: boolean, reason?: string, conflictType?: string, details?: string) => {
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
        case 'conflict':
          switch (conflictType) {
            case 'whole-facility-conflict':
              return (
                <Badge variant="destructive" className="text-xs flex items-center gap-1" title={`Hele lokalet: ${details}`}>
                  <Lock className="h-3 w-3" />
                  Hele lokalet
                </Badge>
              );
            case 'sub-zone-conflict':
              return (
                <Badge variant="destructive" className="text-xs flex items-center gap-1" title={`Sone opptatt: ${details}`}>
                  <AlertTriangle className="h-3 w-3" />
                  Sone opptatt
                </Badge>
              );
            default:
              return (
                <Badge variant="destructive" className="text-xs" title={`Opptatt: ${details}`}>
                  Opptatt
                </Badge>
              );
          }
        default:
          return <Badge variant="destructive" className="text-xs">Ikke tilgjengelig</Badge>;
      }
    }
    return <Badge variant="default" className="text-xs bg-green-100 text-green-800">Ledig</Badge>;
  };

  // Group zones by hierarchy - use isMainZone property correctly
  const mainZones = zones.filter(zone => zone.isMainZone === true);
  const subZones = zones.filter(zone => zone.isMainZone === false);

  return (
    <Card className="p-6">
      <h2 className="text-xl font-medium mb-4">Tilgjengelighet per sone</h2>
      
      {/* Enhanced legend */}
      <div className="mb-4 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-sm font-medium mb-3">Forklaring:</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
          <div className="flex items-center">
            <Badge variant="default" className="text-xs bg-green-100 text-green-800 mr-2">Ledig</Badge>
            <span>Tilgjengelig for booking</span>
          </div>
          <div className="flex items-center">
            <Badge variant="destructive" className="text-xs mr-2">Opptatt</Badge>
            <span>Allerede reservert</span>
          </div>
          <div className="flex items-center">
            <Badge variant="destructive" className="text-xs mr-2 flex items-center gap-1">
              <Lock className="h-3 w-3" />
              Hele lokalet
            </Badge>
            <span>Hele lokalet er reservert</span>
          </div>
          <div className="flex items-center">
            <Badge variant="destructive" className="text-xs mr-2 flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" />
              Sone opptatt
            </Badge>
            <span>Annen sone blokkerer</span>
          </div>
          <div className="flex items-center">
            <Badge variant="outline" className="text-xs bg-amber-100 text-amber-800 mr-2">Helg</Badge>
            <span>Begrenset tilgang</span>
          </div>
          <div className="flex items-center">
            <Badge variant="outline" className="text-xs bg-yellow-100 text-yellow-800 mr-2">Vedlikehold</Badge>
            <span>Planlagt vedlikehold</span>
          </div>
        </div>
      </div>

      {/* Zone hierarchy info */}
      <Alert className="mb-4">
        <Info className="h-4 w-4" />
        <AlertDescription>
          <strong>Sonehierarki:</strong> Booking av "Hele lokalet" reserverer automatisk alle undersoner. 
          Individuelle soner kan ikke bookes hvis hele lokalet allerede er reservert.
        </AlertDescription>
      </Alert>
      
      <div className="border rounded-lg overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[140px]">Sone / Tid</TableHead>
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
            {/* Main zones first */}
            {mainZones.map((zone) => (
              <React.Fragment key={`main-${zone.id}`}>
                <TableRow className="bg-blue-50 font-medium border-b-2 border-blue-200">
                  <TableCell colSpan={6} className="text-sm font-semibold text-blue-900 py-3">
                    <div className="flex items-center gap-2">
                      <Lock className="h-4 w-4" />
                      {zone.name} - Hele lokalet
                      <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">
                        Inkluderer alle soner
                      </Badge>
                    </div>
                  </TableCell>
                </TableRow>
                {timeSlots.map((timeSlot) => (
                  <TableRow key={`${zone.id}-${timeSlot}`}>
                    <TableCell className="font-medium pl-8">
                      <div className="flex items-center gap-2">
                        <span>{timeSlot}</span>
                        <div className="text-xs text-gray-500">{zone.pricePerHour} kr/time</div>
                      </div>
                    </TableCell>
                    {[0, 1, 2, 3, 4].map(day => {
                      const currentDate = new Date(startDate.getTime() + day * 24 * 60 * 60 * 1000);
                      const availability = getZoneAvailability(zone.id, currentDate, timeSlot);
                      
                      return (
                        <TableCell key={day} className="text-center">
                          {getStatusBadge(
                            availability.available, 
                            availability.reason, 
                            availability.conflictType,
                            availability.conflictDetails
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
              </React.Fragment>
            ))}

            {/* Separator */}
            <TableRow>
              <TableCell colSpan={6} className="bg-gray-100 py-2">
                <div className="text-sm font-medium text-gray-700 text-center">
                  Individuelle soner
                </div>
              </TableCell>
            </TableRow>

            {/* Sub zones */}
            {subZones.map((zone) => (
              <React.Fragment key={`sub-${zone.id}`}>
                <TableRow className="bg-gray-50 font-medium">
                  <TableCell colSpan={6} className="text-sm font-semibold text-gray-800 py-2">
                    <div className="flex items-center gap-2">
                      {zone.name}
                      <Badge variant="outline" className="text-xs">
                        Kapasitet: {zone.capacity}
                      </Badge>
                      {zone.area && (
                        <Badge variant="outline" className="text-xs">
                          {zone.area}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
                {timeSlots.map((timeSlot) => (
                  <TableRow key={`${zone.id}-${timeSlot}`}>
                    <TableCell className="font-medium pl-8">
                      <div className="flex items-center gap-2">
                        <span>{timeSlot}</span>
                        <div className="text-xs text-gray-500">{zone.pricePerHour} kr/time</div>
                      </div>
                    </TableCell>
                    {[0, 1, 2, 3, 4].map(day => {
                      const currentDate = new Date(startDate.getTime() + day * 24 * 60 * 60 * 1000);
                      const availability = getZoneAvailability(zone.id, currentDate, timeSlot);
                      
                      return (
                        <TableCell key={day} className="text-center">
                          {getStatusBadge(
                            availability.available, 
                            availability.reason, 
                            availability.conflictType,
                            availability.conflictDetails
                          )}
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
        Tabellen viser sanntids tilgjengelighet med automatisk konflikthåndtering mellom soner og hele lokalet.
      </p>
    </Card>
  );
}
