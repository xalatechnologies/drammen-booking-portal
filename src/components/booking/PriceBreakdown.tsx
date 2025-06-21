
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface PriceBreakdownProps {
  items: Array<{
    label: string;
    amount: number;
    type?: 'positive' | 'negative' | 'neutral';
  }>;
  total: number;
  currency?: string;
}

export function PriceBreakdown({ items, total, currency = 'kr' }: PriceBreakdownProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Prissammenbrudd</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {items.map((item, index) => (
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
          <span>{total.toFixed(0)} {currency}</span>
        </div>
      </CardContent>
    </Card>
  );
}
