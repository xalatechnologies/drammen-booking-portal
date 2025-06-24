
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Plus } from 'lucide-react';

interface Zone {
  id: string;
  name: string;
  capacity: number;
  area?: string;
}

interface FacilityZonesSectionProps {
  facility: {
    id: number;
    zones?: Zone[];
  };
}

export function FacilityZonesSection({ facility }: FacilityZonesSectionProps) {
  const handleAddZone = () => {
    console.log('Add zone for facility:', facility.id);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Zones
          </div>
          <Button onClick={handleAddZone} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Zone
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!facility.zones || facility.zones.length === 0 ? (
          <div className="text-center py-8">
            <MapPin className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-2">No zones configured</p>
            <p className="text-sm text-gray-400">
              Add zones to divide the facility into bookable areas
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {facility.zones.map((zone) => (
              <div key={zone.id} className="p-3 border rounded-lg">
                <h4 className="font-medium">{zone.name}</h4>
                <p className="text-sm text-gray-500">Capacity: {zone.capacity}</p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
