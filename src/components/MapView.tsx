
import React, { useEffect, useRef } from 'react';
import { Card } from './ui/card';
import { MapPin } from 'lucide-react';

// Mock data for facility locations - in a real app, this would come from your API
const facilityLocations = [
  {
    id: 1,
    name: "Brandengen Skole - Gymsal",
    address: "Knoffs gate 8, 3044 Drammen",
    lat: 59.7439,
    lng: 10.2045
  },
  {
    id: 2,
    name: "Fjell Skole - Aktivitetshall",
    address: "Lauritz Grønlands vei 40, 3035 Drammen",
    lat: 59.7338,
    lng: 10.1846
  },
  {
    id: 3,
    name: "Gulskogen Skole - Auditorium",
    address: "Smithestrømsveien 13, 3048 Drammen",
    lat: 59.7502,
    lng: 10.1741
  },
  {
    id: 4,
    name: "Marienlyst Stadion - Møtesal",
    address: "Marienlyst 14, 3045 Drammen",
    lat: 59.7365,
    lng: 10.2103
  },
  {
    id: 5,
    name: "Drammensbadet - Svømmehall",
    address: "Ormåsen 1, 3048 Drammen",
    lat: 59.7554,
    lng: 10.1812
  },
];

interface MapViewProps {
  facilityType: string;
  location: string;
}

const MapView: React.FC<MapViewProps> = ({ facilityType, location }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [mapToken, setMapToken] = useState<string>(""); 

  // Filter facilities based on selected filters
  const filteredFacilities = facilityLocations.filter(facility => {
    const matchesType = !facilityType || facilityType === "";
    const matchesLocation = !location || location === "" || facility.address.toLowerCase().includes(location.toLowerCase());
    return matchesType && matchesLocation;
  });

  useEffect(() => {
    // This is a placeholder for map implementation
    // For a real implementation, you would use a map library like Mapbox, Google Maps, or Leaflet
    console.log("Map would initialize here with these locations:", filteredFacilities);
    
    // Clean up function
    return () => {
      console.log("Map cleanup would happen here");
    };
  }, [filteredFacilities]);

  return (
    <div className="relative w-full">
      <div className="mt-4">
        {/* Placeholder for map implementation */}
        <Card className="min-h-[400px] bg-gray-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 bg-white border-l border-b rounded-bl-lg shadow-md">
            <p className="text-sm font-medium">Viser {filteredFacilities.length} fasiliteter</p>
            <div className="flex flex-col gap-1 mt-2">
              {filteredFacilities.map(facility => (
                <div key={facility.id} className="text-xs flex items-start gap-1">
                  <MapPin className="h-3 w-3 mt-0.5 text-blue-600 flex-shrink-0" />
                  <span className="truncate">{facility.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Map container */}
          <div 
            ref={mapContainerRef} 
            className="h-[400px] w-full flex flex-col items-center justify-center"
          >
            {!mapToken ? (
              <div className="text-center p-6">
                <h3 className="text-lg font-medium mb-2">Mapbox Token Required</h3>
                <p className="text-gray-600 mb-4">Enter your Mapbox public token to initialize the map</p>
                <div className="max-w-sm mx-auto">
                  <input 
                    type="text"
                    placeholder="pk.eyJ1IjoieW91..." 
                    className="w-full px-4 py-2 border rounded mb-3"
                    onChange={(e) => setMapToken(e.target.value)}
                  />
                  <p className="text-xs text-gray-500">
                    Get a token at <a href="https://mapbox.com/" className="text-blue-600 underline" target="_blank" rel="noreferrer">mapbox.com</a>
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <div className="mb-6">
                  <div className="h-24 w-24 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
                    <MapPin className="h-10 w-10 text-blue-600" />
                  </div>
                </div>
                <p className="text-gray-500 text-lg">Kart vil vises her med {filteredFacilities.length} fasiliteter</p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

import { useState } from 'react';
export default MapView;
