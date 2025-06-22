
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { CartItem } from '@/types/cart';

interface OrderSummaryProps {
  items: CartItem[];
  customerType: 'private' | 'business' | 'organization';
}

export function OrderSummary({ items, customerType }: OrderSummaryProps) {
  const getCustomerTypeDiscount = () => {
    switch (customerType) {
      case 'business': return 0.1;
      case 'organization': return 0.2;
      default: return 0;
    }
  };

  const subtotal = items.reduce((total, item) => total + item.pricing.totalPrice, 0);
  const discount = subtotal * getCustomerTypeDiscount();
  const discountedTotal = subtotal - discount;
  const vat = Math.round(discountedTotal * 0.25);
  const totalWithVat = discountedTotal + vat;

  return (
    <Card className="sticky top-6">
      <CardHeader>
        <CardTitle>Prissammendrag</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span>Subtotal ({items.length} reservasjon{items.length !== 1 ? 'er' : ''})</span>
            <span>{subtotal} kr</span>
          </div>
          
          {discount > 0 && (
            <div className="flex justify-between text-sm text-green-600">
              <span>
                {customerType === 'business' ? 'Bedriftsrabatt (10%)' : 'Organisasjonsrabatt (20%)'}
              </span>
              <span>-{Math.round(discount)} kr</span>
            </div>
          )}
          
          <div className="flex justify-between text-sm">
            <span>MVA (25%)</span>
            <span>{vat} kr</span>
          </div>
          
          <Separator />
          
          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span className="text-green-600">{totalWithVat} kr</span>
          </div>
        </div>

        <div className="text-xs text-gray-500 space-y-2 pt-4 border-t">
          <h4 className="font-medium text-gray-700">Inkludert i prisen:</h4>
          <ul className="space-y-1">
            <li>• Tilgang til Lokalen i valgte tidsrom</li>
            <li>• Grunnleggende utstyr og inventar</li>
            <li>• Rengjøring etter bruk</li>
            <li>• Teknisk support ved behov</li>
          </ul>
        </div>

        <div className="text-xs text-gray-500 space-y-1 pt-3 border-t">
          <h4 className="font-medium text-gray-700">Viktige vilkår:</h4>
          <ul className="space-y-1">
            <li>• Gratis avbestilling frem til 48 timer før</li>
            <li>• Bekreftelse sendes på e-post</li>
            <li>• Faktura sendes etter arrangementet</li>
            <li>• Møt opp 15 minutter før avtalt tid</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
