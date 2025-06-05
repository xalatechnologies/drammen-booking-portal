
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
    <div className="space-y-8" role="group" aria-labelledby="confirm-heading">
      {/* Header with improved typography */}
      <div>
        <div className="flex items-center space-x-3 pb-3 border-b-2 border-gray-200">
          <CheckCircle className="h-6 w-6 text-green-600" aria-hidden="true" />
          <h2 id="confirm-heading" className="text-2xl font-bold text-gray-900">
            Bekreft reservasjon
          </h2>
        </div>
        <p className="text-base text-gray-700 font-medium mt-3">
          Gjennomgå informasjonen nedenfor før du sender inn reservasjonen
        </p>
      </div>
      
      {/* Booking Summary */}
      <section aria-labelledby="summary-heading">
        <h3 id="summary-heading" className="sr-only">Reservasjonssammendrag</h3>
        <BookingSummary
          facilityName={facilityName}
          bookingData={bookingData}
        />
      </section>
      
      {/* Terms and Conditions */}
      <section aria-labelledby="terms-heading" className="bg-slate-50 border-2 border-slate-200 rounded-lg p-6 space-y-6">
        <div className="flex items-center gap-3">
          <ShieldCheck className="h-6 w-6 text-slate-700 flex-shrink-0" aria-hidden="true" />
          <h3 id="terms-heading" className="text-xl font-bold text-gray-900">
            Regler og vilkår for reservasjon
          </h3>
        </div>
        
        <div className="bg-white border border-slate-200 rounded-md p-4">
          <ul className="text-base text-slate-700 space-y-3 font-medium" role="list" aria-label="Reservasjonsvilkår">
            <li className="flex items-start gap-3">
              <span className="font-bold text-slate-600 mt-1 text-lg" aria-hidden="true">•</span>
              <span>Du må være minst 18 år for å reservere kommunale lokaler.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="font-bold text-slate-600 mt-1 text-lg" aria-hidden="true">•</span>
              <span>Avbestilling må skje minst 24 timer før reservert tid.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="font-bold text-slate-600 mt-1 text-lg" aria-hidden="true">•</span>
              <span>Lokalet skal forlates i samme stand som det var ved ankomst.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="font-bold text-slate-600 mt-1 text-lg" aria-hidden="true">•</span>
              <span>Ved skade på inventar eller utstyr kan du bli fakturert for reparasjon eller erstatning.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="font-bold text-slate-600 mt-1 text-lg" aria-hidden="true">•</span>
              <span>Kommunen forbeholder seg retten til å kansellere reservasjoner på kort varsel ved uforutsette hendelser.</span>
            </li>
          </ul>
        </div>
      </section>
      
      {/* Terms Acceptance */}
      <section aria-labelledby="acceptance-heading" className="border-t-2 border-gray-200 pt-6">
        <h3 id="acceptance-heading" className="sr-only">Godkjenning av vilkår</h3>
        <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
          <div className="flex items-start gap-4">
            <Checkbox 
              id="terms" 
              checked={termsAccepted} 
              onCheckedChange={(checked) => onTermsAcceptedChange(checked === true)}
              className="mt-2 h-5 w-5 border-2 border-gray-400 data-[state=checked]:bg-slate-800 data-[state=checked]:border-slate-800 focus:ring-2 focus:ring-slate-800 focus:ring-offset-2"
              aria-describedby="terms-description"
            />
            <div className="space-y-2">
              <label 
                htmlFor="terms" 
                className="text-lg font-semibold leading-relaxed text-gray-900 cursor-pointer block"
              >
                Jeg bekrefter at jeg har lest og godtar reglene og vilkårene *
              </label>
              <p id="terms-description" className="text-base text-gray-600 font-medium leading-relaxed">
                Ved å sende inn reservasjonen bekrefter du at all informasjon er korrekt og at du er minst 18 år gammel. 
                Du samtykker også til at kommunen kan kontakte deg angående din reservasjon.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Error Alert */}
      {!termsAccepted && (
        <Alert variant="destructive" className="bg-red-50 text-red-800 border-2 border-red-200" role="alert" aria-live="polite">
          <AlertDescription className="text-base font-semibold">
            Du må godta reglene og vilkårene for å kunne sende inn reservasjonen.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
