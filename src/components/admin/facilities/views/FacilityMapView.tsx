
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { MapContainer } from "@/components/map/MapContainer";
import { MapMarkers } from "@/components/map/MapMarkers";
import { MapLoadingState } from "@/components/map/MapLoadingState";
import { MapErrorState } from "@/components/map/MapErrorState";
import { MapLegend } from "@/components/map/MapLegend";
import mapboxgl from 'mapbox-gl';

// Default token for map functionality
const DEFAULT_MAPBOX_TOKEN = 'pk.eyJ1IjoieGFsYXRlY2hub2xvZ2llc2FzIiwiYSI6ImNtYmh0anh6NTAweDEycXF6cm9xbDFtb2IifQ.81xizRmOh6TLUEsG0EVSEg';

interface FacilityMapViewProps {
  facilities: any[];
  isLoading: boolean;
}

export const FacilityMapView: React.FC<FacilityMapViewProps> = ({
  facilities,
  isLoading
}) => {
  const [map, setMap] = useState<mapboxgl.Map | null>(null);
  const [isMapLoading, setIsMapLoading] = useState<boolean>(false);
  const [mapError, setMapError] = useState<string>('');

  // Convert facilities to map format
  const facilityLocations = facilities.map(facility => ({
    id: facility.id,
    name: facility.name,
    address: `${facility.address_street}, ${facility.address_city}`,
    lat: facility.latitude || (59.7440 + (Math.random() - 0.5) * 0.02), // Use actual coordinates or spread around Drammen
    lng: facility.longitude || (10.2052 + (Math.random() - 0.5) * 0.02),
    image: facility.image_url,
    type: facility.type,
    capacity: facility.capacity,
    nextAvailable: facility.next_available || "Available now"
  }));

  const handleMapLoad = (mapInstance: mapboxgl.Map) => {
    setMap(mapInstance);
  };

  const handleMapError = (errorMessage: string) => {
    setMapError(errorMessage);
  };

  const handleMapRetry = () => {
    setMapError('');
    window.location.reload();
  };

  return (
    <Card className="min-h-[600px] relative overflow-hidden">
      <MapLoadingState isLoading={isMapLoading || isLoading} />
      
      <MapErrorState 
        error={mapError} 
        isLoading={isMapLoading || isLoading} 
        onRetry={handleMapRetry} 
      />
      
      <MapContainer
        onMapLoad={handleMapLoad}
        onMapError={handleMapError}
        onLoadingChange={setIsMapLoading}
        mapboxToken={DEFAULT_MAPBOX_TOKEN}
      />
      
      <MapMarkers map={map} facilities={facilityLocations} />
      
      {/* Add legend when map is loaded and not in error state */}
      {map && !mapError && !isMapLoading && !isLoading && (
        <MapLegend facilities={facilityLocations} />
      )}
    </Card>
  );
};
