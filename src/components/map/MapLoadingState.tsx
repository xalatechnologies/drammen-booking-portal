
import React from 'react';

interface MapLoadingStateProps {
  isLoading: boolean;
}

export const MapLoadingState: React.FC<MapLoadingStateProps> = ({ isLoading }) => {
  if (!isLoading) return null;

  return (
    <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
        <p className="text-base text-gray-600">Loading map...</p>
      </div>
    </div>
  );
};
