
import React, { useState } from "react";
import GlobalHeader from "@/components/GlobalHeader";
import GlobalFooter from "@/components/GlobalFooter";
import { Button } from "@/components/ui/button";
import { PaymentForm } from "@/components/booking/PaymentForm";
import { BookingsHeader } from "@/components/bookings/BookingsHeader";
import { BookingsTabs } from "@/components/bookings/BookingsTabs";
import { BookingStatus } from "@/components/booking/BookingStatusCard";

// Mock booking data with different statuses
const bookings = [
  {
    id: 1,
    facilityName: "Gymsal - Brandengen skole",
    location: "Brandengen skole, Knoffs gate 8, Drammen",
    date: new Date(2025, 4, 25, 14, 0),
    endDate: new Date(2025, 4, 25, 16, 0),
    status: "approved-payment-required" as BookingStatus,
    bookingNumber: "BK-2025-2205",
    amount: 450.00,
    approvalDate: new Date(2025, 4, 20, 10, 30),
    paymentDueDate: new Date(2025, 4, 23),
  },
  {
    id: 2,
    facilityName: "Møterom 3 - Rådhuset",
    location: "Rådhuset, Engene 1, Drammen",
    date: new Date(2025, 4, 26, 10, 0),
    endDate: new Date(2025, 4, 26, 12, 0),
    status: "pending" as BookingStatus,
    bookingNumber: "BK-2025-2206",
  },
  {
    id: 3,
    facilityName: "Auditorium - Papirbredden",
    location: "Papirbredden, Grønland 58, Drammen",
    date: new Date(2025, 5, 3, 18, 0),
    endDate: new Date(2025, 5, 3, 21, 0),
    status: "approved-paid" as BookingStatus,
    bookingNumber: "BK-2025-2207",
    approvalDate: new Date(2025, 4, 18, 14, 15),
  },
  {
    id: 4,
    facilityName: "Idrettshall - Drammen VGS",
    location: "Drammen VGS, Konnerudgata 25, Drammen",
    date: new Date(2025, 4, 28, 19, 0),
    endDate: new Date(2025, 4, 28, 22, 0),
    status: "rejected" as BookingStatus,
    bookingNumber: "BK-2025-2208",
    approvalDate: new Date(2025, 4, 19, 16, 45),
  },
];

const BookingsPage = () => {
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<typeof bookings[0] | null>(null);

  const handlePayNow = (booking: typeof bookings[0]) => {
    setSelectedBooking(booking);
    setShowPaymentForm(true);
  };

  const handlePaymentComplete = () => {
    setShowPaymentForm(false);
    setSelectedBooking(null);
  };

  const handlePaymentCancel = () => {
    setShowPaymentForm(false);
    setSelectedBooking(null);
  };

  if (showPaymentForm && selectedBooking) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col">
        <GlobalHeader />
        <div className="container mx-auto px-4 py-8 max-w-7xl flex-grow">
          <div className="mb-6">
            <Button 
              variant="outline" 
              onClick={handlePaymentCancel}
              className="mb-4"
            >
              ← Tilbake til reservasjoner
            </Button>
            <h1 className="text-3xl font-bold text-gray-900">
              Fullfør betaling
            </h1>
          </div>
          
          <PaymentForm
            amount={selectedBooking.amount || 0}
            facilityName={selectedBooking.facilityName}
            bookingReference={selectedBooking.bookingNumber}
            onPaymentComplete={handlePaymentComplete}
            onCancel={handlePaymentCancel}
          />
        </div>
        <GlobalFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col">
      <GlobalHeader />

      <div className="container mx-auto px-4 py-8 max-w-7xl flex-grow">
        <BookingsHeader totalBookings={bookings.length} />
        <BookingsTabs bookings={bookings} onPayNow={handlePayNow} />
      </div>

      <GlobalFooter />
    </div>
  );
};

export default BookingsPage;
