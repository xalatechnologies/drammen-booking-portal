
import React, { useState } from 'react';
import { Card } from './ui/card';
import { MapContainer } from './map/MapContainer';
import { MapMarkers } from './map/MapMarkers';
import { MapInfoOverlay } from './map/MapInfoOverlay';
import { MapLoadingState } from './map/MapLoadingState';
import { MapErrorState } from './map/MapErrorState';
import { useFacilities } from '@/hooks/useFacilities';
import ViewHeader from './search/ViewHeader';
import mapboxgl from 'mapbox-gl';

// Default token provided by user
const DEFAULT_MAPBOX_TOKEN = 'pk.eyJ1IjoieGFsYXRlY2hub2xvZ2llc2FzIiwiYSI6ImNtYmh0anh6NTAweDEycXF6cm9xbDFtb2IifQ.81xizRmOh6TLUEsG0EVSEg';

interface MapViewProps {
  facilityType: string;
  location: string;
  viewMode: "grid" | "map" | "calendar" | "list";
  setViewMode: (mode: "grid" | "map" | "calendar" | "list") => void;
}

const MapView: React.FC<MapViewProps> = ({ facilityType, location, viewMode, setViewMode }) => {
  const [map, setMap] = useState<mapboxgl.Map | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  // Use the centralized facilities service
  const { data: facilities, isLoading: facilitiesLoading, error: facilitiesError } = useFacilities();

  // Ensure facilities is always an array
  const facilitiesArray = Array.isArray(facilities) ? facilities : (facilities ? [facilities] : []);

  // Apply client-side filtering
  const filteredFacilities = facilitiesArray.filter(facility => {
    if (facilityType !== "all" && facility.type !== facilityType) return false;
    if (location !== "all" && !facility.area.includes(location)) return false;
    return true;
  });

  // Convert facilities to map format with enhanced data
  const facilityLocations = filteredFacilities.map(facility => ({
    id: facility.id,
    name: facility.name,
    address: facility.address_street || facility.area,
    lat: 59.7440 + (Math.random() - 0.5) * 0.02, // Spread around Drammen
    lng: 10.2052 + (Math.random() - 0.5) * 0.02,
    image: facility.facility_images?.[0]?.image_url || '',
    type: facility.type,
    capacity: facility.capacity,
    nextAvailable: "Available now"
  }));

  const handleMapLoad = (mapInstance: mapboxgl.Map) => {
    setMap(mapInstance);
    setIsInitialized(true);
  };

  const handleMapError = (errorMessage: string) => {
    setError(errorMessage);
    setIsInitialized(false);
  };

  const handleRetry = () => {
    setError('');
    setIsInitialized(false);
    window.location.reload();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 my-[12px]">
      {/* Reusable Header with consistent positioning */}
      <ViewHeader 
        facilityCount={filteredFacilities.length}
        isLoading={facilitiesLoading}
        viewMode={viewMode}
        setViewMode={setViewMode}
      />

      {/* Map Content - Made much taller */}
      <Card className="min-h-[900px] relative overflow-hidden">
        <MapLoadingState isLoading={isLoading || facilitiesLoading} />
        
        <MapErrorState 
          error={error || (facilitiesError ? 'Failed to load facilities' : '')} 
          isLoading={isLoading || facilitiesLoading} 
          onRetry={handleRetry} 
        />
        
        <MapContainer
          onMapLoad={handleMapLoad}
          onMapError={handleMapError}
          onLoadingChange={setIsLoading}
          mapboxToken={DEFAULT_MAPBOX_TOKEN}
        />
        
        <MapMarkers map={map} facilities={facilityLocations} />
        
        {!error && !isLoading && !facilitiesLoading && (
          <MapInfoOverlay facilities={facilityLocations} />
        )}
      </Card>
    </div>
  );
};

export default MapView;
