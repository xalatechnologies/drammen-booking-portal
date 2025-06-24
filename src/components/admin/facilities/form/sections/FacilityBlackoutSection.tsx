
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BlackoutPeriodsManagement } from '../../BlackoutPeriodsManagement';

interface FacilityBlackoutSectionProps {
  facilityId?: number;
}

export function FacilityBlackoutSection({ facilityId }: FacilityBlackoutSectionProps) {
  if (!facilityId) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Blackout Periods</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">Save the facility first to manage blackout periods</p>
        </CardContent>
      </Card>
    );
  }

  return <BlackoutPeriodsManagement facilityId={facilityId} />;
}
