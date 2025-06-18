
import React, { useState } from 'react';
import { Card } from './ui/card';
import { MapContainer } from './map/MapContainer';
import { MapMarkers } from './map/MapMarkers';
import { MapInfoOverlay } from './map/MapInfoOverlay';
import { MapLoadingState } from './map/MapLoadingState';
import { MapErrorState } from './map/MapErrorState';
import { facilityLocations } from './map/facilityData';
import mapboxgl from 'mapbox-gl';

// Default token provided by user
const DEFAULT_MAPBOX_TOKEN = 'pk.eyJ1IjoieGFsYXRlY2hub2xvZ2llc2FzIiwiYSI6ImNtYmh0anh6NTAweDEycXF6cm9xbDFtb2IifQ.81xizRmOh6TLUEsG0EVSEg';

interface MapViewProps {
  facilityType: string;
  location: string;
}

const MapView: React.FC<MapViewProps> = ({ facilityType, location }) => {
  const [map, setMap] = useState<mapboxgl.Map | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  // Filter facilities based on selected filters
  const filteredFacilities = facilityLocations.filter(facility => {
    const matchesType = !facilityType || facilityType === "";
    const matchesLocation = !location || location === "" || facility.address.toLowerCase().includes(location.toLowerCase());
    return matchesType && matchesLocation;
  });

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
    <div className="relative w-full">
      <div className="mt-4">
        <Card className="min-h-[600px] relative overflow-hidden">
          <MapLoadingState isLoading={isLoading} />
          
          <MapErrorState 
            error={error} 
            isLoading={isLoading} 
            onRetry={handleRetry} 
          />
          
          <MapContainer
            onMapLoad={handleMapLoad}
            onMapError={handleMapError}
            onLoadingChange={setIsLoading}
            mapboxToken={DEFAULT_MAPBOX_TOKEN}
          />
          
          <MapMarkers map={map} facilities={filteredFacilities} />
          
          {!error && !isLoading && (
            <MapInfoOverlay facilities={filteredFacilities} />
          )}
        </Card>
      </div>
    </div>
  );
};

export default MapView;
