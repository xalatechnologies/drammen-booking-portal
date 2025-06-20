
import React, { useState } from 'react';
import { Card } from './ui/card';
import { MapContainer } from './map/MapContainer';
import { MapMarkers } from './map/MapMarkers';
import { MapInfoOverlay } from './map/MapInfoOverlay';
import { MapLoadingState } from './map/MapLoadingState';
import { MapErrorState } from './map/MapErrorState';
import { useFacilities } from '@/hooks/useFacilities';
import { FacilityFilters } from '@/types/facility';
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

  // Create filters from props
  const filters: FacilityFilters = {
    facilityType: facilityType !== "all" ? facilityType : undefined,
    location: location !== "all" ? location : undefined,
  };

  // Use the centralized facilities service
  const { facilities, isLoading: facilitiesLoading, error: facilitiesError } = useFacilities({
    pagination: { page: 1, limit: 100 }, // Get all facilities for map
    filters
  });

  // Convert facilities to map format
  const facilityLocations = facilities.map(facility => ({
    id: facility.id,
    name: facility.name,
    address: facility.address,
    lat: 59.7440 + (Math.random() - 0.5) * 0.02, // Spread around Drammen
    lng: 10.2052 + (Math.random() - 0.5) * 0.02
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
    <div className="max-w-7xl mx-auto px-4">
      {/* Map Content */}
      <Card className="min-h-[600px] relative overflow-hidden">
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
