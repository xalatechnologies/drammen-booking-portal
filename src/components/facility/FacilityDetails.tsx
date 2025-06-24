
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface FacilityDetailsProps {
  facility: any;
}

export function FacilityDetails({ facility }: FacilityDetailsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{facility?.name || 'Facility Details'}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium">Description</h3>
            <p className="text-gray-600">{facility?.description || 'No description available'}</p>
          </div>
          
          <div>
            <h3 className="font-medium">Address</h3>
            <p className="text-gray-600">
              {facility?.address_street}, {facility?.address_city}
            </p>
          </div>
          
          <div>
            <h3 className="font-medium">Capacity</h3>
            <p className="text-gray-600">{facility?.capacity || 'Not specified'}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
