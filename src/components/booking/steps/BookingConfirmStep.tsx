
import React from "react";
import { CheckCircle2, AlertTriangle } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { BookingSummary, BookingData } from "../BookingSummary";

interface BookingConfirmStepProps {
  facilityName: string;
  facilityId?: string;
  bookingData: BookingData;
  termsAccepted: boolean;
  onTermsAcceptedChange: (accepted: boolean) => void;
}

export function BookingConfirmStep({ 
  facilityName, 
  facilityId,
  bookingData, 
  termsAccepted, 
  onTermsAcceptedChange 
}: BookingConfirmStepProps) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Gjennomgå din reservasjon
        </h3>
        <p className="text-gray-600">
          Kontroller at alle detaljer er korrekte før du sender inn søknaden
        </p>
      </div>

      <BookingSummary 
        facilityName={facilityName} 
        facilityId={facilityId}
        bookingData={bookingData} 
      />

      {/* Terms and Conditions */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
          <div className="space-y-3">
            <h4 className="font-medium text-amber-900">Viktig informasjon</h4>
            <ul className="text-sm text-amber-800 space-y-1">
              <li>• Reservasjonen er ikke bekreftet før du mottar godkjenning</li>
              <li>• Du vil motta e-post og SMS når søknaden er behandlet</li>
              <li>• Behandlingstid er vanligvis 1-3 virkedager</li>
              <li>• Avbestilling må skje minst 48 timer før arrangementet</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Terms Acceptance */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Checkbox
            id="terms"
            checked={termsAccepted}
            onCheckedChange={onTermsAcceptedChange}
            className="mt-1"
          />
          <div className="space-y-2">
            <label
              htmlFor="terms"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
            >
              Jeg godtar vilkårene for leie av kommunale lokaler
            </label>
            <p className="text-xs text-gray-600">
              Inkluderer ansvar for skader, renhold, og betaling av eventuelle gebyrer.{" "}
              <a href="#" className="text-blue-600 hover:underline">
                Les fullstendige vilkår
              </a>
            </p>
          </div>
        </div>
      </div>

      {termsAccepted && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-green-800">
            <CheckCircle2 className="h-5 w-5" />
            <span className="font-medium">Klar for innsending</span>
          </div>
          <p className="text-sm text-green-700 mt-1">
            Din reservasjonsforespørsel er klar til å sendes inn for behandling.
          </p>
        </div>
      )}
    </div>
  );
}
