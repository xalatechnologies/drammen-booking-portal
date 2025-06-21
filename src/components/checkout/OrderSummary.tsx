
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { CartItem } from '@/types/cart';
import { CheckCircle, Shield, Clock, CreditCard } from 'lucide-react';

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
    <div className="sticky top-6 space-y-6">
      {/* Main Pricing Card */}
      <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3">
            <CreditCard className="h-6 w-6 text-blue-600" />
            Prissammendrag
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span>Subtotal ({items.length} reservasjon{items.length !== 1 ? 'er' : ''})</span>
              <span className="font-medium">{subtotal} kr</span>
            </div>
            
            {discount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-green-600">
                  {customerType === 'business' ? 'Bedriftsrabatt (10%)' : 'Organisasjonsrabatt (20%)'}
                </span>
                <span className="text-green-600 font-medium">-{Math.round(discount)} kr</span>
              </div>
            )}
            
            <div className="flex justify-between text-sm">
              <span>MVA (25%)</span>
              <span className="font-medium">{vat} kr</span>
            </div>
            
            <Separator />
            
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-green-900">Total</span>
                <span className="text-2xl font-bold text-green-700">{totalWithVat} kr</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Benefits Card */}
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 shadow-lg">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-blue-900">
            <CheckCircle className="h-5 w-5" />
            Inkludert i prisen
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2 text-sm text-blue-800">
            <div className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
              <span>Tilgang til fasiliteten i valgte tidsrom</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
              <span>Grunnleggende utstyr og inventar</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
              <span>Rengjøring etter bruk</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
              <span>Teknisk support ved behov</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Terms Card */}
      <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200 shadow-lg">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-amber-900">
            <Shield className="h-5 w-5" />
            Viktige vilkår
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2 text-sm text-amber-800">
            <div className="flex items-start gap-2">
              <Clock className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
              <span>Gratis avbestilling frem til 48 timer før</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
              <span>Bekreftelse sendes på e-post</span>
            </div>
            <div className="flex items-start gap-2">
              <CreditCard className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
              <span>Faktura sendes etter arrangementet</span>
            </div>
            <div className="flex items-start gap-2">
              <Clock className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
              <span>Møt opp 15 minutter før avtalt tid</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
