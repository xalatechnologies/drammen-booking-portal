
import React, { useState } from 'react';
import { BookingsList } from '@/components/bookings/BookingsList';
import { BookingsTabs } from '@/components/bookings/BookingsTabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PaymentForm } from '@/components/booking/PaymentForm';
import { BookingStatusCard, BookingStatus } from '@/components/booking/BookingStatusCard';

interface LocalBooking {
  id: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'draft';
  facilityName: string;
  bookingReference: string;
  amount: number;
  approvalDate?: Date;
  paymentDueDate?: Date;
}

export default function BookingsPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [showPayment, setShowPayment] = useState(false);

  const handlePayment = (paymentData: any) => {
    console.log('Payment:', paymentData);
    setShowPayment(false);
  };

  const handlePayNow = (bookingId: string) => {
    console.log('Pay now for booking:', bookingId);
    setShowPayment(true);
  };

  const handleViewDetails = (bookingId: string) => {
    console.log('View details for booking:', bookingId);
  };

  // Mock bookings data
  const mockBookings: LocalBooking[] = [
    {
      id: '1',
      status: 'pending',
      facilityName: 'Drammen Sportshall',
      bookingReference: 'BOK-2024-001',
      amount: 1500,
      paymentDueDate: new Date()
    },
    {
      id: '2', 
      status: 'confirmed',
      facilityName: 'Konferanserom A',
      bookingReference: 'BOK-2024-002',
      amount: 800,
      approvalDate: new Date()
    }
  ];

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Mine bookinger</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <BookingsTabs selectedTab={activeTab} onTabChange={setActiveTab} />
          <BookingsList 
            bookings={mockBookings}
            onPayNow={handlePayNow}
            onViewDetails={handleViewDetails}
          />
        </div>
        
        <div className="space-y-4">
          <BookingStatusCard status="pending" title="Status oversikt">
            <p className="text-sm text-gray-600">Du har 2 ventende bookinger</p>
          </BookingStatusCard>
          
          {showPayment && (
            <PaymentForm total={1500} onPayment={handlePayment} />
          )}
        </div>
      </div>
    </div>
  );
}
