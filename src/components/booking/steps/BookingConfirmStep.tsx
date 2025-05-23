
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
    <div className="space-y-6">
      <div className="flex items-center space-x-2 pb-2 border-b">
        <CheckCircle className="h-5 w-5 text-green-600" />
        <h3 className="text-xl font-medium">Bekreft reservasjon</h3>
      </div>
      
      <BookingSummary
        facilityName={facilityName}
        bookingData={bookingData}
      />
      
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-blue-600 flex-shrink-0" />
          <h4 className="font-medium">Regler og vilkår for reservasjon</h4>
        </div>
        
        <ul className="text-sm text-blue-800 space-y-2 ml-2">
          <li className="flex items-start gap-2">
            <span className="font-bold text-blue-600">•</span>
            <span>Du må være minst 18 år for å reservere kommunale lokaler.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold text-blue-600">•</span>
            <span>Avbestilling må skje minst 24 timer før reservert tid.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold text-blue-600">•</span>
            <span>Lokalet skal forlates i samme stand som det var ved ankomst.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold text-blue-600">•</span>
            <span>Ved skade på inventar eller utstyr kan du bli fakturert for reparasjon eller erstatning.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold text-blue-600">•</span>
            <span>Kommunen forbeholder seg retten til å kansellere reservasjoner på kort varsel ved uforutsette hendelser.</span>
          </li>
        </ul>
      </div>
      
      <div className="border-t pt-4">
        <div className="flex items-start gap-3">
          <Checkbox 
            id="terms" 
            checked={termsAccepted} 
            onCheckedChange={(checked) => onTermsAcceptedChange(checked === true)}
          />
          <div>
            <label 
              htmlFor="terms" 
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
            >
              Jeg bekrefter at jeg har lest og godtar reglene og vilkårene
            </label>
            <p className="text-sm text-gray-500 mt-1">
              Ved å sende inn reservasjonen bekrefter du at all informasjon er korrekt
            </p>
          </div>
        </div>
      </div>
      
      {!termsAccepted && (
        <Alert variant="destructive" className="bg-red-50 text-red-800 border-red-200">
          <AlertDescription>
            Du må godta reglene og vilkårene for å kunne sende inn reservasjonen.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
