
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Plus } from 'lucide-react';

interface SimplifiedZoneManagementProps {
  facilityId?: number;
}

export function SimplifiedZoneManagement({ facilityId }: SimplifiedZoneManagementProps) {
  const handleAddZone = () => {
    console.log('Add zone for facility:', facilityId);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Zone Management
          </div>
          <Button onClick={handleAddZone} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Zone
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8">
          <MapPin className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 mb-2">Simplified zone management</p>
          <p className="text-sm text-gray-400">
            Basic zone configuration interface
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
