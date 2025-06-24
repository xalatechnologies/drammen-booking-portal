
import React from 'react';
import { Card } from '@/components/ui/card';
import { BookingStatusCard } from '@/components/booking/BookingStatusCard';

interface Booking {
  id: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'draft';
  facilityName: string;
  bookingReference: string;
  amount: number;
  approvalDate?: Date;
  paymentDueDate?: Date;
}

interface BookingsListProps {
  bookings?: Booking[];
  onPayNow?: (bookingId: string) => void;
  onViewDetails?: (bookingId: string) => void;
}

export function BookingsList({ 
  bookings = [], 
  onPayNow = () => {}, 
  onViewDetails = () => {} 
}: BookingsListProps) {
  if (bookings.length === 0) {
    return (
      <Card className="p-6 text-center">
        <p className="text-gray-500">Ingen bookinger funnet</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {bookings.map((booking) => (
        <BookingStatusCard
          key={booking.id}
          status={booking.status}
          facilityName={booking.facilityName}
          bookingReference={booking.bookingReference}
          amount={booking.amount}
          approvalDate={booking.approvalDate}
          paymentDueDate={booking.paymentDueDate}
          onPayNow={() => onPayNow(booking.id)}
          onViewDetails={() => onViewDetails(booking.id)}
        />
      ))}
    </div>
  );
}
