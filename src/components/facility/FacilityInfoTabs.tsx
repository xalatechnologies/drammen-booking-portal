
import React, { useState } from "react";
import { format } from "date-fns";
import { nb } from "date-fns/locale";
import { CheckCircle, Users, Clock, Info, MapPin, Wifi, Car, Coffee, Shield, Heart } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ZoneAvailabilityTable } from "@/components/facility/ZoneAvailabilityTable";
import { isDateUnavailable, isNorwegianHoliday } from "@/utils/holidaysAndAvailability";
import { Zone } from "@/components/booking/types";

interface FacilityInfoTabsProps {
  description: string;
  capacity: number;
  equipment: string[];
  zones: Zone[];
  amenities: string[];
  address: string;
  quickFacts: React.ReactNode;
  zoneCards: React.ReactNode;
}

export function FacilityInfoTabs({ 
  description, 
  capacity, 
  equipment, 
  zones, 
  amenities, 
  address,
  quickFacts,
  zoneCards
}: FacilityInfoTabsProps) {
  const [date] = useState<Date>(new Date());

  // Filter out Wi-Fi from equipment since it's shown in amenities
  const filteredEquipment = equipment.filter(item => 
    !item.toLowerCase().includes('wi-fi') && !item.toLowerCase().includes('wifi')
  );

  const getAmenityIcon = (amenity: string) => {
    switch (amenity.toLowerCase()) {
      case 'wi-fi':
      case 'wifi':
        return <Wifi className="h-4 w-4" />;
      case 'parkering':
        return <Car className="h-4 w-4" />;
      case 'kafeteria':
        return <Coffee className="h-4 w-4" />;
      case 'sikkerhetskameraer':
      case 'brannsikkerhet':
      case 'førstehjelpsutstyr':
        return <Shield className="h-4 w-4" />;
      default:
        return <CheckCircle className="h-4 w-4" />;
    }
  };

  return (
    <Tabs defaultValue="description" className="bg-white rounded-lg shadow-sm border">
      <TabsList className="w-full border-b p-0 h-auto bg-transparent">
        <TabsTrigger value="description" className="flex-1 py-3 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:shadow-none data-[state=active]:bg-transparent">
          Om lokalet
        </TabsTrigger>
        <TabsTrigger value="features" className="flex-1 py-3 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:shadow-none data-[state=active]:bg-transparent">
          Fasiliteter
        </TabsTrigger>
        <TabsTrigger value="availability" className="flex-1 py-3 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:shadow-none data-[state=active]:bg-transparent">
          Tilgjengelighet
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="description" className="p-6 space-y-6">
        {/* Quick facts moved into the description tab */}
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

        {/* Zone cards moved into description tab */}
        {zoneCards}

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
      </TabsContent>
      
      <TabsContent value="features" className="p-6 space-y-6">
        <div>
          <h2 className="text-xl font-medium mb-4">Fasiliteter og utstyr</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <Card className="p-4">
              <h3 className="font-medium text-lg mb-3 flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-600" />
                Kapasitet og størrelse
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Maks personer:</span>
                  <span className="font-medium">{capacity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Areal:</span>
                  <span className="font-medium">120 m²</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Takhøyde:</span>
                  <span className="font-medium">6 meter</span>
                </div>
              </div>
            </Card>
            
            <Card className="p-4">
              <h3 className="font-medium text-lg mb-3 flex items-center gap-2">
                <Clock className="h-5 w-5 text-green-600" />
                Åpningstider
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Mandag - Fredag:</span>
                  <span className="font-medium">06:00 - 23:00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Lørdag - Søndag:</span>
                  <span className="font-medium">08:00 - 22:00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Helligdager:</span>
                  <span className="font-medium">Stengt</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
        
        <div>
          <h3 className="font-medium text-lg mb-3">Tilgjengelig utstyr</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {filteredEquipment.map((item, i) => (
              <div key={i} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                <span className="text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-medium text-lg mb-3">Fasiliteter og tjenester</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {amenities.map((amenity, i) => (
              <div key={i} className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                {getAmenityIcon(amenity)}
                <span className="text-sm text-blue-900">{amenity}</span>
              </div>
            ))}
          </div>
        </div>
      </TabsContent>
      
      <TabsContent value="availability" className="p-6">
        <div>
          <h2 className="text-xl font-medium mb-4">Tilgjengelighet per sone</h2>
          <ZoneAvailabilityTable 
            zones={zones}
            startDate={date}
            timeSlots={["08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00"]}
          />
        </div>
      </TabsContent>
    </Tabs>
  );
}
