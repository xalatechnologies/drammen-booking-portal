import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CheckCircle, ArrowLeft, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import GlobalHeader from "@/components/GlobalHeader";
import GlobalFooter from "@/components/GlobalFooter";
import { FormStepper } from "@/components/booking/FormStepper";
import { EnhancedBookingForm } from "@/components/booking/EnhancedBookingForm";
import { Zone } from "@/components/booking/types";

const BookingPage = () => {
  const { facilityId } = useParams();
  const navigate = useNavigate();
  const [isBookingComplete, setIsBookingComplete] = useState(false);
  const [bookingReference, setBookingReference] = useState("");

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
        features: ["Avansert AV-utstyr", "Fleksibel belysning", "Akustikk optimalisert"],
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
    setIsBookingComplete(true);
  };

  const steps = ["Detaljer", "Kontakt", "Bekreft"];

  if (isBookingComplete) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <GlobalHeader />
        
        <div className="flex-grow flex items-center justify-center py-12 px-4">
          <Card className="w-full max-w-2xl">
            <CardContent className="text-center py-12">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
              
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Reservasjon fullført!
              </h1>
              
              <p className="text-lg text-gray-600 mb-6 max-w-md mx-auto">
                Din reservasjon er mottatt og vil bli behandlet. Referansenummer: <strong>{bookingReference}</strong>
              </p>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8 text-left">
                <h3 className="font-semibold text-blue-900 mb-2">Hva skjer nå?</h3>
                <ul className="text-blue-800 space-y-1 text-sm">
                  <li>• En bekreftelse er sendt til din e-post</li>
                  <li>• Du vil motta SMS når reservasjonen er godkjent</li>
                  <li>• Behandlingstid er vanligvis 1-2 virkedager</li>
                </ul>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  onClick={() => navigate("/bookings")}
                  className="bg-blue-600 hover:bg-blue-700"
                  size="lg"
                >
                  Se dine reservasjoner
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => navigate(`/facilities/${facilityId}`)}
                  size="lg"
                >
                  Tilbake til lokalet
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <GlobalFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <GlobalHeader />

      {/* Breadcrumb Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-3">
          <nav className="flex items-center space-x-2 text-sm">
            <Button 
              variant="ghost" 
              size="sm"
              className="text-gray-600 hover:text-gray-900 p-0 h-auto font-normal"
              onClick={() => navigate("/")}
            >
              <Home className="h-4 w-4 mr-1" />
              Hjem
            </Button>
            <span className="text-gray-400">/</span>
            <Button 
              variant="ghost" 
              size="sm"
              className="text-gray-600 hover:text-gray-900 p-0 h-auto font-normal"
              onClick={() => navigate(`/facilities/${facilityId}`)}
            >
              {facility.name}
            </Button>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-medium">Ny reservasjon</span>
          </nav>
        </div>
      </div>

      <div className="flex-grow py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Page Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Reserver {facility.name}
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Fyll ut skjemaet under for å reservere lokalet. All informasjon behandles trygt og sikkert.
            </p>
          </div>

          {/* Main Booking Form Card */}
          <Card className="shadow-lg">
            <CardHeader className="border-b bg-gray-50">
              <CardTitle className="text-xl">Reservasjonsskjema</CardTitle>
              <FormStepper currentStep={0} steps={steps} />
            </CardHeader>
            <CardContent className="p-8">
              <EnhancedBookingForm 
                facility={facility}
                onBookingComplete={handleBookingComplete}
              />
            </CardContent>
          </Card>
        </div>
      </div>

      <GlobalFooter />
    </div>
  );
};

export default BookingPage;
