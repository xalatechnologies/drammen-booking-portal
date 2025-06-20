
import React, { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { ShoppingCart, CreditCard, ExternalLink } from 'lucide-react';
import { TermsModal } from '../TermsModal';

interface BookingStepTermsActionsProps {
  formData: {
    purpose: string;
    attendees: number;
    activityType: string;
    additionalInfo: string;
    actorType: any;
    termsAccepted: boolean;
  };
  updateFormData: (updates: any) => void;
  onAddToCart?: () => void;
  onCompleteBooking?: () => void;
}

export function BookingStepTermsActions({ 
  formData, 
  updateFormData, 
  onAddToCart, 
  onCompleteBooking 
}: BookingStepTermsActionsProps) {
  const [showTermsModal, setShowTermsModal] = useState(false);

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">
        Vilkår og handlinger
      </h3>

      {/* Terms and Conditions */}
      <div className="space-y-4">
        <div className="flex items-start space-x-3">
          <Checkbox
            id="terms"
            checked={formData.termsAccepted}
            onCheckedChange={(checked) => updateFormData({ termsAccepted: checked })}
            className="mt-1"
          />
          <div className="text-base">
            <label htmlFor="terms" className="cursor-pointer">
              Jeg aksepterer{' '}
              <button
                type="button"
                onClick={() => setShowTermsModal(true)}
                className="text-blue-600 hover:text-blue-800 underline inline-flex items-center gap-1"
              >
                vilkår og betingelser
                <ExternalLink className="h-3 w-3" />
              </button>
              {' '}for bruk av lokalene <span className="text-red-500">*</span>
            </label>
          </div>
        </div>
        
        <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
          <p>
            Ved å akseptere vilkårene bekrefter du at du har lest og forstått reglene 
            for bruk av kommunens lokaler, inkludert avbestillingsregler og betalingsbetingelser.
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3 pt-4">
        <Button
          onClick={onAddToCart}
          disabled={!formData.termsAccepted}
          variant="outline"
          className="w-full text-base h-12 border-blue-600 text-blue-600 hover:bg-blue-50"
        >
          <ShoppingCart className="h-5 w-5 mr-2" />
          Legg i handlekurv
        </Button>
        
        <Button
          onClick={onCompleteBooking}
          disabled={!formData.termsAccepted}
          className="w-full text-base h-12 bg-blue-600 hover:bg-blue-700"
        >
          <CreditCard className="h-5 w-5 mr-2" />
          Fullfør booking
        </Button>
      </div>

      {/* Terms Modal */}
      {showTermsModal && (
        <TermsModal
          isOpen={showTermsModal}
          onClose={() => setShowTermsModal(false)}
          onAccept={() => {
            updateFormData({ termsAccepted: true });
            setShowTermsModal(false);
          }}
        />
      )}
    </div>
  );
}
