
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingCart } from 'lucide-react';

interface EmptyCartProps {
  onNavigateHome: () => void;
}

export function EmptyCart({ onNavigateHome }: EmptyCartProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Empty Cart</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <ShoppingCart className="h-16 w-16 text-gray-300 mx-auto" />
          <p className="text-gray-500">Your cart is empty</p>
          <Button onClick={onNavigateHome}>
            Browse Facilities
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
