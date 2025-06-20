
import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';

export interface FacilityLocation {
  id: number;
  name: string;
  address: string;
  lat: number;
  lng: number;
  image?: string;
  type?: string;
  capacity?: number;
  nextAvailable?: string;
}

interface MapMarkersProps {
  map: mapboxgl.Map | null;
  facilities: FacilityLocation[];
}

export const MapMarkers: React.FC<MapMarkersProps> = ({ map, facilities }) => {
  const markers = useRef<mapboxgl.Marker[]>([]);
  const currentPopup = useRef<mapboxgl.Popup | null>(null);

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
    if (currentPopup.current) {
      currentPopup.current.remove();
      currentPopup.current = null;
    }
  };

  const closeCurrentPopup = () => {
    if (currentPopup.current) {
      currentPopup.current.remove();
      currentPopup.current = null;
    }
  };

  const addMarkers = () => {
    if (!map) return;

    clearMarkers();

    facilities.forEach((facility, index) => {
      // Get color for this facility (cycle through colors if more facilities than colors)
      const markerColor = markerColors[index % markerColors.length];
      
      // Create simple marker element
      const markerEl = document.createElement('div');
      markerEl.className = 'facility-marker';
      markerEl.style.cssText = `
        width: 32px;
        height: 32px;
        background-color: ${markerColor};
        border: 3px solid white;
        border-radius: 50%;
        cursor: pointer;
        box-shadow: 0 3px 8px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        z-index: 1;
      `;
      
      // Add icon to marker
      const icon = document.createElement('div');
      icon.innerHTML = '🏢';
      icon.style.fontSize = '14px';
      icon.style.pointerEvents = 'none';
      markerEl.appendChild(icon);

      // Create popup with facility info
      const popupHTML = `
        <div class="facility-popup-card" style="
          width: 280px;
          padding: 0;
          margin: 0;
          border-radius: 8px;
          overflow: hidden;
          cursor: pointer;
        ">
          <div style="
            width: 100%;
            height: 120px;
            background-image: url('${facility.image || 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&auto=format&fit=crop'}');
            background-size: cover;
            background-position: center;
          "></div>
          <div style="padding: 12px;">
            <h3 style="
              margin: 0 0 8px 0;
              font-weight: 600;
              font-size: 16px;
              color: #111827;
            ">${facility.name}</h3>
            <p style="
              margin: 0 0 8px 0;
              font-size: 14px;
              color: #6b7280;
            ">${facility.address}</p>
            <div style="
              display: flex;
              justify-content: space-between;
              align-items: center;
              font-size: 12px;
            ">
              <span style="
                background: #f3f4f6;
                color: #374151;
                padding: 4px 8px;
                border-radius: 4px;
              ">${facility.capacity || 30} plasser</span>
              <span style="color: #059669;">${facility.nextAvailable || 'Ledig nå'}</span>
            </div>
          </div>
        </div>
      `;

      const popup = new mapboxgl.Popup({ 
        offset: 25,
        closeButton: true,
        closeOnClick: false
      }).setHTML(popupHTML);

      // Add marker to map
      const marker = new mapboxgl.Marker(markerEl)
        .setLngLat([facility.lng, facility.lat])
        .addTo(map);

      // Handle marker click to show popup (only one at a time)
      markerEl.addEventListener('click', (e) => {
        e.stopPropagation();
        closeCurrentPopup(); // Close any existing popup
        marker.setPopup(popup);
        popup.addTo(map);
        currentPopup.current = popup;
      });

      // Handle popup content click to navigate to facility
      popup.on('open', () => {
        const popupContent = document.querySelector('.facility-popup-card');
        if (popupContent) {
          popupContent.addEventListener('click', () => {
            window.location.href = `/facilities/${facility.id}`;
          });
        }
      });

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
