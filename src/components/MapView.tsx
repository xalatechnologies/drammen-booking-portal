import React, { useEffect, useRef, useState } from 'react';
import { Card } from './ui/card';
import { MapPin } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// Default token provided by user
const DEFAULT_MAPBOX_TOKEN = 'pk.eyJ1IjoieGFsYXRlY2hub2xvZ2llc2FzIiwiYSI6ImNtYmh0anh6NTAweDEycXF6cm9xbDFtb2IifQ.81xizRmOh6TLUEsG0EVSEg';

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
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  // Color palette for facility markers
  const markerColors = [
    '#ef4444', // red
    '#3b82f6', // blue
    '#10b981', // emerald
    '#f59e0b', // amber
    '#8b5cf6', // violet
    '#ec4899', // pink
    '#06b6d4', // cyan
  ];

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

    filteredFacilities.forEach((facility, index) => {
      // Get color for this facility (cycle through colors if more facilities than colors)
      const markerColor = markerColors[index % markerColors.length];
      
      // Create custom marker element
      const markerEl = document.createElement('div');
      markerEl.className = 'facility-marker';
      markerEl.style.cssText = `
        width: 30px;
        height: 30px;
        background-color: ${markerColor};
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

  const initializeMap = async () => {
    console.log('Starting map initialization with default token...');
    
    // Wait for next tick to ensure DOM is ready
    await new Promise(resolve => setTimeout(resolve, 100));
    
    if (!mapContainer.current) {
      console.error('Map container ref is not available');
      setError('Map container not ready. Please try again.');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      console.log('Setting Mapbox access token...');
      
      // Set the access token
      mapboxgl.accessToken = DEFAULT_MAPBOX_TOKEN;
      
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

  // Initialize map on component mount
  useEffect(() => {
    initializeMap();
    
    return () => {
      console.log('Cleaning up map component...');
      clearMarkers();
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // Re-add markers when filters change (only if map is initialized)
  useEffect(() => {
    if (map.current && isInitialized && !isLoading) {
      console.log('Updating markers based on filter changes...');
      addMarkers();
    }
  }, [filteredFacilities, isInitialized]);

  return (
    <div className="relative w-full">
      <div className="mt-4">
        <Card className="min-h-[400px] relative overflow-hidden">
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
                    setError('');
                    setIsInitialized(false);
                    initializeMap();
                  }}
                  variant="outline"
                >
                  Try Again
                </Button>
              </div>
            </div>
          )}
          
          <div ref={mapContainer} className="h-[400px] w-full" />
          
          {/* Info overlay - More Compact */}
          {!error && !isLoading && (
            <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md border border-gray-200 rounded-lg p-4 shadow-lg max-w-xs">
              <div className="flex items-center gap-2 mb-3">
                <div className="h-8 w-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <MapPin className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm">Drammen Kommune</h3>
                  <p className="text-xs text-gray-600">Kommunale lokaler</p>
                </div>
              </div>
              
              <div className="mb-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-gray-700">Viser lokaler</span>
                  <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded-full">
                    {filteredFacilities.length}
                  </span>
                </div>
              </div>
              
              <div className="space-y-1 max-h-32 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                {filteredFacilities.slice(0, 3).map((facility, index) => {
                  const markerColor = markerColors[index % markerColors.length];
                  return (
                    <div key={facility.id} className="flex items-start gap-2 p-1 rounded hover:bg-gray-50 transition-colors">
                      <div 
                        className="h-3 w-3 mt-0.5 rounded-full flex-shrink-0 border border-white shadow-sm"
                        style={{ backgroundColor: markerColor }}
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-medium text-gray-900 truncate">{facility.name}</p>
                      </div>
                    </div>
                  );
                })}
                {filteredFacilities.length > 3 && (
                  <p className="text-xs text-gray-500 text-center pt-1">
                    +{filteredFacilities.length - 3} flere
                  </p>
                )}
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default MapView;
