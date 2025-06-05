
import React, { useState } from "react";
import GlobalHeader from "@/components/GlobalHeader";
import GlobalFooter from "@/components/GlobalFooter";
import { Button } from "@/components/ui/button";
import { BookingStatusCard, BookingStatus } from "@/components/booking/BookingStatusCard";
import { PaymentForm } from "@/components/booking/PaymentForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import { nb } from "date-fns/locale";

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
    // In a real app, you would update the booking status here
  };

  const handlePaymentCancel = () => {
    setShowPaymentForm(false);
    setSelectedBooking(null);
  };

  const getBookingsByStatus = (status: BookingStatus) => {
    return bookings.filter(booking => booking.status === status);
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
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Mine reservasjoner
            </h1>
            <p className="text-gray-600">
              Oversikt over alle dine aktive og tidligere reservasjoner
            </p>
          </div>
          <Button 
            className="bg-[#0B3D91] hover:bg-blue-700 text-white mt-4 md:mt-0"
            onClick={() => window.location.href = "/"}
          >
            + Ny reservasjon
          </Button>
        </div>

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
                    onPayNow={() => handlePayNow(booking)}
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
          </TabsContent>

          <TabsContent value="pending" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {getBookingsByStatus('pending').map((booking) => (
                <BookingStatusCard
                  key={booking.id}
                  status={booking.status}
                  facilityName={booking.facilityName}
                  bookingReference={booking.bookingNumber}
                  amount={booking.amount}
                  approvalDate={booking.approvalDate}
                  paymentDueDate={booking.paymentDueDate}
                  onPayNow={() => handlePayNow(booking)}
                  onViewDetails={() => console.log('View details for', booking.id)}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="payment-required" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {getBookingsByStatus('approved-payment-required').map((booking) => (
                <BookingStatusCard
                  key={booking.id}
                  status={booking.status}
                  facilityName={booking.facilityName}
                  bookingReference={booking.bookingNumber}
                  amount={booking.amount}
                  approvalDate={booking.approvalDate}
                  paymentDueDate={booking.paymentDueDate}
                  onPayNow={() => handlePayNow(booking)}
                  onViewDetails={() => console.log('View details for', booking.id)}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="confirmed" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {getBookingsByStatus('approved-paid').map((booking) => (
                <BookingStatusCard
                  key={booking.id}
                  status={booking.status}
                  facilityName={booking.facilityName}
                  bookingReference={booking.bookingNumber}
                  amount={booking.amount}
                  approvalDate={booking.approvalDate}
                  paymentDueDate={booking.paymentDueDate}
                  onPayNow={() => handlePayNow(booking)}
                  onViewDetails={() => console.log('View details for', booking.id)}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="rejected" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {getBookingsByStatus('rejected').map((booking) => (
                <BookingStatusCard
                  key={booking.id}
                  status={booking.status}
                  facilityName={booking.facilityName}
                  bookingReference={booking.bookingNumber}
                  amount={booking.amount}
                  approvalDate={booking.approvalDate}
                  paymentDueDate={booking.paymentDueDate}
                  onPayNow={() => handlePayNow(booking)}
                  onViewDetails={() => console.log('View details for', booking.id)}
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <GlobalFooter />
    </div>
  );
};

export default BookingsPage;
