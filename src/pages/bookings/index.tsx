
import React, { useState } from 'react';
import { BookingsList } from '@/components/bookings/BookingsList';
import { BookingsTabs } from '@/components/bookings/BookingsTabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PaymentForm } from '@/components/booking/PaymentForm';
import { BookingStatusCard } from '@/components/booking/BookingStatusCard';

export default function BookingsPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [showPayment, setShowPayment] = useState(false);

  const handlePayment = (paymentData: any) => {
    console.log('Payment:', paymentData);
    setShowPayment(false);
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Mine bookinger</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <BookingsTabs activeTab={activeTab} onTabChange={setActiveTab} />
          <BookingsList />
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
