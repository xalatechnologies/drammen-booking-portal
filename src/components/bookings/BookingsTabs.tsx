
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookingsList } from "./BookingsList";
import { BookingStatus } from "@/components/booking/BookingStatusCard";

interface Booking {
  id: number;
  facilityName: string;
  location: string;
  date: Date;
  endDate: Date;
  status: BookingStatus;
  bookingNumber: string;
  amount?: number;
  approvalDate?: Date;
  paymentDueDate?: Date;
}

interface BookingsTabsProps {
  bookings: Booking[];
  onPayNow: (booking: Booking) => void;
}

export function BookingsTabs({ bookings, onPayNow }: BookingsTabsProps) {
  const getBookingsByStatus = (status: BookingStatus) => {
    return bookings.filter(booking => booking.status === status);
  };

  return (
    <Tabs defaultValue="all" className="space-y-6">
      <TabsList className="grid w-full grid-cols-5">
        <TabsTrigger value="all">Alle ({bookings.length})</TabsTrigger>
        <TabsTrigger value="pending">
          Venter ({getBookingsByStatus('pending').length})
        </TabsTrigger>
        <TabsTrigger value="payment-required">
          Betaling ({getBookingsByStatus('approved-payment-required').length})
        </TabsTrigger>
        <TabsTrigger value="confirmed">
          Bekreftet ({getBookingsByStatus('approved-paid').length})
        </TabsTrigger>
        <TabsTrigger value="rejected">
          Avslått ({getBookingsByStatus('rejected').length})
        </TabsTrigger>
      </TabsList>

      <TabsContent value="all" className="space-y-6">
        <BookingsList bookings={bookings} onPayNow={onPayNow} />
      </TabsContent>

      <TabsContent value="pending" className="space-y-6">
        <BookingsList bookings={getBookingsByStatus('pending')} onPayNow={onPayNow} />
      </TabsContent>

      <TabsContent value="payment-required" className="space-y-6">
        <BookingsList bookings={getBookingsByStatus('approved-payment-required')} onPayNow={onPayNow} />
      </TabsContent>

      <TabsContent value="confirmed" className="space-y-6">
        <BookingsList bookings={getBookingsByStatus('approved-paid')} onPayNow={onPayNow} />
      </TabsContent>

      <TabsContent value="rejected" className="space-y-6">
        <BookingsList bookings={getBookingsByStatus('rejected')} onPayNow={onPayNow} />
      </TabsContent>
    </Tabs>
  );
}
