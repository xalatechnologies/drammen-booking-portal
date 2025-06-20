
import React from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ShoppingCart, CreditCard } from 'lucide-react';

interface BookingActionButtonsProps {
  termsAccepted: boolean;
  onTermsAcceptedChange: (accepted: boolean) => void;
  onAddToCart: () => void;
  onCompleteBooking: () => void;
  isFormValid: boolean;
}

export function BookingActionButtons({
  termsAccepted,
  onTermsAcceptedChange,
  onAddToCart,
  onCompleteBooking,
  isFormValid
}: BookingActionButtonsProps) {
  return (
    <>
      {/* Terms and Conditions */}
      <div className="flex items-start space-x-3 pt-2">
        <Checkbox
          id="terms"
          checked={termsAccepted}
          onCheckedChange={(checked) => onTermsAcceptedChange(!!checked)}
          className="mt-1"
        />
        <div className="text-sm leading-relaxed">
          <label htmlFor="terms" className="cursor-pointer">
            Jeg aksepterer{' '}
            <a 
              href="/vilkar" 
              target="_blank" 
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              vilkår og betingelser
            </a>
            {' '}for bruk av lokalene{' '}
            <span className="text-red-500">*</span>
          </label>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3 pt-3">
        <Button
          onClick={onAddToCart}
          disabled={!isFormValid}
          variant="outline"
          className="w-full border-blue-600 text-blue-600 hover:bg-blue-50 py-3"
          size="lg"
        >
          <ShoppingCart className="h-5 w-5 mr-2" />
          Legg i handlekurv
        </Button>
        
        <Button
          onClick={onCompleteBooking}
          disabled={!isFormValid}
          className="w-full bg-blue-600 hover:bg-blue-700 py-3"
          size="lg"
        >
          <CreditCard className="h-5 w-5 mr-2" />
          Fullfør booking
        </Button>
      </div>
    </>
  );
}
