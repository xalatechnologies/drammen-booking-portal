import React, { useEffect, useRef, useState } from 'react';
import { Card } from './ui/card';
import { MapPin } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// Facility locations with accurate coordinates for Drammen Kommune
const facilityLocations = [
  {
    id: 1,
    name: "Brandengen Skole - Gymsal",
    address: "Iver Holters gate 48, 3041 Drammen",
    lat: 59.7464,
    lng: 10.2045
  },
  {
    id: 2,
    name: "Fjell Skole - Aktivitetshall", 
    address: "Lauritz Hervigs vei 20, 3035 Drammen",
    lat: 59.7298,
    lng: 10.1845
  },
  {
    id: 3,
    name: "Gulskogen Skole - Auditorium",
    address: "Vintergata 8, 3048 Drammen", 
    lat: 59.7512,
    lng: 10.1689
  },
  {
    id: 4,
    name: "Marienlyst Stadion - Møtesal",
    address: "Schwartz gate 2, 3043 Drammen",
    lat: 59.7389,
    lng: 10.2167
  },
  {
    id: 5,
    name: "Drammensbadet - Svømmehall",
    address: "Danvikgata 40, 3045 Drammen",
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
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);
  const [mapboxToken, setMapboxToken] = useState<string>('');
  const [showTokenInput, setShowTokenInput] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  // Filter facilities based on selected filters
  const filteredFacilities = facilityLocations.filter(facility => {
    const matchesType = !facilityType || facilityType === "";
    const matchesLocation = !location || location === "" || facility.address.toLowerCase().includes(location.toLowerCase());
    return matchesType && matchesLocation;
  });

  const clearMarkers = () => {
    markers.current.forEach(marker => marker.remove());
    markers.current = [];
  };

  const addMarkers = () => {
    if (!map.current) return;

    clearMarkers();

    filteredFacilities.forEach(facility => {
      // Create custom marker element
      const markerEl = document.createElement('div');
      markerEl.className = 'facility-marker';
      markerEl.style.cssText = `
        width: 30px;
        height: 30px;
        background-color: #ef4444;
        border: 2px solid white;
        border-radius: 50%;
        cursor: pointer;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
      `;
      
      // Add icon to marker
      const icon = document.createElement('div');
      icon.innerHTML = '📍';
      icon.style.fontSize = '12px';
      markerEl.appendChild(icon);

      // Create popup
      const popup = new mapboxgl.Popup({ 
        offset: 25,
        closeButton: true,
        closeOnClick: false
      }).setHTML(`
        <div style="padding: 8px; min-width: 200px;">
          <h3 style="margin: 0 0 4px 0; font-weight: bold; font-size: 14px;">${facility.name}</h3>
          <p style="margin: 0; font-size: 12px; color: #666;">${facility.address}</p>
        </div>
      `);

      // Add marker to map
      const marker = new mapboxgl.Marker(markerEl)
        .setLngLat([facility.lng, facility.lat])
        .setPopup(popup)
        .addTo(map.current!);

      markers.current.push(marker);
    });
  };

  const initializeMap = async (token: string) => {
    console.log('Starting map initialization...');
    
    // Wait for next tick to ensure DOM is ready
    await new Promise(resolve => setTimeout(resolve, 100));
    
    if (!mapContainer.current) {
      console.error('Map container ref is not available');
      setError('Map container not ready. Please try again.');
      setIsLoading(false);
      return;
    }

    if (!token.trim() || !token.startsWith('pk.')) {
      setError('Invalid Mapbox token. Token should start with "pk."');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      console.log('Setting Mapbox access token...');
      
      // Set the access token
      mapboxgl.accessToken = token;
      
      // Clear any existing map
      if (map.current) {
        console.log('Removing existing map...');
        map.current.remove();
        map.current = null;
      }

      console.log('Creating new map instance...');
      
      // Create new map with error handling
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [10.2045, 59.7464], // Center on Drammen
        zoom: 12,
        attributionControl: true
      });

      // Add navigation controls
      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

      // Handle successful map load
      map.current.on('load', () => {
        console.log('Map loaded successfully');
        setIsInitialized(true);
        addMarkers();
        setIsLoading(false);
      });

      // Handle map errors with more specific error messages
      map.current.on('error', (e) => {
        console.error('Map error:', e);
        setIsInitialized(false);
        if (e.error?.message?.includes('401')) {
          setError('Invalid Mapbox token. Please check your token and try again.');
        } else if (e.error?.message?.includes('network')) {
          setError('Network error. Please check your internet connection.');
        } else {
          setError(`Failed to load map: ${e.error?.message || 'Unknown error'}`);
        }
        setIsLoading(false);
      });

    } catch (err) {
      console.error('Map initialization error:', err);
      setError('Failed to initialize map. Please check your Mapbox token and try again.');
      setIsLoading(false);
      setIsInitialized(false);
    }
  };

  const handleTokenSubmit = () => {
    const trimmedToken = mapboxToken.trim();
    if (!trimmedToken) {
      setError('Please enter a Mapbox token');
      return;
    }
    
    if (!trimmedToken.startsWith('pk.')) {
      setError('Invalid token format. Mapbox public tokens start with "pk."');
      return;
    }

    console.log('Token submitted, initializing map...');
    setShowTokenInput(false);
    setIsInitialized(false);
    
    // Small delay to ensure UI state updates
    setTimeout(() => {
      initializeMap(trimmedToken);
    }, 50);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleTokenSubmit();
    }
  };

  // Re-add markers when filters change (only if map is initialized)
  useEffect(() => {
    if (map.current && isInitialized && !showTokenInput && !isLoading) {
      console.log('Updating markers based on filter changes...');
      addMarkers();
    }
  }, [filteredFacilities, isInitialized]);

  useEffect(() => {
    return () => {
      console.log('Cleaning up map component...');
      clearMarkers();
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  return (
    <div className="relative w-full">
      <div className="mt-4">
        <Card className="min-h-[600px] relative overflow-hidden">
          {showTokenInput ? (
            <div className="h-[600px] w-full flex items-center justify-center bg-gray-50">
              <div className="text-center space-y-4 p-6 max-w-md">
                <h3 className="text-lg font-semibold">Mapbox Token Required</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Enter your Mapbox public token to view the interactive map of Drammen Kommune facilities
                </p>
                <div className="space-y-3">
                  <Input
                    type="text"
                    placeholder="pk.eyJ1IjoieW91cnVzZXJuYW1lIiwiYSI6InlvdXJ0b2tlbiJ9..."
                    value={mapboxToken}
                    onChange={(e) => setMapboxToken(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="w-full"
                  />
                  <Button 
                    onClick={handleTokenSubmit} 
                    disabled={!mapboxToken.trim() || isLoading}
                    className="w-full"
                  >
                    {isLoading ? 'Loading Map...' : 'Load Map'}
                  </Button>
                </div>
                {error && (
                  <p className="text-sm text-red-600 mt-2 p-2 bg-red-50 rounded">{error}</p>
                )}
                <p className="text-xs text-gray-500">
                  Get your token from{' '}
                  <a href="https://account.mapbox.com/access-tokens/" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                    account.mapbox.com/access-tokens
                  </a>
                </p>
              </div>
            </div>
          ) : (
            <>
              {isLoading && (
                <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                    <p className="text-sm text-gray-600">Loading map...</p>
                  </div>
                </div>
              )}
              
              {error && !isLoading && (
                <div className="absolute inset-0 bg-red-50 flex items-center justify-center z-10">
                  <div className="text-center p-6">
                    <p className="text-red-600 mb-4">{error}</p>
                    <Button 
                      onClick={() => {
                        setShowTokenInput(true);
                        setError('');
                        setIsInitialized(false);
                      }}
                      variant="outline"
                    >
                      Try Again
                    </Button>
                  </div>
                </div>
              )}
              
              <div ref={mapContainer} className="h-[600px] w-full" />
              
              {/* Info overlay */}
              {!error && !isLoading && (
                <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm border border-gray-200 rounded-lg p-3 shadow-md max-w-xs">
                  <p className="text-sm font-medium mb-2">Drammen Kommune Facilities</p>
                  <p className="text-xs text-gray-600 mb-2">Showing {filteredFacilities.length} facilities</p>
                  <div className="space-y-1 max-h-32 overflow-y-auto">
                    {filteredFacilities.map(facility => (
                      <div key={facility.id} className="text-xs flex items-start gap-1.5">
                        <MapPin className="h-3 w-3 mt-0.5 text-red-500 flex-shrink-0" />
                        <span className="line-clamp-2">{facility.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Reset button */}
              {!error && !isLoading && (
                <div className="absolute bottom-4 right-4">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setShowTokenInput(true);
                      setMapboxToken('');
                      setError('');
                      if (map.current) {
                        map.current.remove();
                        map.current = null;
                      }
                    }}
                  >
                    Change Token
                  </Button>
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
