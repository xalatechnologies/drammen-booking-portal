
import React from "react";
import { BookingStatusCard, BookingStatus } from "@/components/booking/BookingStatusCard";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import { nb } from "date-fns/locale";

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

interface BookingsListProps {
  bookings: Booking[];
  onPayNow: (booking: Booking) => void;
}

export function BookingsList({ bookings, onPayNow }: BookingsListProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {bookings.map((booking) => (
        <div key={booking.id} className="space-y-4">
          <BookingStatusCard
            status={booking.status}
            facilityName={booking.facilityName}
            bookingReference={booking.bookingNumber}
            amount={booking.amount}
            approvalDate={booking.approvalDate}
            paymentDueDate={booking.paymentDueDate}
            onPayNow={() => onPayNow(booking)}
            onViewDetails={() => console.log('View details for', booking.id)}
          />
          
          {/* Booking Details Card */}
          <Card className="border-gray-200">
            <CardContent className="p-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Dato og tid:</span>
                  <span className="text-sm text-gray-900">
                    {format(booking.date, "EEEE d. MMMM yyyy", {locale: nb})} 
                    {" kl. "}
                    {format(booking.date, "HH:mm")} - {format(booking.endDate, "HH:mm")}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Lokasjon:</span>
                  <span className="text-sm text-gray-900 text-right">{booking.location}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ))}
    </div>
  );
}
