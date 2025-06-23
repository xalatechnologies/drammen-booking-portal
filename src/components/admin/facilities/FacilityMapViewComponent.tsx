import React from 'react';
import { Card } from '@/components/ui/card';
import { Facility } from '@/types/facility';
import { useJsonTranslation } from '@/hooks/useJsonTranslation';
import { MapPin } from 'lucide-react';

interface FacilityMapViewComponentProps {
  facilities: Facility[];
  isLoading: boolean;
}

const FacilityMapViewComponent: React.FC<FacilityMapViewComponentProps> = ({ 
  facilities, 
  isLoading 
}) => {
  const { tSync } = useJsonTranslation();
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">{tSync('admin.common.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-gray-100 rounded-lg p-4 text-center">
        <MapPin className="h-12 w-12 mx-auto text-gray-400 mb-2" />
        <h3 className="text-lg font-medium">{tSync('admin.facilities.map.notImplemented')}</h3>
        <p className="text-gray-500 mt-1">
          {tSync('admin.facilities.map.comingSoon')}
        </p>
        <p className="text-sm text-gray-400 mt-4">
          {facilities.length} {tSync('admin.facilities.map.facilitiesAvailable')}
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {facilities.map(facility => (
          <Card key={facility.id} className="p-4 hover:shadow-md transition-shadow">
            <h3 className="font-medium">{facility.name}</h3>
            <p className="text-sm text-gray-500">{facility.address}</p>
            <div className="flex items-center mt-2 text-xs text-gray-400">
              <MapPin className="h-3 w-3 mr-1" />
              <span>{facility.address_city}</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default FacilityMapViewComponent;
