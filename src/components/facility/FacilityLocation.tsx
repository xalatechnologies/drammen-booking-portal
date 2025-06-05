
import React from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

interface FacilityLocationProps {
  address: string;
}

export function FacilityLocation({ address }: FacilityLocationProps) {
  const mapContainer = React.useRef<HTMLDivElement>(null);
  const map = React.useRef<mapboxgl.Map | null>(null);

  React.useEffect(() => {
    if (!mapContainer.current) return;

    // Initialize map with Mapbox token
    mapboxgl.accessToken = "pk.eyJ1IjoieGFsYXRlY2hub2xvZ2llc2FzIiwiYSI6ImNtYmh0anh6NTAweDEycXF6cm9xbDFtb2IifQ.81xizRmOh6TLUEsG0EVSEg";
    
    // Convert address to coordinates (in a real app, use geocoding API)
    // For now we'll use Drammen's coordinates
    const coordinates = [10.2052, 59.7440]; // Approximate coordinates for Drammen
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: coordinates,
      zoom: 14
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), "top-right");

    // Add marker for the facility location
    new mapboxgl.Marker({ color: "#0B3D91" })
      .setLngLat(coordinates)
      .setPopup(new mapboxgl.Popup().setHTML(`<div class="p-2"><strong>${address}</strong><br/>Drammen Kommune</div>`))
      .addTo(map.current);

    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, [address]);

  return (
    <div className="h-full w-full">
      <div ref={mapContainer} className="w-full h-full" />
    </div>
  );
}
