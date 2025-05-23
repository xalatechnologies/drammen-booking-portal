
import React from "react";
import { CheckCircle } from "lucide-react";
import { BookingSummary } from "../BookingSummary";
import type { BookingData } from "../BookingSummary";

interface BookingConfirmStepProps {
  facilityName: string;
  bookingData: BookingData;
}

export function BookingConfirmStep({ facilityName, bookingData }: BookingConfirmStepProps) {
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
      
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <p className="text-amber-800 text-sm">
          Ved å sende inn denne reservasjonen bekrefter du at informasjonen er korrekt og at du aksepterer våre vilkår og betingelser for bruk av kommunale lokaler.
        </p>
      </div>
    </div>
  );
}
