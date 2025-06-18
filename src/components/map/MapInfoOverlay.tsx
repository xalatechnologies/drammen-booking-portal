
import React from 'react';
import { MapPin } from 'lucide-react';
import { FacilityLocation } from './MapMarkers';

interface MapInfoOverlayProps {
  facilities: FacilityLocation[];
}

export const MapInfoOverlay: React.FC<MapInfoOverlayProps> = ({ facilities }) => {
  // Color palette for facility markers (same as in MapMarkers)
  const markerColors = [
    '#ef4444', // red
    '#3b82f6', // blue
    '#10b981', // emerald
    '#f59e0b', // amber
    '#8b5cf6', // violet
    '#ec4899', // pink
    '#06b6d4', // cyan
  ];

  return (
    <div className="absolute top-6 right-6 bg-white/95 backdrop-blur-md border border-gray-200 rounded-xl p-6 shadow-xl max-w-sm">
      <div className="flex items-center gap-3 mb-4">
        <div className="h-10 w-10 bg-blue-100 rounded-xl flex items-center justify-center">
          <MapPin className="h-5 w-5 text-blue-600" />
        </div>
        <div>
          <h3 className="font-bold text-gray-900 text-lg">Drammen Kommune</h3>
          <p className="text-sm text-gray-600">Kommunale lokaler</p>
        </div>
      </div>
      
      <div className="mb-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-base font-semibold text-gray-700">Viser lokaler</span>
          <span className="bg-blue-100 text-blue-800 text-base font-bold px-3 py-2 rounded-full">
            {facilities.length}
          </span>
        </div>
      </div>
      
      <div className="space-y-2 max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        {facilities.slice(0, 4).map((facility, index) => {
          const markerColor = markerColors[index % markerColors.length];
          return (
            <div key={facility.id} className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
              <div 
                className="h-4 w-4 mt-1 rounded-full flex-shrink-0 border-2 border-white shadow-md"
                style={{ backgroundColor: markerColor }}
              />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-gray-900 truncate">{facility.name}</p>
                <p className="text-xs text-gray-600 truncate">{facility.address.split(',')[0]}</p>
              </div>
            </div>
          );
        })}
        {facilities.length > 4 && (
          <p className="text-sm text-gray-500 text-center pt-2 font-medium">
            +{facilities.length - 4} flere lokaler
          </p>
        )}
      </div>
    </div>
  );
};
