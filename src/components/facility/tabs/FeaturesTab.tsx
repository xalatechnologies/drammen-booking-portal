
import React from "react";
import { Card } from "@/components/ui/card";
import { Users, Clock, CheckCircle } from "lucide-react";

interface FeaturesTabProps {
  capacity: number;
  equipment: string[];
  amenities: string[];
  getAmenityIcon: (amenity: string) => JSX.Element;
}

export function FeaturesTab({ capacity, equipment, amenities, getAmenityIcon }: FeaturesTabProps) {
  // Filter out Wi-Fi from equipment since it's shown in amenities
  const filteredEquipment = equipment.filter(item => 
    !item.toLowerCase().includes('wi-fi') && !item.toLowerCase().includes('wifi')
  );

  return (
    <div className="p-6 space-y-6">
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
    </div>
  );
}
