
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

    // Add custom marker with better styling
    const markerElement = document.createElement('div');
    markerElement.className = 'custom-marker';
    markerElement.style.cssText = `
      width: 32px;
      height: 32px;
      background: linear-gradient(135deg, #3B82F6, #1D4ED8);
      border: 3px solid white;
      border-radius: 50%;
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
    `;

    // Add pulse animation
    const pulseElement = document.createElement('div');
    pulseElement.className = 'map-pulse';
    pulseElement.style.cssText = `
      position: absolute;
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background: rgba(59, 130, 246, 0.3);
      animation: map-pulse 2s infinite;
    `;
    markerElement.appendChild(pulseElement);

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
    <>
      <style>
        {`
          @keyframes map-pulse {
            0% {
              transform: scale(1);
              opacity: 0.7;
            }
            50% {
              transform: scale(1.3);
              opacity: 0.3;
            }
            100% {
              transform: scale(1.6);
              opacity: 0;
            }
          }
        `}
      </style>
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
    </>
  );
}
