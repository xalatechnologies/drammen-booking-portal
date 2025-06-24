
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, Calendar, Edit } from 'lucide-react';
import { Facility } from '@/types/facility';

interface FacilityListViewProps {
  facilities: Facility[];
  onView: (facility: Facility) => void;
  onCalendar: (facility: Facility) => void;
  onEdit: (facility: Facility) => void;
}

export function FacilityListView({ facilities, onView, onCalendar, onEdit }: FacilityListViewProps) {
  return (
    <div className="space-y-4">
      {facilities.map((facility) => (
        <Card key={facility.id}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">{facility.name}</h3>
                <p className="text-gray-600">{facility.type}</p>
                <p className="text-sm text-gray-500">{facility.address}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => onView(facility)}>
                  <Eye className="h-4 w-4 mr-2" />
                  View
                </Button>
                <Button variant="outline" size="sm" onClick={() => onCalendar(facility)}>
                  <Calendar className="h-4 w-4 mr-2" />
                  Calendar
                </Button>
                <Button size="sm" onClick={() => onEdit(facility)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
