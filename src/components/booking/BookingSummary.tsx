
import React from "react";
import { BookingSummaryCard } from "./summary/BookingSummaryCard";
import { PriceBreakdown } from "./PriceBreakdown";
import { usePriceCalculation } from "@/hooks/usePriceCalculation";

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
}

interface BookingSummaryProps {
  facilityName: string;
  facilityId?: string;
  bookingData: BookingData;
}

export function BookingSummary({ facilityName, facilityId, bookingData }: BookingSummaryProps) {
  // Calculate price for the booking with proper error handling
  const { calculation, isLoading } = usePriceCalculation({
    facilityId: facilityId || '',
    zoneId: bookingData.zoneId || '',
    startDate: bookingData.date,
    endDate: bookingData.endDate,
    timeSlot: bookingData.timeSlot,
    customerType: 'private',
    bookingMode: bookingData.bookingMode
  });

  console.log('BookingSummary pricing calculation:', {
    facilityId,
    zoneId: bookingData.zoneId,
    calculation,
    isLoading
  });

  return (
    <div className="space-y-6">
      <BookingSummaryCard 
        facilityName={facilityName} 
        bookingData={bookingData} 
      />

      {/* Price Calculation - Show if we have the required data */}
      {facilityId && bookingData.zoneId && bookingData.timeSlot && (
        <PriceBreakdown 
          calculation={calculation || { 
            basePrice: 0, 
            totalHours: 0, 
            totalDays: 0, 
            customerTypeDiscount: 0, 
            weekendSurcharge: 0, 
            subtotal: 0, 
            finalPrice: 0, 
            breakdown: [] 
          }}
          isLoading={isLoading}
          showDetailed={true}
        />
      )}
    </div>
  );
}
