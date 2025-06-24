
import React from 'react';
import { Button } from '../ui/button';

interface MapErrorStateProps {
  error: string;
  isLoading: boolean;
  onRetry: () => void;
}

export const MapErrorState: React.FC<MapErrorStateProps> = ({ error, isLoading, onRetry }) => {
  if (!error || isLoading) return null;

  return (
    <div className="absolute inset-0 bg-red-50 flex items-center justify-center z-10">
      <div className="text-center p-6">
        <p className="text-red-600 mb-4 text-base">{error}</p>
        <Button 
          onClick={onRetry}
          variant="outline"
          className="text-base px-6 py-3"
        >
          Try Again
        </Button>
      </div>
    </div>
  );
};
