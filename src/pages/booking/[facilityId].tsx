import React, { useState } from "react";
import { useParams } from "react-router-dom";
import GlobalHeader from "@/components/GlobalHeader";
import GlobalFooter from "@/components/GlobalFooter";
import { EnhancedBookingForm } from "@/components/booking/EnhancedBookingForm";
import { BookingPageHeader } from "@/components/facility/booking/BookingPageHeader";
import { BookingSuccessPage } from "@/components/facility/booking/BookingSuccessPage";
import { Zone } from "@/components/booking/types";
import { RecurrencePattern } from "@/utils/recurrenceEngine";

const BookingPage = () => {
  const { facilityId } = useParams();
  const [isBookingComplete, setIsBookingComplete] = useState(false);
  const [bookingReference, setBookingReference] = useState("");
  const [recurrencePattern, setRecurrencePattern] = useState<RecurrencePattern | null>(null);
  const [isRecurring, setIsRecurring] = useState(false);

  // Mock facility data - in real app this would be fetched based on facilityId
  const facility = {
    id: facilityId,
    name: `Gymsal ${facilityId} - Brandengen skole`,
    address: "Knoffs gate 8, Drammen",
    capacity: 30,
    equipment: ["Projektor", "Lydanlegg", "Whiteboard", "Sportsutstyr"],
    zones: [
      {
        id: "whole-facility",
        name: "Hele lokalet",
        capacity: 30,
        equipment: ["Projektor", "Lydanlegg", "Whiteboard", "Sportsutstyr", "Basketkurver", "Volleyballnett", "Håndballmål"],
        pricePerHour: 450,
        description: "Komplett gymsal med full tilgang til alt utstyr og alle soner",
        area: "120 m²",
        isMainZone: true,
        subZones: ["zone-1", "zone-2"],
        bookingRules: {
          minBookingDuration: 2,
          maxBookingDuration: 8,
          allowedTimeSlots: ["08:00-10:00", "10:00-12:00", "12:00-14:00", "14:00-16:00", "16:00-18:00", "18:00-20:00", "20:00-22:00"],
          bookingTypes: ['one-time', 'recurring', 'fixed-lease'],
          advanceBookingDays: 90,
          cancellationHours: 48
        },
        adminInfo: {
          contactPersonName: "Lars Hansen",
          contactPersonEmail: "lars.hansen@drammen.kommune.no",
          specialInstructions: "Hele lokalet inkluderer begge soner og all tilgjengelig utstyr.",
          maintenanceSchedule: [
            { day: "Mandag", startTime: "06:00", endTime: "08:00" }
          ]
        },
        layout: {
          coordinates: { x: 0, y: 0, width: 120, height: 80 },
          entryPoints: ["Hovedinngang", "Utstyrsinngaang", "Nødutgang vest"]
        },
        accessibility: ["wheelchair", "hearing-loop", "visual-guidance"],
        features: ["Klimaanlegg", "Moderne lyd", "LED-belysning", "Sikkerhetskameraer"],
        isActive: true
      },
      {
        id: "zone-1",
        name: "Sone A (Nord)",
        capacity: 15,
        equipment: ["Lydanlegg", "Basketkurv", "Håndballmål"],
        pricePerHour: 250,
        description: "Nordre del av gymsalen med basketbane og håndballfelt",
        area: "60 m²",
        parentZoneId: "whole-facility",
        bookingRules: {
          minBookingDuration: 1,
          maxBookingDuration: 6,
          allowedTimeSlots: ["08:00-10:00", "10:00-12:00", "12:00-14:00", "14:00-16:00", "16:00-18:00", "18:00-20:00", "20:00-22:00"],
          bookingTypes: ['one-time', 'recurring'],
          advanceBookingDays: 60,
          cancellationHours: 24
        },
        adminInfo: {
          contactPersonName: "Maria Olsen",
          contactPersonEmail: "maria.olsen@drammen.kommune.no",
          specialInstructions: "Egnet for mindre ballsportaktiviteter og gruppetrening.",
          maintenanceSchedule: [
            { day: "Tirsdag", startTime: "07:00", endTime: "08:00" }
          ]
        },
        layout: {
          coordinates: { x: 0, y: 0, width: 60, height: 80 },
          entryPoints: ["Hovedinngang", "Nord-inngang"]
        },
        accessibility: ["wheelchair", "hearing-loop"],
        features: ["Delvis klimaanlegg", "God ventilasjon"],
        isActive: true
      },
      {
        id: "zone-2",
        name: "Sone B (Sør)",
        capacity: 15,
        equipment: ["Projektor", "Whiteboard", "Volleyballnett", "Presentasjonsutstyr"],
        pricePerHour: 280,
        description: "Søndre del av gymsalen med volleyballbane og presentasjoner",
        area: "60 m²",
        parentZoneId: "whole-facility",
        bookingRules: {
          minBookingDuration: 1,
          maxBookingDuration: 6,
          allowedTimeSlots: ["08:00-10:00", "10:00-12:00", "12:00-14:00", "14:00-16:00", "16:00-18:00", "18:00-20:00", "20:00-22:00"],
          bookingTypes: ['one-time', 'recurring'],
          advanceBookingDays: 60,
          cancellationHours: 24
        },
        adminInfo: {
          contactPersonName: "Erik Nordahl",
          contactPersonEmail: "erik.nordahl@drammen.kommune.no",
          specialInstructions: "Perfekt for volleyball, badminton og presentasjoner.",
          maintenanceSchedule: [
            { day: "Onsdag", startTime: "07:00", endTime: "08:00" }
          ]
        },
        layout: {
          coordinates: { x: 60, y: 0, width: 60, height: 80 },
          entryPoints: ["Hovedinngang", "Sør-inngang"]
        },
        accessibility: ["wheelchair", "hearing-loop", "visual-guidance"],
        features: ["Avansert AV-utstyr", "Fleksibel belysning", "Akustikk optimaliseret"],
        restrictions: ["Ingen mat eller drikke", "Kun innendørssko"],
        isActive: true
      }
    ] as Zone[],
    availableTimes: [
      {
        date: new Date(),
        slots: [
          { start: "08:00", end: "10:00", available: true },
          { start: "10:00", end: "12:00", available: false },
          { start: "12:00", end: "14:00", available: true },
          { start: "14:00", end: "16:00", available: true },
          { start: "16:00", end: "18:00", available: false },
          { start: "18:00", end: "20:00", available: true },
          { start: "20:00", end: "22:00", available: true },
        ]
      }
    ]
  };

  const handleBookingComplete = (reference: string) => {
    setBookingReference(reference);
    
    // Check if this is a recurring booking
    const formData = new FormData(document.querySelector('form') as HTMLFormElement);
    const bookingMode = formData.get('bookingMode');
    setIsRecurring(bookingMode === 'recurring');
    
    setIsBookingComplete(true);
  };

  if (isBookingComplete) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <GlobalHeader />
        <BookingSuccessPage 
          bookingReference={bookingReference} 
          facilityId={facilityId} 
          isRecurring={isRecurring}
          recurrencePattern={recurrencePattern}
        />
        <GlobalFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <GlobalHeader />
      <BookingPageHeader facilityId={facilityId} facilityName={facility.name} />

      <div className="flex-grow py-8">
        <div className="container mx-auto px-4 max-w-7xl">
          <EnhancedBookingForm 
            facility={facility}
            onBookingComplete={handleBookingComplete}
          />
        </div>
      </div>

      <GlobalFooter />
    </div>
  );
};

export default BookingPage;
