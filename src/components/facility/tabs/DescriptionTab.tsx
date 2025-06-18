
import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, MapPin } from "lucide-react";
import { FacilityLocation } from "@/components/facility/FacilityLocation";

interface DescriptionTabProps {
  description: string;
  capacity: number;
  quickFacts: React.ReactNode;
  address: string;
}

export function DescriptionTab({ description, capacity, quickFacts, address }: DescriptionTabProps) {
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
          <Badge variant="outline" className="bg-[#1e3a8a] bg-opacity-10 text-[#1e3a8a] border-[#1e3a8a] border-[0.25px] text-base py-2 px-4 font-medium">Idrett</Badge>
          <Badge variant="outline" className="bg-[#1e3a8a] bg-opacity-10 text-[#1e3a8a] border-[#1e3a8a] border-[0.25px] text-base py-2 px-4 font-medium">Trening</Badge>
          <Badge variant="outline" className="bg-[#1e3a8a] bg-opacity-10 text-[#1e3a8a] border-[#1e3a8a] border-[0.25px] text-base py-2 px-4 font-medium">Arrangementer</Badge>
          <Badge variant="outline" className="bg-[#1e3a8a] bg-opacity-10 text-[#1e3a8a] border-[#1e3a8a] border-[0.25px] text-base py-2 px-4 font-medium">Grupper</Badge>
          <Badge variant="outline" className="bg-[#1e3a8a] bg-opacity-10 text-[#1e3a8a] border-[#1e3a8a] border-[0.25px] text-base py-2 px-4 font-medium">Dans</Badge>
          <Badge variant="outline" className="bg-[#1e3a8a] bg-opacity-10 text-[#1e3a8a] border-[#1e3a8a] border-[0.25px] text-base py-2 px-4 font-medium">Ballsport</Badge>
          <Badge variant="outline" className="bg-[#1e3a8a] bg-opacity-10 text-[#1e3a8a] border-[#1e3a8a] border-[0.25px] text-base py-2 px-4 font-medium">Presentasjoner</Badge>
        </div>
      </Card>

      {/* Location with Map */}
      <Card className="p-6">
        <div className="mb-6">
          <h3 className="text-2xl font-semibold mb-2">Lokasjon</h3>
          <p className="text-base text-gray-700 leading-relaxed">
            Finn veien til lokalet og se transportmuligheter og parkeringsalternativer.
          </p>
        </div>
        
        <div className="space-y-6">
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
            <MapPin className="h-6 w-6 text-blue-600 flex-shrink-0" />
            <div>
              <p className="font-semibold text-lg">{address}</p>
              <p className="text-base text-gray-600">Drammen Kommune</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-lg text-blue-600 mb-3">Kollektivtransport</h4>
              <div className="space-y-3 text-base">
                <div>
                  <p className="font-semibold text-base">Buss</p>
                  <p className="text-gray-700 leading-relaxed">Linje 102, 104 - Stopp: Brandengen skole (50m unna)</p>
                </div>
                <div>
                  <p className="font-semibold text-base">Tog</p>
                  <p className="text-gray-700 leading-relaxed">Drammen stasjon - 15 min med buss</p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-lg text-green-600 mb-3">Parkering</h4>
              <div className="space-y-2 text-base">
                <p className="text-gray-700 leading-relaxed">Gratis parkering tilgjengelig</p>
                <p className="text-gray-700 leading-relaxed">20 plasser på skolens område</p>
                <p className="text-gray-700 leading-relaxed">Handicapparking: 2 plasser</p>
              </div>
            </div>
          </div>
          
          <div className="h-64 rounded-lg overflow-hidden border" role="img" aria-label="Kart som viser lokasjon for Brandengen skole på Knoffs gate 8, Drammen">
            <FacilityLocation address={address} />
          </div>
        </div>
      </Card>
    </div>
  );
}
