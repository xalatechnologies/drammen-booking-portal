
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FacilityLocation } from './MapMarkers';

interface MapLegendProps {
  facilities: FacilityLocation[];
}

export const MapLegend: React.FC<MapLegendProps> = ({ facilities }) => {
  return (
    <Card className="absolute top-4 left-4 w-80 max-h-[calc(100vh-120px)] overflow-y-auto z-10 bg-white/95 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold">Facilities</CardTitle>
        <p className="text-sm text-gray-600">{facilities.length} facilities shown</p>
      </CardHeader>
      <CardContent className="space-y-3">
        {facilities.map((facility, index) => {
          // Use the same color palette as markers
          const markerColors = [
            '#ef4444', '#3b82f6', '#10b981', '#f59e0b', 
            '#8b5cf6', '#ec4899', '#06b6d4'
          ];
          const markerColor = markerColors[index % markerColors.length];
          
          return (
            <div key={facility.id} className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
              {/* Color indicator matching map marker */}
              <div 
                className="w-4 h-4 rounded-full border-2 border-white shadow-sm mt-1 flex-shrink-0"
                style={{ backgroundColor: markerColor }}
              />
              
              {/* Facility image */}
              <div className="w-12 h-12 rounded-md overflow-hidden flex-shrink-0">
                <img 
                  src={facility.image || 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&auto=format&fit=crop'} 
                  alt={facility.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Facility details */}
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-gray-900 truncate">
                  {facility.name}
                </h4>
                <p className="text-xs text-gray-500 truncate">
                  {facility.address}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className="text-xs">
                    {facility.type}
                  </Badge>
                  <span className="text-xs text-gray-500">
                    {facility.capacity} people
                  </span>
                </div>
                <p className="text-xs text-green-600 mt-1">
                  {facility.nextAvailable}
                </p>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};
