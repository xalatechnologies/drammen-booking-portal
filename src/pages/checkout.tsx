
import React from 'react';
import GlobalHeader from '@/components/GlobalHeader';
import GlobalFooter from '@/components/GlobalFooter';
import { useCart } from '@/contexts/CartContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';

const CheckoutPage = () => {
  const { cartItems, getTotalPrice, clearCart } = useCart();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <GlobalHeader />
      <div className="flex-grow py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-3xl font-bold mb-8">Checkout</h1>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                Your Bookings ({cartItems.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {cartItems.length === 0 ? (
                <p className="text-gray-500">No bookings in cart</p>
              ) : (
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="border rounded-lg p-4">
                      <h3 className="font-medium">{item.facilityName}</h3>
                      <p className="text-sm text-gray-600">{item.zoneId}</p>
                      <p className="text-sm text-gray-600">{item.timeSlot}</p>
                      <p className="font-medium">{item.pricePerHour * 2} kr</p>
                    </div>
                  ))}
                  <div className="border-t pt-4">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total:</span>
                      <span>{getTotalPrice()} kr</span>
                    </div>
                  </div>
                  <Button onClick={clearCart} className="w-full">
                    Complete Booking
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      <GlobalFooter />
    </div>
  );
};

export default CheckoutPage;
