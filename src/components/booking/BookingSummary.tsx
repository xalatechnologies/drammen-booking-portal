
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
  facilityName: string;
  facilityId: string;
  data?: BookingFormValues;
  bookingData?: BookingData;
}

export function BookingSummary({ data, bookingData, facilityName, facilityId }: BookingSummaryProps) {
  // Use either data or bookingData
  const bookingInfo = data || bookingData;

  const { calculation, isLoading } = usePriceCalculation({
    facilityId: facilityId,
    zoneId: bookingInfo?.zoneId,
    startDate: bookingInfo?.date,
    endDate: bookingInfo?.endDate,
    timeSlot: bookingInfo?.timeSlot,
    customerType: bookingInfo?.customerType as any,
    bookingMode: bookingInfo?.bookingMode,
    eventType: bookingInfo?.eventType,
    ageGroup: bookingInfo?.ageGroup
  });

  // Helper function to format time slot
  const formatTimeSlot = (timeSlot: string) => {
    if (timeSlot?.includes(' - ')) {
      return timeSlot;
    }
    return timeSlot;
  };

  if (!bookingInfo) {
    return null;
  }

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
            <span>{bookingInfo.date ? format(bookingInfo.date, 'dd.MM.yyyy') : 'Ingen dato valgt'}</span>
            {bookingInfo.endDate && bookingInfo.endDate !== bookingInfo.date && (
              <span> - {format(bookingInfo.endDate, 'dd.MM.yyyy')}</span>
            )}
          </div>
          
          {bookingInfo.timeSlot && (
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-gray-500" />
              <span>{formatTimeSlot(bookingInfo.timeSlot)}</span>
            </div>
          )}
          
          {bookingInfo.attendees && (
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-gray-500" />
              <span>{bookingInfo.attendees} personer</span>
            </div>
          )}
        </div>

        <Separator />

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Kunde type:</span>
            <Badge variant="outline">{bookingInfo.customerType || 'Ikke valgt'}</Badge>
          </div>
          
          {bookingInfo.eventType && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Arrangement type:</span>
              <Badge variant="outline">{bookingInfo.eventType}</Badge>
            </div>
          )}
          
          {bookingInfo.bookingMode && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Booking type:</span>
              <Badge variant="outline">{bookingInfo.bookingMode === 'one-time' ? 'Engangs' : bookingInfo.bookingMode === 'recurring' ? 'Gjentakende' : 'Periode'}</Badge>
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
