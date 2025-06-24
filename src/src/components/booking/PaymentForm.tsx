
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface PaymentFormProps {
  total: number;
  onPayment: (paymentData: any) => void;
}

export function PaymentForm({ total, onPayment }: PaymentFormProps) {
  const [paymentMethod, setPaymentMethod] = useState('card');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onPayment({ method: paymentMethod, amount: total });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Betaling</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="payment-method">Betalingsmetode</Label>
            <Select value={paymentMethod} onValueChange={setPaymentMethod}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="card">Bankkort</SelectItem>
                <SelectItem value="invoice">Faktura</SelectItem>
                <SelectItem value="vipps">Vipps</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {paymentMethod === 'card' && (
            <>
              <div>
                <Label htmlFor="card-number">Kortnummer</Label>
                <Input id="card-number" placeholder="1234 5678 9012 3456" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="expiry">Utløp</Label>
                  <Input id="expiry" placeholder="MM/YY" />
                </div>
                <div>
                  <Label htmlFor="cvc">CVC</Label>
                  <Input id="cvc" placeholder="123" />
                </div>
              </div>
            </>
          )}

          <div className="pt-4">
            <div className="flex justify-between text-lg font-semibold mb-4">
              <span>Totalt å betale:</span>
              <span>{total.toFixed(0)} kr</span>
            </div>
            <Button type="submit" className="w-full">
              Betal nå
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
