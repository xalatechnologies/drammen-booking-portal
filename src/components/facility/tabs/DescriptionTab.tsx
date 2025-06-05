
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ZoneBookingCard } from "@/components/facility/ZoneBookingCard";
import { Zone } from "@/components/booking/types";
import { MapPin, Users, Calendar, Clock, CheckCircle, AlertCircle, Info } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface DescriptionTabProps {
  description: string;
  capacity: number;
  quickFacts: React.ReactNode;
  zones: Zone[];
}

export function DescriptionTab({ description, capacity, quickFacts, zones }: DescriptionTabProps) {
  const navigate = useNavigate();

  return (
    <div className="p-6 space-y-8">
      <div>
        <h2 className="text-2xl font-semibold mb-6">Om lokalet</h2>
        <p className="text-base text-gray-700 leading-relaxed mb-6 whitespace-pre-line">{description}</p>
        
        <div className="pt-6 border-t border-gray-100">
          <h3 className="font-semibold text-xl mb-4">Egnet for</h3>
          <div className="flex flex-wrap gap-3">
            <Badge variant="outline" className="bg-slate-700 text-white border-slate-700 text-base py-2 px-4 font-medium">Idrett</Badge>
            <Badge variant="outline" className="bg-slate-700 text-white border-slate-700 text-base py-2 px-4 font-medium">Trening</Badge>
            <Badge variant="outline" className="bg-slate-700 text-white border-slate-700 text-base py-2 px-4 font-medium">Arrangementer</Badge>
            <Badge variant="outline" className="bg-slate-700 text-white border-slate-700 text-base py-2 px-4 font-medium">Grupper</Badge>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          {quickFacts}
        </div>

        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-xl">
              <MapPin className="h-6 w-6" />
              Tilgjengelige soner
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {zones.map((zone) => (
              <ZoneBookingCard
                key={zone.id}
                zone={zone}
                facilityName="Gymsal"
                onBookClick={() => navigate(`/booking/1?zone=${zone.id}`)}
              />
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="bg-slate-700 text-white rounded-lg p-6">
        <h3 className="font-semibold text-xl mb-4 flex items-center gap-2">
          <Info className="h-6 w-6" />
          Regler og retningslinjer
        </h3>
        <div className="space-y-3 text-base leading-relaxed">
          <p>• Kun innendørssko tillatt i gymsalen</p>
          <p>• Mat og drikke må konsumeres i pauseområdene</p>
          <p>• Alt utstyr må ryddes tilbake etter bruk</p>
          <p>• Røyking er strengt forbudt i hele bygget</p>
          <p>• Musikk og høy lyd må avsluttes senest kl. 22:00</p>
          <p>• Nøkler/tilgangskort må returneres umiddelbart etter bruk</p>
        </div>
      </div>
    </div>
  );
}
