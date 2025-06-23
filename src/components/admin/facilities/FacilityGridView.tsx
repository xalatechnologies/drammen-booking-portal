import React from 'react';
import { Facility } from '@/types/facility';
import { useJsonTranslation } from '@/hooks/useJsonTranslation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Calendar, Eye, Pencil, MapPin, Users } from 'lucide-react';

interface FacilityGridViewProps {
  facilities: Facility[];
  onView: (facility: Facility) => void;
  onCalendar: (facility: Facility) => void;
  onEdit: (facility: Facility) => void;
}

const FacilityGridView: React.FC<FacilityGridViewProps> = ({
  facilities,
  onView,
  onCalendar,
  onEdit
}) => {
  const { tSync } = useJsonTranslation();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {facilities.map((facility) => (
        <Card key={facility.id} className="overflow-hidden">
          <CardHeader className="p-0">
            <div className="h-48 bg-gray-100 relative">
              {facility.image ? (
                <img 
                  src={facility.image} 
                  alt={facility.name} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full bg-gray-200">
                  <span className="text-gray-400">{tSync('admin.facilities.noImage')}</span>
                </div>
              )}
              <div className="absolute top-2 right-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  facility.status === 'active' ? 'bg-green-100 text-green-800' :
                  facility.status === 'maintenance' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {facility.status === 'active' ? tSync('admin.facilities.status.active') :
                  facility.status === 'maintenance' ? tSync('admin.facilities.status.maintenance') :
                  tSync('admin.facilities.status.inactive')}
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <h3 className="font-semibold text-lg mb-2">{facility.name}</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-500" />
                <span className="text-gray-600 truncate">{facility.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-gray-500" />
                <span className="text-gray-600">
                  {tSync('admin.facilities.capacity')}: {facility.capacity}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="text-gray-600">
                  {tSync('admin.facilities.nextAvailable')}: {facility.nextAvailable}
                </span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t pt-3 flex justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onView(facility)}
              className="flex items-center gap-1"
            >
              <Eye className="h-4 w-4" />
              {tSync('admin.facilities.actions.view')}
            </Button>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onCalendar(facility)}
                title={tSync('admin.facilities.actions.calendar')}
              >
                <Calendar className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(facility)}
                title={tSync('admin.facilities.actions.edit')}
              >
                <Pencil className="h-4 w-4" />
              </Button>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default FacilityGridView;
