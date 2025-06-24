
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, Plus } from 'lucide-react';

interface OpeningHoursManagementProps {
  facilityId: number;
}

export function OpeningHoursManagement({ facilityId }: OpeningHoursManagementProps) {
  const handleAddHours = () => {
    console.log('Add opening hours for facility:', facilityId);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Opening Hours Management
          </div>
          <Button onClick={handleAddHours} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Hours
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8">
          <Clock className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 mb-2">No opening hours configured</p>
          <p className="text-sm text-gray-400">
            Add opening hours to define when the facility is available
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
