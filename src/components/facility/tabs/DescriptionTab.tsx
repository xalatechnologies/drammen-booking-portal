import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, MapPin, Users, CheckCircle } from "lucide-react";
import { Zone } from "@/components/booking/types";

interface DescriptionTabProps {
  description: string;
  capacity: number;
  quickFacts: React.ReactNode;
  zones: Zone[];
}

export function DescriptionTab({ description, capacity, quickFacts, zones }: DescriptionTabProps) {
  return (
    <div className="p-6 space-y-8">
      {/* Quick facts */}
      {quickFacts}

      <div>
        <h2 className="text-2xl font-semibold mb-6">Om lokalet</h2>
        <p className="text-lg text-gray-700 leading-relaxed">{description}</p>
      </div>
      
      <Card className="p-6">
        <h3 className="font-semibold text-xl mb-4 flex items-center gap-2">
          <Heart className="h-6 w-6 text-red-500" />
          Egnet for
        </h3>
        <div className="flex flex-wrap gap-3">
          <Badge variant="outline" className="bg-[#1e3a8a] bg-opacity-10 text-[#1e3a8a] border-[#1e3a8a] border-[0.5px] text-base py-2 px-4 font-medium">Idrett</Badge>
          <Badge variant="outline" className="bg-[#1e3a8a] bg-opacity-10 text-[#1e3a8a] border-[#1e3a8a] border-[0.5px] text-base py-2 px-4 font-medium">Trening</Badge>
          <Badge variant="outline" className="bg-[#1e3a8a] bg-opacity-10 text-[#1e3a8a] border-[#1e3a8a] border-[0.5px] text-base py-2 px-4 font-medium">Arrangementer</Badge>
          <Badge variant="outline" className="bg-[#1e3a8a] bg-opacity-10 text-[#1e3a8a] border-[#1e3a8a] border-[0.5px] text-base py-2 px-4 font-medium">Grupper</Badge>
          <Badge variant="outline" className="bg-[#1e3a8a] bg-opacity-10 text-[#1e3a8a] border-[#1e3a8a] border-[0.5px] text-base py-2 px-4 font-medium">Dans</Badge>
          <Badge variant="outline" className="bg-[#1e3a8a] bg-opacity-10 text-[#1e3a8a] border-[#1e3a8a] border-[0.5px] text-base py-2 px-4 font-medium">Ballsport</Badge>
          <Badge variant="outline" className="bg-[#1e3a8a] bg-opacity-10 text-[#1e3a8a] border-[#1e3a8a] border-[0.5px] text-base py-2 px-4 font-medium">Presentasjoner</Badge>
        </div>
      </Card>

      {/* Compact Zone cards in 3-column grid */}
      <ZoneGrid zones={zones} />

      <RulesSection />
    </div>
  );
}

function ZoneGrid({ zones }: { zones: Zone[] }) {
  return (
    <div>
      <h3 className="font-semibold text-xl mb-6 flex items-center gap-2">
        <MapPin className="h-6 w-6" />
        Tilgjengelige soner
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {zones.map((zone) => (
          <ZoneCard key={zone.id} zone={zone} />
        ))}
      </div>
    </div>
  );
}

function ZoneCard({ zone }: { zone: Zone }) {
  return (
    <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <h4 className="font-semibold text-lg">{zone.name}</h4>
        <div className="text-right">
          <div className="text-xl font-bold text-gray-900">{zone.pricePerHour} kr</div>
          <div className="text-base text-gray-500">per time</div>
        </div>
      </div>
      
      <div className="flex items-center gap-4 text-base text-gray-600 mb-4">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          <span>{zone.capacity}</span>
        </div>
        {zone.area && (
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            <span>{zone.area}</span>
          </div>
        )}
      </div>
      
      <p className="text-base text-gray-600 mb-4 line-clamp-2 leading-relaxed">{zone.description}</p>
      
      <div className="flex flex-wrap gap-2 mb-4">
        {zone.equipment.slice(0, 2).map((item, i) => (
          <Badge key={i} variant="outline" className="text-base py-1 px-3">
            {item}
          </Badge>
        ))}
        {zone.equipment.length > 2 && (
          <Badge variant="outline" className="text-base py-1 px-3">
            +{zone.equipment.length - 2}
          </Badge>
        )}
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-base text-green-600">
          <CheckCircle className="h-5 w-5" />
          <span>Tilgjengelig</span>
        </div>
        <Button 
          size="sm"
          className="bg-[#1e3a8a] hover:bg-[#1e40af] text-white h-10 text-base px-6"
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
      <h3 className="font-semibold text-xl mb-6">Regler og retningslinjer</h3>
      <div className="bg-gray-50 p-6 rounded-lg">
        <ul className="space-y-4 text-lg text-gray-700 leading-relaxed">
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
