
import React, { useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

interface FacilityListItemMapProps {
  address: string;
  facilityName: string;
}

export function FacilityListItemMap({ address, facilityName }: FacilityListItemMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    // Initialize map with Mapbox token
    mapboxgl.accessToken = "pk.eyJ1IjoieGFsYXRlY2hub2xvZ2llc2FzIiwiYSI6ImNtYmh0anh6NTAweDEycXF6cm9xbDFtb2IifQ.81xizRmOh6TLUEsG0EVSEg";
    
    // Generate coordinates around Drammen area for the facility
    const baseCoordinates: [number, number] = [10.2052, 59.7440];
    const coordinates: [number, number] = [
      baseCoordinates[0] + (Math.random() - 0.5) * 0.02, 
      baseCoordinates[1] + (Math.random() - 0.5) * 0.02
    ];
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: coordinates,
      zoom: 14,
      interactive: false,
      attributionControl: false
    });

    // Create custom colored marker element to match other maps
    const markerElement = document.createElement('div');
    markerElement.className = 'facility-marker';
    markerElement.style.cssText = `
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
    markerElement.appendChild(icon);

    new mapboxgl.Marker(markerElement)
      .setLngLat(coordinates)
      .addTo(map.current);

    // Add subtle animation on load
    map.current.on('load', () => {
      if (map.current) {
        map.current.easeTo({
          center: coordinates,
          zoom: 14,
          duration: 1000
        });
      }
    });

    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, [address, facilityName]);

  return (
    <div className="h-full w-full">
      <div className="w-full h-full bg-gray-100 shadow-md hover:shadow-xl transition-all duration-300 group-hover:border-blue-300 relative">
        <div ref={mapContainer} className="w-full h-full" />
        
        {/* Overlay gradient for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Location label */}
        <div className="absolute bottom-2 left-2 right-2">
          <div className="bg-white/95 backdrop-blur-sm rounded-lg px-3 py-1 shadow-sm opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
            <p className="text-xs font-semibold text-gray-800 truncate">
              📍 {facilityName}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
