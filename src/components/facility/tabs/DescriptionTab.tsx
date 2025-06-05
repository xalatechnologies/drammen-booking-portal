
import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, Clock, MapPin, Users, CheckCircle } from "lucide-react";
import { Zone } from "@/components/booking/types";

interface DescriptionTabProps {
  description: string;
  capacity: number;
  quickFacts: React.ReactNode;
  zones: Zone[];
}

export function DescriptionTab({ description, capacity, quickFacts, zones }: DescriptionTabProps) {
  return (
    <div className="p-6 space-y-6">
      {/* Quick facts */}
      {quickFacts}

      <div>
        <h2 className="text-xl font-medium mb-4">Om lokalet</h2>
        <p className="text-gray-700 leading-relaxed">{description}</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-4">
          <h3 className="font-medium text-lg mb-3 flex items-center gap-2">
            <Heart className="h-5 w-5 text-red-500" />
            Egnet for
          </h3>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Idrett</Badge>
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Trening</Badge>
            <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">Arrangementer</Badge>
            <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">Grupper</Badge>
            <Badge variant="outline" className="bg-pink-50 text-pink-700 border-pink-200">Dans</Badge>
            <Badge variant="outline" className="bg-teal-50 text-teal-700 border-teal-200">Ballsport</Badge>
            <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200">Presentasjoner</Badge>
          </div>
        </Card>

        <Card className="p-4">
          <h3 className="font-medium text-lg mb-3 flex items-center gap-2">
            <Clock className="h-5 w-5 text-blue-500" />
            Praktisk informasjon
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Åpningstider:</span>
              <span className="font-medium">06:00 - 23:00</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Kapasitet:</span>
              <span className="font-medium">{capacity} personer</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Gulvtype:</span>
              <span className="font-medium">Parkett</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Ventilasjon:</span>
              <span className="font-medium">Moderne system</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Compact Zone cards in 3-column grid */}
      <ZoneGrid zones={zones} />

      <RulesSection />
    </div>
  );
}

function ZoneGrid({ zones }: { zones: Zone[] }) {
  return (
    <div>
      <h3 className="font-medium text-lg mb-4 flex items-center gap-2">
        <MapPin className="h-5 w-5" />
        Tilgjengelige soner
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {zones.map((zone) => (
          <ZoneCard key={zone.id} zone={zone} />
        ))}
      </div>
    </div>
  );
}

function ZoneCard({ zone }: { zone: Zone }) {
  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-medium text-sm">{zone.name}</h4>
        <div className="text-right">
          <div className="text-lg font-bold text-gray-900">{zone.pricePerHour} kr</div>
          <div className="text-xs text-gray-500">per time</div>
        </div>
      </div>
      
      <div className="flex items-center gap-3 text-xs text-gray-600 mb-2">
        <div className="flex items-center gap-1">
          <Users className="h-3 w-3" />
          <span>{zone.capacity}</span>
        </div>
        {zone.area && (
          <div className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            <span>{zone.area}</span>
          </div>
        )}
      </div>
      
      <p className="text-xs text-gray-600 mb-3 line-clamp-2">{zone.description}</p>
      
      <div className="flex flex-wrap gap-1 mb-3">
        {zone.equipment.slice(0, 2).map((item, i) => (
          <Badge key={i} variant="outline" className="text-xs py-0.5 px-1.5">
            {item}
          </Badge>
        ))}
        {zone.equipment.length > 2 && (
          <Badge variant="outline" className="text-xs py-0.5 px-1.5">
            +{zone.equipment.length - 2}
          </Badge>
        )}
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 text-xs text-green-600">
          <CheckCircle className="h-3 w-3" />
          <span>Tilgjengelig</span>
        </div>
        <Button 
          size="sm"
          className="bg-[#0B3D91] hover:bg-blue-700 text-white h-7 text-xs px-3"
        >
          Reserver
        </Button>
      </div>
    </div>
  );
}

function RulesSection() {
  return (
    <div>
      <h3 className="font-medium text-lg mb-3">Regler og retningslinjer</h3>
      <div className="bg-gray-50 p-4 rounded-lg">
        <ul className="space-y-2 text-sm text-gray-700">
          <li>• Innendørssko påkrevd i gymsalen</li>
          <li>• Maks antall deltakere må respekteres</li>
          <li>• Røyking og alkohol er forbudt</li>
          <li>• Lokalet må ryddes etter bruk</li>
          <li>• Skader på utstyr må rapporteres umiddelbart</li>
          <li>• Musikk må holdes på akseptabelt nivå</li>
        </ul>
      </div>
    </div>
  );
}
