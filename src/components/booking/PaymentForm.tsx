
import React, { useState } from "react";
import { CreditCard, Lock, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface PaymentFormProps {
  amount: number;
  facilityName: string;
  bookingReference: string;
  onPaymentComplete: () => void;
  onCancel: () => void;
}

export function PaymentForm({ 
  amount, 
  facilityName, 
  bookingReference, 
  onPaymentComplete, 
  onCancel 
}: PaymentFormProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardName, setCardName] = useState("");

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || "";
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(" ");
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    if (v.length >= 2) {
      return v.substring(0, 2) + "/" + v.substring(2, 4);
    }
    return v;
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    setCardNumber(formatted);
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatExpiryDate(e.target.value);
    setExpiryDate(formatted);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setIsProcessing(false);
    onPaymentComplete();
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6" role="main" aria-labelledby="payment-heading">
      {/* Payment Header */}
      <Card className="border-blue-200">
        <CardHeader className="bg-blue-50 border-b border-blue-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
              <CreditCard className="h-5 w-5 text-white" aria-hidden="true" />
            </div>
            <div>
              <CardTitle id="payment-heading" className="text-xl font-bold text-gray-900">
                Betaling påkrevd
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                Reservasjon godkjent - fullfør betaling for å sikre bookingen
              </p>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-base font-medium text-gray-700">Lokale:</span>
              <span className="text-base font-semibold text-gray-900">{facilityName}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-base font-medium text-gray-700">Referanse:</span>
              <span className="text-base font-mono text-gray-900">{bookingReference}</span>
            </div>
            <Separator />
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-gray-900">Totalt å betale:</span>
              <span className="text-2xl font-bold text-blue-600">{amount.toFixed(2)} kr</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Form */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Lock className="h-5 w-5 text-green-600" aria-hidden="true" />
            Sikker betaling
          </CardTitle>
          <p className="text-sm text-gray-600">
            Din betaling behandles sikkert og kryptert
          </p>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Card Name */}
            <div className="space-y-2">
              <Label htmlFor="card-name" className="text-sm font-semibold text-gray-700">
                Navn på kort *
              </Label>
              <Input
                id="card-name"
                type="text"
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                placeholder="Som det står på kortet"
                required
                className="h-12 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                aria-describedby="card-name-description"
              />
              <p id="card-name-description" className="text-xs text-gray-500">
                Skriv inn navnet akkurat som det står på kortet ditt
              </p>
            </div>

            {/* Card Number */}
            <div className="space-y-2">
              <Label htmlFor="card-number" className="text-sm font-semibold text-gray-700">
                Kortnummer *
              </Label>
              <Input
                id="card-number"
                type="text"
                value={cardNumber}
                onChange={handleCardNumberChange}
                placeholder="1234 5678 9012 3456"
                maxLength={19}
                required
                className="h-12 text-base font-mono border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                aria-describedby="card-number-description"
              />
              <p id="card-number-description" className="text-xs text-gray-500">
                16-sifret nummer på forsiden av kortet
              </p>
            </div>

            {/* Expiry and CVV */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiry-date" className="text-sm font-semibold text-gray-700">
                  Utløpsdato *
                </Label>
                <Input
                  id="expiry-date"
                  type="text"
                  value={expiryDate}
                  onChange={handleExpiryChange}
                  placeholder="MM/ÅÅ"
                  maxLength={5}
                  required
                  className="h-12 text-base font-mono border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  aria-describedby="expiry-description"
                />
                <p id="expiry-description" className="text-xs text-gray-500">
                  Måned/År
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cvv" className="text-sm font-semibold text-gray-700">
                  CVV *
                </Label>
                <Input
                  id="cvv"
                  type="text"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value.replace(/\D/g, ""))}
                  placeholder="123"
                  maxLength={4}
                  required
                  className="h-12 text-base font-mono border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  aria-describedby="cvv-description"
                />
                <p id="cvv-description" className="text-xs text-gray-500">
                  3-4 siffer på baksiden
                </p>
              </div>
            </div>

            {/* Security Notice */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" aria-hidden="true" />
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-green-800">
                    Sikker betaling garantert
                  </p>
                  <p className="text-sm text-green-700">
                    Vi bruker 256-bit SSL-kryptering og oppbevarer aldri kortopplysningene dine.
                    Betaling behandles av Stripe, en av verdens mest pålitelige betalingstjenester.
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button
                type="submit"
                disabled={isProcessing || !cardName || !cardNumber || !expiryDate || !cvv}
                className="flex-1 h-12 text-base font-semibold bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" aria-hidden="true" />
                    Behandler betaling...
                  </>
                ) : (
                  <>
                    <Lock className="h-4 w-4 mr-2" aria-hidden="true" />
                    Betal {amount.toFixed(2)} kr
                  </>
                )}
              </Button>
              
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isProcessing}
                className="h-12 text-base font-medium border-gray-300 hover:bg-gray-50"
              >
                Avbryt
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Payment Methods */}
      <Card>
        <CardContent className="p-4">
          <p className="text-center text-sm text-gray-600 mb-3 font-medium">
            Aksepterte betalingsmåter
          </p>
          <div className="flex justify-center items-center gap-4">
            <div className="px-3 py-2 bg-blue-600 text-white text-xs font-bold rounded">VISA</div>
            <div className="px-3 py-2 bg-red-600 text-white text-xs font-bold rounded">MC</div>
            <div className="px-3 py-2 bg-blue-800 text-white text-xs font-bold rounded">AMEX</div>
            <div className="px-3 py-2 bg-orange-500 text-white text-xs font-bold rounded">VIPPS</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
