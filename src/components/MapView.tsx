
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
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
    lat: 59.7456,
    lng: 10.2067
  },
  {
    id: 4,
    name: "Fjell Skole - Aktivitetshall", 
    address: "Lauritz Hervigs vei 20, 3035 Drammen",
    lat: 59.7295,
    lng: 10.1845
  },
  {
    id: 5,
    name: "Gulskogen Skole - Auditorium",
    address: "Vintergata 8, 3048 Drammen", 
    lat: 59.7518,
    lng: 10.1734
  },
  {
    id: 6,
    name: "Marienlyst Stadion - Møtesal",
    address: "Schwartz gate 2, 3043 Drammen",
    lat: 59.7398,
    lng: 10.2156
  },
  {
    id: 7,
    name: "Drammensbadet - Svømmehall",
    address: "Danvikgata 40, 3045 Drammen",
    lat: 59.7589,
    lng: 10.1823
  },
  {
    id: 8,
    name: "Åssiden Fotballhall",
    address: "Buskerudveien 54, 3024 Drammen",
    lat: 59.7631,
    lng: 10.1402
  },
];

interface MapViewProps {
  facilityType: string;
  location: string;
}

const MapView: React.FC<MapViewProps> = ({ facilityType, location }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [mapToken, setMapToken] = useState<string>("");
  const [tokenInput, setTokenInput] = useState<string>("");

  // Load saved token from localStorage on component mount
  useEffect(() => {
    const savedToken = localStorage.getItem('mapbox-token');
    if (savedToken) {
      setMapToken(savedToken);
    }
  }, []);

  // Filter facilities based on selected filters
  const filteredFacilities = facilityLocations.filter(facility => {
    const matchesType = !facilityType || facilityType === "";
    const matchesLocation = !location || location === "" || facility.address.toLowerCase().includes(location.toLowerCase());
    return matchesType && matchesLocation;
  });

  const initializeMap = (token: string) => {
    if (!mapContainerRef.current || !token) return;

    // Set Mapbox access token
    mapboxgl.accessToken = token;

    // Create map instance
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [10.2045, 59.7439], // Center on Drammen
      zoom: 12
    });

    // Add navigation controls
    map.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Add markers for each facility
    filteredFacilities.forEach(facility => {
      // Create popup
      const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
        `<div class="p-2">
          <h3 class="font-semibold text-sm mb-1">${facility.name}</h3>
          <p class="text-xs text-gray-600">${facility.address}</p>
        </div>`
      );

      // Create marker
      new mapboxgl.Marker({
        color: '#3b82f6'
      })
        .setLngLat([facility.lng, facility.lat])
        .setPopup(popup)
        .addTo(map);
    });

    // Fit map to show all markers if there are multiple facilities
    if (filteredFacilities.length > 1) {
      const bounds = new mapboxgl.LngLatBounds();
      filteredFacilities.forEach(facility => {
        bounds.extend([facility.lng, facility.lat]);
      });
      map.fitBounds(bounds, { padding: 50 });
    }

    mapRef.current = map;
  };

  const handleTokenSubmit = () => {
    if (tokenInput.trim()) {
      const token = tokenInput.trim();
      setMapToken(token);
      // Save token to localStorage for future use
      localStorage.setItem('mapbox-token', token);
    }
  };

  const handleClearToken = () => {
    setMapToken("");
    setTokenInput("");
    localStorage.removeItem('mapbox-token');
    if (mapRef.current) {
      mapRef.current.remove();
      mapRef.current = null;
    }
  };

  useEffect(() => {
    if (mapToken) {
      initializeMap(mapToken);
    }

    // Cleanup function
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [mapToken, filteredFacilities]);

  return (
    <div className="relative w-full">
      <div className="mt-4">
        <Card className="min-h-[400px] relative overflow-hidden">
          {!mapToken ? (
            <div className="h-[400px] w-full flex flex-col items-center justify-center p-6">
              <div className="text-center max-w-md">
                <div className="mb-6">
                  <div className="h-16 w-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-4">
                    <MapPin className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">Mapbox Token Required</h3>
                  <p className="text-gray-600 mb-4">Enter your Mapbox public token to display the interactive map</p>
                </div>
                
                <div className="space-y-3">
                  <Input 
                    type="text"
                    placeholder="pk.eyJ1IjoieW91..." 
                    value={tokenInput}
                    onChange={(e) => setTokenInput(e.target.value)}
                    className="w-full"
                  />
                  <Button 
                    onClick={handleTokenSubmit}
                    disabled={!tokenInput.trim()}
                    className="w-full"
                  >
                    Initialize Map
                  </Button>
                  <p className="text-xs text-gray-500">
                    Get a token at <a href="https://mapbox.com/" className="text-blue-600 underline" target="_blank" rel="noreferrer">mapbox.com</a>
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
                    onClick={handleClearToken}
                    className="h-6 px-2 text-xs"
                  >
                    Reset Token
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
            </>
          )}
        </Card>
      </div>
    </div>
  );
};

export default MapView;
