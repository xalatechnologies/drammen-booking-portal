
import React from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface BookingSuccessPageProps {
  bookingReference: string;
  facilityId: string | undefined;
}

export function BookingSuccessPage({ bookingReference, facilityId }: BookingSuccessPageProps) {
  const navigate = useNavigate();

  return (
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
  );
}
