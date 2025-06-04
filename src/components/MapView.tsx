
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
  const [mapboxToken, setMapboxToken] = useState<string>('');
  const [showTokenInput, setShowTokenInput] = useState<boolean>(true);

  // Filter facilities based on selected filters
  const filteredFacilities = facilityLocations.filter(facility => {
    const matchesType = !facilityType || facilityType === "";
    const matchesLocation = !location || location === "" || facility.address.toLowerCase().includes(location.toLowerCase());
    return matchesType && matchesLocation;
  });

  const initializeMap = (token: string) => {
    if (!mapContainer.current) return;

    mapboxgl.accessToken = token;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [10.2045, 59.7464], // Center on Drammen
      zoom: 12
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Add markers for filtered facilities
    filteredFacilities.forEach(facility => {
      if (map.current) {
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
        const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
          <div style="padding: 8px;">
            <h3 style="margin: 0 0 4px 0; font-weight: bold; font-size: 14px;">${facility.name}</h3>
            <p style="margin: 0; font-size: 12px; color: #666;">${facility.address}</p>
          </div>
        `);

        // Add marker to map
        new mapboxgl.Marker(markerEl)
          .setLngLat([facility.lng, facility.lat])
          .setPopup(popup)
          .addTo(map.current);
      }
    });
  };

  const handleTokenSubmit = () => {
    if (mapboxToken.trim()) {
      setShowTokenInput(false);
      initializeMap(mapboxToken);
    }
  };

  useEffect(() => {
    return () => {
      map.current?.remove();
    };
  }, []);

  // Re-add markers when filters change
  useEffect(() => {
    if (map.current && !showTokenInput) {
      // Clear existing markers
      const markers = document.querySelectorAll('.facility-marker');
      markers.forEach(marker => marker.remove());

      // Add new markers for filtered facilities
      filteredFacilities.forEach(facility => {
        if (map.current) {
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
          
          const icon = document.createElement('div');
          icon.innerHTML = '📍';
          icon.style.fontSize = '12px';
          markerEl.appendChild(icon);

          const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
            <div style="padding: 8px;">
              <h3 style="margin: 0 0 4px 0; font-weight: bold; font-size: 14px;">${facility.name}</h3>
              <p style="margin: 0; font-size: 12px; color: #666;">${facility.address}</p>
            </div>
          `);

          new mapboxgl.Marker(markerEl)
            .setLngLat([facility.lng, facility.lat])
            .setPopup(popup)
            .addTo(map.current);
        }
      });
    }
  }, [filteredFacilities, showTokenInput]);

  return (
    <div className="relative w-full">
      <div className="mt-4">
        <Card className="min-h-[400px] relative overflow-hidden">
          {showTokenInput ? (
            <div className="h-[400px] w-full flex items-center justify-center bg-gray-50">
              <div className="text-center space-y-4 p-6">
                <h3 className="text-lg font-semibold">Mapbox Token Required</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Enter your Mapbox public token to view the interactive map of Drammen Kommune
                </p>
                <div className="space-y-3">
                  <Input
                    type="text"
                    placeholder="Enter Mapbox public token..."
                    value={mapboxToken}
                    onChange={(e) => setMapboxToken(e.target.value)}
                    className="max-w-md"
                  />
                  <Button onClick={handleTokenSubmit} disabled={!mapboxToken.trim()}>
                    Load Map
                  </Button>
                </div>
                <p className="text-xs text-gray-500">
                  Get your token from{' '}
                  <a href="https://mapbox.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                    mapbox.com
                  </a>
                </p>
              </div>
            </div>
          ) : (
            <>
              <div ref={mapContainer} className="h-[400px] w-full" />
              
              {/* Info overlay */}
              <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm border border-gray-200 rounded-lg p-3 shadow-md max-w-xs">
                <p className="text-sm font-medium mb-2">Drammen Kommune Fasiliteter</p>
                <p className="text-xs text-gray-600 mb-2">Viser {filteredFacilities.length} fasiliteter</p>
                <div className="space-y-1 max-h-32 overflow-y-auto">
                  {filteredFacilities.map(facility => (
                    <div key={facility.id} className="text-xs flex items-start gap-1.5">
                      <MapPin className="h-3 w-3 mt-0.5 text-red-500 flex-shrink-0" />
                      <span className="line-clamp-2">{facility.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </Card>
      </div>
    </div>
  );
};

export default MapView;
