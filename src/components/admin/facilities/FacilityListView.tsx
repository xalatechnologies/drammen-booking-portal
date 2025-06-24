
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useFacilities } from '@/hooks/useFacilities';

interface FacilityListViewProps {
  onCreateNew?: () => void;
  onEdit?: (facilityId: number) => void;
}

export function FacilityListView({ onCreateNew, onEdit }: FacilityListViewProps) {
  const { data: facilities = [], isLoading } = useFacilities();

  if (isLoading) {
    return <div>Loading facilities...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Facilities</h1>
        {onCreateNew && (
          <Button onClick={onCreateNew}>
            <Plus className="h-4 w-4 mr-2" />
            New Facility
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Facilities</CardTitle>
        </CardHeader>
        <CardContent>
          {facilities.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No facilities found
            </p>
          ) : (
            <div className="space-y-4">
              {facilities.map((facility: any) => (
                <div
                  key={facility.id}
                  className="border rounded-lg p-4 cursor-pointer hover:bg-gray-50"
                  onClick={() => onEdit?.(facility.id)}
                >
                  <h3 className="font-medium">{facility.name}</h3>
                  <p className="text-sm text-gray-600">{facility.type}</p>
                  <p className="text-sm text-gray-600">{facility.address_city}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
