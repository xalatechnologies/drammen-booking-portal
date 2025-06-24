
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface CartItem {
  id: string;
  facilityName: string;
  price: number;
  date: Date;
  timeSlot: string;
  pricePerHour: number;
}

interface ReviewStepProps {
  contactData: {
    name: string;
    email: string;
    phone: string;
  };
  items: CartItem[];
  onSubmit: () => void;
  onBack: () => void;
}

export function ReviewStep({ contactData, items, onSubmit, onBack }: ReviewStepProps) {
  const total = items.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Review Your Booking</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-medium mb-2">Contact Information</h3>
            <p>{contactData.name}</p>
            <p>{contactData.email}</p>
            <p>{contactData.phone}</p>
          </div>
          
          <div>
            <h3 className="font-medium mb-2">Booking Items</h3>
            {items.map((item) => (
              <div key={item.id} className="border rounded p-3 mb-2">
                <p className="font-medium">{item.facilityName}</p>
                <p className="text-sm text-gray-600">{item.timeSlot}</p>
                <p className="text-sm font-medium">{item.price} kr</p>
              </div>
            ))}
          </div>
          
          <div className="border-t pt-4">
            <div className="flex justify-between font-bold">
              <span>Total:</span>
              <span>{total} kr</span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="flex gap-4">
        <Button variant="outline" onClick={onBack} className="flex-1">
          Back
        </Button>
        <Button onClick={onSubmit} className="flex-1">
          Confirm Booking
        </Button>
      </div>
    </div>
  );
}
