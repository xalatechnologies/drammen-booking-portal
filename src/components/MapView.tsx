
import React, { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { Card } from './ui/card';
import { MapPin } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';

// Mock data for facility locations with correct addresses and coordinates
const facilityLocations = [
  {
    id: 1,
    name: "Brandengen Skole - Gymsal",
    address: "Iver Holters gate 48, 3041 Drammen",
    lat: 59.7461,
    lng: 10.2089
  },
  {
    id: 4,
    name: "Fjell Skole - Aktivitetshall", 
    address: "Lauritz Hervigs vei 20, 3035 Drammen",
    lat: 59.7312,
    lng: 10.1823
  },
  {
    id: 5,
    name: "Gulskogen Skole - Auditorium",
    address: "Vintergata 8, 3048 Drammen", 
    lat: 59.7524,
    lng: 10.1756
  },
  {
    id: 6,
    name: "Marienlyst Stadion - Møtesal",
    address: "Schwartz gate 2, 3043 Drammen",
    lat: 59.7389,
    lng: 10.2134
  },
  {
    id: 7,
    name: "Drammensbadet - Svømmehall",
    address: "Danvikgata 40, 3045 Drammen",
    lat: 59.7578,
    lng: 10.1834
  },
  {
    id: 8,
    name: "Åssiden Fotballhall",
    address: "Buskerudveien 54, 3024 Drammen",
    lat: 59.7624,
    lng: 10.1425
  },
];

interface MapViewProps {
  facilityType: string;
  location: string;
}

const MapView: React.FC<MapViewProps> = ({ facilityType, location }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const [apiKey, setApiKey] = useState<string>("");
  const [keyInput, setKeyInput] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Load saved API key from localStorage on component mount
  useEffect(() => {
    const savedKey = localStorage.getItem('google-maps-api-key');
    if (savedKey) {
      setApiKey(savedKey);
    }
  }, []);

  // Filter facilities based on selected filters
  const filteredFacilities = facilityLocations.filter(facility => {
    const matchesType = !facilityType || facilityType === "";
    const matchesLocation = !location || location === "" || facility.address.toLowerCase().includes(location.toLowerCase());
    return matchesType && matchesLocation;
  });

  const initializeMap = async (key: string) => {
    if (!mapContainerRef.current || !key) return;

    setIsLoading(true);

    try {
      const loader = new Loader({
        apiKey: key,
        version: "weekly",
        libraries: ["places"]
      });

      const { Map } = await loader.importLibrary("maps");
      const { AdvancedMarkerElement } = await loader.importLibrary("marker");

      // Create map instance
      const map = new Map(mapContainerRef.current, {
        center: { lat: 59.7439, lng: 10.2045 }, // Center on Drammen
        zoom: 12,
        mapId: "DEMO_MAP_ID", // Required for AdvancedMarkerElement
      });

      // Add markers for each facility
      filteredFacilities.forEach(facility => {
        // Create info window content
        const infoWindow = new google.maps.InfoWindow({
          content: `
            <div style="padding: 8px;">
              <h3 style="font-weight: 600; font-size: 14px; margin-bottom: 4px;">${facility.name}</h3>
              <p style="font-size: 12px; color: #666; margin: 0;">${facility.address}</p>
            </div>
          `
        });

        // Create marker
        const marker = new AdvancedMarkerElement({
          map: map,
          position: { lat: facility.lat, lng: facility.lng },
          title: facility.name,
        });

        // Add click listener to show info window
        marker.addListener('click', () => {
          infoWindow.open(map, marker);
        });
      });

      // Fit map to show all markers if there are multiple facilities
      if (filteredFacilities.length > 1) {
        const bounds = new google.maps.LatLngBounds();
        filteredFacilities.forEach(facility => {
          bounds.extend({ lat: facility.lat, lng: facility.lng });
        });
        map.fitBounds(bounds);
      }

      mapRef.current = map;
    } catch (error) {
      console.error('Error loading Google Maps:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeySubmit = () => {
    if (keyInput.trim()) {
      const key = keyInput.trim();
      setApiKey(key);
      // Save key to localStorage for future use
      localStorage.setItem('google-maps-api-key', key);
    }
  };

  const handleClearKey = () => {
    setApiKey("");
    setKeyInput("");
    localStorage.removeItem('google-maps-api-key');
    if (mapRef.current) {
      mapRef.current = null;
    }
  };

  useEffect(() => {
    if (apiKey) {
      initializeMap(apiKey);
    }
  }, [apiKey, filteredFacilities]);

  return (
    <div className="relative w-full">
      <div className="mt-4">
        <Card className="min-h-[400px] relative overflow-hidden">
          {!apiKey ? (
            <div className="h-[400px] w-full flex flex-col items-center justify-center p-6">
              <div className="text-center max-w-md">
                <div className="mb-6">
                  <div className="h-16 w-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-4">
                    <MapPin className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">Google Maps API Key Required</h3>
                  <p className="text-gray-600 mb-4">Enter your Google Maps API key to display the interactive map</p>
                </div>
                
                <div className="space-y-3">
                  <Input 
                    type="text"
                    placeholder="AIzaSyB..." 
                    value={keyInput}
                    onChange={(e) => setKeyInput(e.target.value)}
                    className="w-full"
                  />
                  <Button 
                    onClick={handleKeySubmit}
                    disabled={!keyInput.trim()}
                    className="w-full"
                  >
                    Initialize Map
                  </Button>
                  <p className="text-xs text-gray-500">
                    Get an API key at <a href="https://console.cloud.google.com/google/maps-apis/" className="text-blue-600 underline" target="_blank" rel="noreferrer">Google Cloud Console</a>
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="absolute top-4 right-4 z-10 bg-white/95 backdrop-blur-sm border border-gray-200 rounded-lg p-3 shadow-md max-w-xs">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm font-medium">Viser {filteredFacilities.length} fasiliteter</p>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleClearKey}
                    className="h-6 px-2 text-xs"
                  >
                    Reset API Key
                  </Button>
                </div>
                <div className="space-y-1 max-h-32 overflow-y-auto">
                  {filteredFacilities.map(facility => (
                    <div key={facility.id} className="text-xs flex items-start gap-1.5">
                      <MapPin className="h-3 w-3 mt-0.5 text-blue-600 flex-shrink-0" />
                      <span className="line-clamp-2">{facility.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Map container */}
              <div 
                ref={mapContainerRef} 
                className="h-[400px] w-full"
              />
              
              {isLoading && (
                <div className="absolute inset-0 bg-white/50 flex items-center justify-center">
                  <div className="text-sm text-gray-600">Loading map...</div>
                </div>
              )}
            </>
          )}
        </Card>
      </div>
    </div>
  );
};

export default MapView;
