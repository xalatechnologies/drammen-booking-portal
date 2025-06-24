
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FacilityLocation } from './MapMarkers';

interface MapInfoOverlayProps {
  facilities: FacilityLocation[];
}

export const MapInfoOverlay: React.FC<MapInfoOverlayProps> = ({ facilities }) => {
  const navigate = useNavigate();

  const handleFacilityClick = (facilityId: number) => {
    navigate(`/facilities/${facilityId}`);
  };

  return (
    <div className="absolute top-4 left-4 z-10 max-w-sm">
      <Card className="bg-white/95 backdrop-blur-sm shadow-lg border-0">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold text-gray-900">
            Viser lokaler
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-3 max-h-[720px] overflow-y-auto">
            {facilities.map((facility, index) => (
              <div 
                key={facility.id}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors border border-gray-100"
                onClick={() => handleFacilityClick(facility.id)}
              >
                {/* Facility Image */}
                <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                  <img 
                    src={facility.image || 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&auto=format&fit=crop'} 
                    alt={facility.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&auto=format&fit=crop";
                      target.onerror = null;
                    }}
                  />
                </div>
                
                {/* Facility Info */}
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm text-gray-900 truncate">
                    {facility.name}
                  </h4>
                  <p className="text-xs text-gray-600 truncate">
                    {facility.address}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge 
                      variant="secondary" 
                      className="text-xs px-2 py-0.5"
                    >
                      {facility.capacity || 30} plasser
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {facilities.length === 0 && (
            <p className="text-sm text-gray-500 text-center py-4">
              Ingen lokaler funnet
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
