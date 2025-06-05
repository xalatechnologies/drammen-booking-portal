
import React, { useState } from "react";
import { MapPin, Map } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import MapView from "@/components/MapView";

interface FacilityLocationProps {
  address: string;
}

export function FacilityLocation({ address }: FacilityLocationProps) {
  const [showMap, setShowMap] = useState(false);

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Lokasjon</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowMap(!showMap)}
          className="flex items-center gap-2"
        >
          <Map className="h-4 w-4" />
          {showMap ? 'Skjul kart' : 'Vis kart'}
        </Button>
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
          <MapPin className="h-5 w-5 text-blue-600" />
          <div>
            <p className="font-medium">{address}</p>
            <p className="text-sm text-gray-600">Drammen Kommune</p>
          </div>
        </div>
        
        {showMap && (
          <div className="h-64 rounded-lg overflow-hidden border">
            <MapView facilityType="" location={address} />
          </div>
        )}
      </div>
    </Card>
  );
}
