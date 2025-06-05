
import React from "react";
import { CheckCircle, ShieldCheck } from "lucide-react";
import { BookingSummary } from "../BookingSummary";
import type { BookingData } from "../BookingSummary";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface BookingConfirmStepProps {
  facilityName: string;
  bookingData: BookingData;
  termsAccepted: boolean;
  onTermsAcceptedChange: (accepted: boolean) => void;
}

export function BookingConfirmStep({ facilityName, bookingData, termsAccepted, onTermsAcceptedChange }: BookingConfirmStepProps) {
  return (
    <div className="space-y-6" role="group" aria-labelledby="confirm-heading">
      <div className="flex items-center space-x-2 pb-2 border-b border-gray-200">
        <CheckCircle className="h-5 w-5 text-green-600" aria-hidden="true" />
        <h2 id="confirm-heading" className="text-lg font-medium text-gray-900">Bekreft reservasjon</h2>
      </div>
      
      <BookingSummary
        facilityName={facilityName}
        bookingData={bookingData}
      />
      
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-slate-700 flex-shrink-0" aria-hidden="true" />
          <h3 className="font-medium text-gray-900">Regler og vilkår for reservasjon</h3>
        </div>
        
        <ul className="text-sm text-slate-700 space-y-2 ml-2" role="list">
          <li className="flex items-start gap-2">
            <span className="font-bold text-slate-600 mt-1" aria-hidden="true">•</span>
            <span>Du må være minst 18 år for å reservere kommunale lokaler.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold text-slate-600 mt-1" aria-hidden="true">•</span>
            <span>Avbestilling må skje minst 24 timer før reservert tid.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold text-slate-600 mt-1" aria-hidden="true">•</span>
            <span>Lokalet skal forlates i samme stand som det var ved ankomst.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold text-slate-600 mt-1" aria-hidden="true">•</span>
            <span>Ved skade på inventar eller utstyr kan du bli fakturert for reparasjon eller erstatning.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold text-slate-600 mt-1" aria-hidden="true">•</span>
            <span>Kommunen forbeholder seg retten til å kansellere reservasjoner på kort varsel ved uforutsette hendelser.</span>
          </li>
        </ul>
      </div>
      
      <div className="border-t border-gray-200 pt-4">
        <div className="flex items-start gap-3">
          <Checkbox 
            id="terms" 
            checked={termsAccepted} 
            onCheckedChange={(checked) => onTermsAcceptedChange(checked === true)}
            className="mt-1 border-gray-400 data-[state=checked]:bg-slate-800 data-[state=checked]:border-slate-800 focus:ring-2 focus:ring-slate-800 focus:ring-offset-2"
            aria-describedby="terms-description"
          />
          <div className="space-y-1">
            <label 
              htmlFor="terms" 
              className="text-sm font-medium leading-none text-gray-900 cursor-pointer block"
            >
              Jeg bekrefter at jeg har lest og godtar reglene og vilkårene *
            </label>
            <p id="terms-description" className="text-xs text-gray-600">
              Ved å sende inn reservasjonen bekrefter du at all informasjon er korrekt og at du er minst 18 år gammel
            </p>
          </div>
        </div>
      </div>
      
      {!termsAccepted && (
        <Alert variant="destructive" className="bg-red-50 text-red-800 border-red-200" role="alert">
          <AlertDescription>
            Du må godta reglene og vilkårene for å kunne sende inn reservasjonen.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
