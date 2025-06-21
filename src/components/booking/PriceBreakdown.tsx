
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface PriceBreakdownItem {
  label: string;
  amount: number;
  type?: 'positive' | 'negative' | 'neutral';
}

interface PriceCalculation {
  finalPrice: number;
  totalPrice: number;
  breakdown: Array<{
    amount: number;
    description: string;
    type: 'base' | 'discount' | 'surcharge' | 'tax' | 'override';
    details?: string;
  }>;
  basePrice: number;
  currency: string;
}

interface PriceBreakdownProps {
  items?: PriceBreakdownItem[];
  total?: number;
  currency?: string;
  calculation?: PriceCalculation;
  isLoading?: boolean;
  showDetailed?: boolean;
}

export function PriceBreakdown({ 
  items = [], 
  total = 0, 
  currency = 'kr',
  calculation,
  isLoading = false,
  showDetailed = false 
}: PriceBreakdownProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Prissammenbrudd</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse">Laster prisberegning...</div>
        </CardContent>
      </Card>
    );
  }

  // Use calculation data if provided, otherwise fall back to items/total
  const displayItems = calculation ? 
    calculation.breakdown.map(item => ({
      label: item.description,
      amount: item.amount,
      type: item.type === 'discount' ? 'negative' as const : 'positive' as const
    })) : items;

  const displayTotal = calculation ? calculation.finalPrice : total;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Prissammenbrudd</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {displayItems.map((item, index) => (
          <div key={index} className="flex justify-between">
            <span className={item.type === 'negative' ? 'text-red-600' : ''}>{item.label}</span>
            <span className={item.type === 'negative' ? 'text-red-600' : ''}>
              {item.type === 'negative' ? '-' : ''}{Math.abs(item.amount).toFixed(0)} {currency}
            </span>
          </div>
        ))}
        
        <Separator />
        
        <div className="flex justify-between font-semibold text-lg">
          <span>Totalt</span>
          <span>{displayTotal.toFixed(0)} {currency}</span>
        </div>
      </CardContent>
    </Card>
  );
}
