
import React, { useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

interface MapContainerProps {
  onMapLoad: (map: mapboxgl.Map) => void;
  onMapError: (error: string) => void;
  onLoadingChange: (loading: boolean) => void;
  mapboxToken: string;
}

export const MapContainer: React.FC<MapContainerProps> = ({
  onMapLoad,
  onMapError,
  onLoadingChange,
  mapboxToken
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  const initializeMap = async () => {
    console.log('Starting map initialization with default token...');
    
    // Wait for next tick to ensure DOM is ready
    await new Promise(resolve => setTimeout(resolve, 100));
    
    if (!mapContainer.current) {
      console.error('Map container ref is not available');
      onMapError('Map container not ready. Please try again.');
      onLoadingChange(false);
      return;
    }

    onLoadingChange(true);
    onMapError('');

    try {
      console.log('Setting Mapbox access token...');
      
      // Set the access token
      mapboxgl.accessToken = mapboxToken;
      
      // Clear any existing map
      if (map.current) {
        console.log('Removing existing map...');
        map.current.remove();
        map.current = null;
      }

      console.log('Creating new map instance...');
      
      // Create new map with error handling
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [10.2045, 59.7464], // Center on Drammen
        zoom: 12,
        attributionControl: true
      });

      // Add navigation controls
      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

      // Handle successful map load
      map.current.on('load', () => {
        console.log('Map loaded successfully');
        onMapLoad(map.current!);
        onLoadingChange(false);
      });

      // Handle map errors with more specific error messages
      map.current.on('error', (e) => {
        console.error('Map error:', e);
        if (e.error?.message?.includes('401')) {
          onMapError('Invalid Mapbox token. Please check your token and try again.');
        } else if (e.error?.message?.includes('network')) {
          onMapError('Network error. Please check your internet connection.');
        } else {
          onMapError(`Failed to load map: ${e.error?.message || 'Unknown error'}`);
        }
        onLoadingChange(false);
      });

    } catch (err) {
      console.error('Map initialization error:', err);
      onMapError('Failed to initialize map. Please check your Mapbox token and try again.');
      onLoadingChange(false);
    }
  };

  useEffect(() => {
    initializeMap();
    
    return () => {
      console.log('Cleaning up map component...');
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  return <div ref={mapContainer} className="h-[600px] w-full" />;
};
