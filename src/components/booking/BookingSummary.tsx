
import React from "react";
import { Calendar, MapPin, Users, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { BookingFormValues } from "./types";
import { PriceBreakdown } from "./PriceBreakdown";
import { usePriceCalculation } from "@/hooks/usePriceCalculation";
import { format } from "date-fns";

// Export BookingData interface for other components to use
export interface BookingData {
  date: Date;
  bookingMode: "one-time" | "date-range" | "recurring";
  timeSlot: string;
  purpose: string;
  attendees: number;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  organization?: string;
  endDate?: Date;
  recurrenceRule?: string;
  recurrenceDescription?: string;
  zoneId?: string;
  zoneName?: string;
  customerType?: string;
  eventType?: string;
  ageGroup?: string;
}

interface BookingSummaryProps {
  data: BookingFormValues;
  facilityName: string;
  facilityId: string;
}

export function BookingSummary({ data, facilityName, facilityId }: BookingSummaryProps) {
  const { calculation, isLoading } = usePriceCalculation({
    facilityId: facilityId,
    zoneId: data.zoneId,
    startDate: data.date,
    endDate: data.endDate,
    timeSlot: data.timeSlot,
    customerType: data.customerType as any,
    bookingMode: data.bookingMode,
    eventType: data.eventType,
    ageGroup: data.ageGroup
  });

  // Helper function to format time slot
  const formatTimeSlot = (timeSlot: string) => {
    if (timeSlot.includes(' - ')) {
      return timeSlot;
    }
    return timeSlot;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Booking oversikt
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-gray-500" />
            <span className="font-medium">{facilityName}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <span>{data.date ? format(data.date, 'dd.MM.yyyy') : 'Ingen dato valgt'}</span>
            {data.endDate && data.endDate !== data.date && (
              <span> - {format(data.endDate, 'dd.MM.yyyy')}</span>
            )}
          </div>
          
          {data.timeSlot && (
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-gray-500" />
              <span>{formatTimeSlot(data.timeSlot)}</span>
            </div>
          )}
          
          {data.attendees && (
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-gray-500" />
              <span>{data.attendees} personer</span>
            </div>
          )}
        </div>

        <Separator />

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Kunde type:</span>
            <Badge variant="outline">{data.customerType || 'Ikke valgt'}</Badge>
          </div>
          
          {data.eventType && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Arrangement type:</span>
              <Badge variant="outline">{data.eventType}</Badge>
            </div>
          )}
          
          {data.bookingMode && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Booking type:</span>
              <Badge variant="outline">{data.bookingMode === 'one-time' ? 'Engangs' : data.bookingMode === 'recurring' ? 'Gjentakende' : 'Periode'}</Badge>
            </div>
          )}
        </div>

        {calculation && (
          <>
            <Separator />
            <PriceBreakdown 
              calculation={calculation}
              isLoading={isLoading}
              showDetailed={true}
            />
          </>
        )}
      </CardContent>
    </Card>
  );
}
