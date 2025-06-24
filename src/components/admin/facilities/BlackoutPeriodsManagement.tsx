
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface BlackoutPeriodsManagementProps {
  facilityId: number;
}

export function BlackoutPeriodsManagement({ facilityId }: BlackoutPeriodsManagementProps) {
  const [periods, setPeriods] = useState<any[]>([]);

  const handleAddPeriod = () => {
    console.log('Add blackout period for facility:', facilityId);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Blackout Periods
          <Button onClick={handleAddPeriod} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Period
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {periods.length === 0 ? (
          <p className="text-gray-500 text-center py-4">
            No blackout periods configured
          </p>
        ) : (
          <div className="space-y-2">
            {periods.map((period, index) => (
              <div key={index} className="p-3 border rounded-lg">
                {period.name}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
