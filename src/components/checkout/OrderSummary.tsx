
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { CartItem } from '@/types/cart';
import { CreditCard } from 'lucide-react';

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
    <div className="sticky top-6 space-y-4">
      {/* Compact Pricing Card */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <CreditCard className="h-5 w-5 text-blue-600" />
            Prissammendrag
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Subtotal ({items.length} reservasjon{items.length !== 1 ? 'er' : ''})</span>
              <span className="font-medium">{subtotal} kr</span>
            </div>
            
            {discount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>
                  {customerType === 'business' ? 'Bedriftsrabatt (10%)' : 'Organisasjonsrabatt (20%)'}
                </span>
                <span className="font-medium">-{Math.round(discount)} kr</span>
              </div>
            )}
            
            <div className="flex justify-between">
              <span>MVA (25%)</span>
              <span className="font-medium">{vat} kr</span>
            </div>
            
            <Separator />
            
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-3 border border-green-200">
              <div className="flex justify-between items-center">
                <span className="font-bold text-green-900">Total</span>
                <span className="text-xl font-bold text-green-700">{totalWithVat} kr</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Info */}
      <Card className="bg-blue-50 border-blue-200 shadow-md">
        <CardContent className="p-4">
          <div className="text-center">
            <div className="text-sm font-medium text-blue-900 mb-1">Betalingsinfo</div>
            <div className="text-xs text-blue-700 space-y-1">
              <div>Faktura sendes etter arrangementet</div>
              <div>30 dagers betalingsfrist</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
