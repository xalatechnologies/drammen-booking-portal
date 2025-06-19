
import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface EmptyCartProps {
  onNavigateHome: () => void;
}

export function EmptyCart({ onNavigateHome }: EmptyCartProps) {
  return (
    <Card className="max-w-md mx-auto text-center">
      <CardContent className="pt-8">
        <ShoppingCart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h2 className="text-xl font-semibold mb-2">Handlekurven er tom</h2>
        <p className="text-gray-600 mb-6">Du har ingen reservasjoner i handlekurven din.</p>
        <Button onClick={onNavigateHome}>
          Tilbake til forsiden
        </Button>
      </CardContent>
    </Card>
  );
}
