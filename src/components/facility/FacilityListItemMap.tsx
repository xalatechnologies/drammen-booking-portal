
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
      style: "mapbox://styles/mapbox/streets-v11",
      center: coordinates,
      zoom: 13,
      interactive: false // Disable interactions in the small map
    });

    // Add marker for the facility location
    new mapboxgl.Marker({ color: "#0B3D91" })
      .setLngLat(coordinates)
      .addTo(map.current);

    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, [address, facilityName]);

  return (
    <div className="w-32 h-24 rounded-lg overflow-hidden border border-gray-200 bg-gray-100 flex-shrink-0">
      <div ref={mapContainer} className="w-full h-full" />
    </div>
  );
}
