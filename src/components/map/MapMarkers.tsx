
import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';

export interface FacilityLocation {
  id: number;
  name: string;
  address: string;
  lat: number;
  lng: number;
}

interface MapMarkersProps {
  map: mapboxgl.Map | null;
  facilities: FacilityLocation[];
}

export const MapMarkers: React.FC<MapMarkersProps> = ({ map, facilities }) => {
  const markers = useRef<mapboxgl.Marker[]>([]);

  // Color palette for facility markers
  const markerColors = [
    '#ef4444', // red
    '#3b82f6', // blue
    '#10b981', // emerald
    '#f59e0b', // amber
    '#8b5cf6', // violet
    '#ec4899', // pink
    '#06b6d4', // cyan
  ];

  const clearMarkers = () => {
    markers.current.forEach(marker => marker.remove());
    markers.current = [];
  };

  const addMarkers = () => {
    if (!map) return;

    clearMarkers();

    facilities.forEach((facility, index) => {
      // Get color for this facility (cycle through colors if more facilities than colors)
      const markerColor = markerColors[index % markerColors.length];
      
      // Create custom marker element
      const markerEl = document.createElement('div');
      markerEl.className = 'facility-marker';
      markerEl.style.cssText = `
        width: 30px;
        height: 30px;
        background-color: ${markerColor};
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
      markerEl.appendChild(icon);

      // Create popup
      const popup = new mapboxgl.Popup({ 
        offset: 25,
        closeButton: true,
        closeOnClick: false
      }).setHTML(`
        <div style="padding: 8px; min-width: 200px;">
          <h3 style="margin: 0 0 4px 0; font-weight: bold; font-size: 14px;">${facility.name}</h3>
          <p style="margin: 0; font-size: 12px; color: #666;">${facility.address}</p>
        </div>
      `);

      // Add marker to map
      const marker = new mapboxgl.Marker(markerEl)
        .setLngLat([facility.lng, facility.lat])
        .setPopup(popup)
        .addTo(map);

      markers.current.push(marker);
    });
  };

  useEffect(() => {
    if (map) {
      console.log('Updating markers based on filter changes...');
      addMarkers();
    }
  }, [facilities, map]);

  useEffect(() => {
    return () => {
      clearMarkers();
    };
  }, []);

  return null;
};
