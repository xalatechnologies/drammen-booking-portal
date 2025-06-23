
import React, { useState, useEffect, useMemo } from 'react';
import { Card } from './ui/card';
import { MapContainer } from './map/MapContainer';
import { MapMarkers } from './map/MapMarkers';
import { MapInfoOverlay } from './map/MapInfoOverlay';
import { MapLoadingState } from './map/MapLoadingState';
import { MapErrorState } from './map/MapErrorState';
import { Facility, FacilityFilters } from '@/types/facility';
import ViewHeader from './search/ViewHeader';
import mapboxgl from 'mapbox-gl';
import { getFilteredMockFacilities } from '@/mocks/facilityMockData';

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

  // Create filters from props
  const filters: FacilityFilters = {
    facilityType: facilityType !== "all" ? facilityType : undefined,
    location: location !== "all" ? location : undefined,
  };

  // Get facilities from mock data
  const [facilitiesLoading, setFacilitiesLoading] = useState(true);
  const [facilitiesError, setFacilitiesError] = useState<string>('');
  
  // Get filtered facilities from mock data
  const facilitiesArray = useMemo(() => {
    const mockFilters = {
      facilityType: facilityType !== "all" ? facilityType : undefined,
      location: location !== "all" ? location : undefined
    };
    return getFilteredMockFacilities(mockFilters);
  }, [facilityType, location]);
  
  // Simulate loading delay
  useEffect(() => {
    setFacilitiesLoading(true);
    const timer = setTimeout(() => {
      setFacilitiesLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, [facilityType, location]);

  // Convert facilities to map format with enhanced data
  const facilityLocations = facilitiesArray.map(facility => ({
    id: facility.id,
    name: facility.name,
    address: facility.address,
    lat: 59.7440 + (Math.random() - 0.5) * 0.02, // Spread around Drammen
    lng: 10.2052 + (Math.random() - 0.5) * 0.02,
    image: facility.image,
    type: facility.type,
    capacity: facility.capacity,
    nextAvailable: facility.nextAvailable || facility.next_available || "Not available"
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
        facilityCount={facilitiesArray.length}
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
