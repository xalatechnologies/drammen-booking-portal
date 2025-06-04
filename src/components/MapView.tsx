
import React, { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { Card } from './ui/card';
import { MapPin } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';

// Correct facility locations with accurate addresses and coordinates matching FacilityManagement page
const facilityLocations = [
  {
    id: 1,
    name: "Brandengen Skole - Gymsal",
    address: "Knoffs gate 8, 3044 Drammen",
    lat: 59.7464,
    lng: 10.2045
  },
  {
    id: 2,
    name: "Fjell Skole - Aktivitetshall", 
    address: "Lauritz Grønlands vei 40, 3035 Drammen",
    lat: 59.7298,
    lng: 10.1845
  },
  {
    id: 3,
    name: "Gulskogen Skole - Auditorium",
    address: "Smithestrømsveien 13, 3048 Drammen", 
    lat: 59.7512,
    lng: 10.1689
  },
  {
    id: 4,
    name: "Marienlyst Stadion - Møtesal",
    address: "Marienlyst 14, 3045 Drammen",
    lat: 59.7389,
    lng: 10.2167
  },
  {
    id: 5,
    name: "Drammensbadet - Svømmehall",
    address: "Ormåsen 1, 3048 Drammen",
    lat: 59.7545,
    lng: 10.1798
  },
  {
    id: 6,
    name: "Åssiden Fotballhall",
    address: "Buskerudveien 54, 3024 Drammen",
    lat: 59.7634,
    lng: 10.1456
  },
  {
    id: 7,
    name: "Drammen Bibliotek - Møterom",
    address: "Grønland 32, 3045 Drammen",
    lat: 59.7423,
    lng: 10.2056
  },
];

interface MapViewProps {
  facilityType: string;
  location: string;
}

const MapView: React.FC<MapViewProps> = ({ facilityType, location }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
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

  const clearMarkers = () => {
    markersRef.current.forEach(marker => {
      marker.setMap(null);
    });
    markersRef.current = [];
  };

  const initializeMap = async (key: string) => {
    if (!mapContainerRef.current || !key) {
      console.log('Map container or API key not ready');
      return;
    }

    // Wait a bit to ensure the container is fully rendered
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Double check the container is still available and visible
    if (!mapContainerRef.current || mapContainerRef.current.offsetWidth === 0) {
      console.log('Map container not properly mounted');
      return;
    }

    setIsLoading(true);
    clearMarkers();

    try {
      console.log('Initializing Google Maps...');
      
      const loader = new Loader({
        apiKey: key,
        version: "weekly",
        libraries: ["places"]
      });

      const { Map } = await loader.importLibrary("maps") as google.maps.MapsLibrary;

      // Create map instance
      const map = new Map(mapContainerRef.current, {
        center: { lat: 59.7439, lng: 10.2045 }, // Center on Drammen
        zoom: 12,
        mapTypeControl: true,
        streetViewControl: true,
        fullscreenControl: true,
      });

      console.log('Map created, adding markers...');

      // Add markers for each facility
      filteredFacilities.forEach((facility, index) => {
        // Create info window content
        const infoWindow = new google.maps.InfoWindow({
          content: `
            <div style="padding: 8px;">
              <h3 style="font-weight: 600; font-size: 14px; margin-bottom: 4px;">${facility.name}</h3>
              <p style="font-size: 12px; color: #666; margin: 0;">${facility.address}</p>
            </div>
          `
        });

        // Create marker using standard Marker class
        const marker = new google.maps.Marker({
          position: { lat: facility.lat, lng: facility.lng },
          map: map,
          title: facility.name,
        });

        // Store marker reference
        markersRef.current.push(marker);

        // Add click listener to show info window
        marker.addListener('click', () => {
          infoWindow.open(map, marker);
        });
        
        console.log(`Added marker ${index + 1}: ${facility.name}`);
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
      console.log('Google Maps loaded successfully with', filteredFacilities.length, 'markers');
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
    clearMarkers();
    if (mapRef.current) {
      mapRef.current = null;
    }
  };

  useEffect(() => {
    if (apiKey && mapContainerRef.current) {
      // Small delay to ensure container is ready
      const timeoutId = setTimeout(() => {
        initializeMap(apiKey);
      }, 200);
      
      return () => clearTimeout(timeoutId);
    }
  }, [apiKey, filteredFacilities]);

  return (
    <div className="relative w-full">
      <div className="mt-4">
        <Card className="min-h-[400px] relative overflow-hidden">
          {!apiKey ? (
            <div className="h-[400px] w-full relative bg-gradient-to-br from-blue-50 to-green-50">
              {/* Illustration Map Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-green-50 to-blue-50">
                {/* Stylized map elements */}
                <div className="absolute top-8 left-12 w-16 h-12 bg-blue-200 rounded-full opacity-60"></div>
                <div className="absolute top-24 right-16 w-24 h-8 bg-green-200 rounded-lg opacity-50"></div>
                <div className="absolute bottom-20 left-8 w-20 h-16 bg-blue-300 rounded-xl opacity-40"></div>
                <div className="absolute bottom-8 right-12 w-12 h-20 bg-green-300 rounded-lg opacity-45"></div>
                
                {/* Mock roads */}
                <div className="absolute top-1/3 left-0 right-0 h-1 bg-gray-300 opacity-60 transform rotate-12"></div>
                <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-300 opacity-60 transform -rotate-6"></div>
                <div className="absolute left-1/3 top-0 bottom-0 w-1 bg-gray-300 opacity-60"></div>
              </div>

              {/* Facility markers on illustration */}
              {filteredFacilities.slice(0, 6).map((facility, index) => (
                <div
                  key={facility.id}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
                  style={{
                    left: `${20 + (index % 3) * 30}%`,
                    top: `${25 + Math.floor(index / 3) * 40}%`
                  }}
                >
                  <div className="relative">
                    <div className="w-8 h-8 bg-red-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center transform transition-all duration-200 group-hover:scale-110">
                      <MapPin className="h-4 w-4 text-white" />
                    </div>
                    
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                      {facility.name}
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-2 border-transparent border-t-gray-900"></div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Overlay content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-white/90 backdrop-blur-sm">
                <div className="text-center max-w-md">
                  <div className="mb-6">
                    <div className="h-16 w-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-4">
                      <MapPin className="h-8 w-8 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">Kartvisning - Prototype</h3>
                    <p className="text-gray-600 mb-4">Viser {filteredFacilities.length} fasiliteter på illustrert kart. Legg inn Google Maps API-nøkkel for ekte kartfunksjonalitet.</p>
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
                      Aktiver ekte kart
                    </Button>
                    <p className="text-xs text-gray-500">
                      Få API-nøkkel på <a href="https://console.cloud.google.com/google/maps-apis/" className="text-blue-600 underline" target="_blank" rel="noreferrer">Google Cloud Console</a>
                    </p>
                  </div>
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

              {/* Map container with explicit dimensions */}
              <div 
                ref={mapContainerRef} 
                className="h-[400px] w-full"
                style={{ minHeight: '400px', width: '100%' }}
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
