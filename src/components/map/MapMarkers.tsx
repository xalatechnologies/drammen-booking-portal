
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
        transition: transform 0.2s ease;
      `;
      
      // Add hover effect
      markerEl.addEventListener('mouseenter', () => {
        markerEl.style.transform = 'scale(1.1)';
      });
      markerEl.addEventListener('mouseleave', () => {
        markerEl.style.transform = 'scale(1)';
      });
      
      // Add icon to marker
      const icon = document.createElement('div');
      icon.innerHTML = '🏢';
      icon.style.fontSize = '14px';
      markerEl.appendChild(icon);

      // Create enhanced popup with facility card
      const popupHTML = `
        <div class="facility-popup-card" style="
          width: 280px;
          padding: 0;
          margin: 0;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0,0,0,0.15);
          cursor: pointer;
          transition: transform 0.2s ease;
        " onclick="window.location.href='/facilities/${facility.id}'">
          <div style="
            width: 100%;
            height: 160px;
            background-image: url('${facility.image || 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&auto=format&fit=crop'}');
            background-size: cover;
            background-position: center;
            position: relative;
          ">
            <div style="
              position: absolute;
              top: 8px;
              right: 8px;
              background: rgba(255,255,255,0.9);
              padding: 4px 8px;
              border-radius: 6px;
              font-size: 12px;
              font-weight: 600;
              color: #374151;
            ">
              ${facility.capacity || 30} plasser
            </div>
          </div>
          <div style="padding: 16px;">
            <h3 style="
              margin: 0 0 8px 0;
              font-weight: 700;
              font-size: 16px;
              color: #111827;
              line-height: 1.3;
            ">${facility.name}</h3>
            <p style="
              margin: 0 0 12px 0;
              font-size: 14px;
              color: #6b7280;
              line-height: 1.4;
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
                border-radius: 6px;
                font-weight: 500;
              ">${facility.type || 'Møterom'}</span>
              <span style="
                color: #059669;
                font-weight: 600;
              ">${facility.nextAvailable || 'Ledig nå'}</span>
            </div>
            <div style="
              margin-top: 12px;
              padding-top: 12px;
              border-top: 1px solid #e5e7eb;
              text-align: center;
              color: #3b82f6;
              font-weight: 600;
              font-size: 13px;
            ">
              Klikk for detaljer →
            </div>
          </div>
        </div>
      `;

      const popup = new mapboxgl.Popup({ 
        offset: 30,
        closeButton: true,
        closeOnClick: false,
        className: 'facility-popup'
      }).setHTML(popupHTML);

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
