import React from 'react';
import { Facility } from '@/types/facility';
import { useJsonTranslation } from '@/hooks/useJsonTranslation';
import { Button } from '@/components/ui/button';
import { Calendar, Eye, Pencil, MapPin, Users, Clock } from 'lucide-react';

interface FacilityListViewDisplayProps {
  facilities: Facility[];
  onView: (facility: Facility) => void;
  onCalendar: (facility: Facility) => void;
  onEdit: (facility: Facility) => void;
}

const FacilityListViewDisplay: React.FC<FacilityListViewDisplayProps> = ({
  facilities,
  onView,
  onCalendar,
  onEdit
}) => {
  const { tSync } = useJsonTranslation();

  return (
    <div className="space-y-4">
      {facilities.map((facility) => (
        <div 
          key={facility.id} 
          className="border rounded-lg overflow-hidden flex flex-col md:flex-row"
        >
          <div className="w-full md:w-48 h-48 md:h-auto bg-gray-100 flex-shrink-0">
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
          </div>
          
          <div className="p-4 flex-grow flex flex-col">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-lg">{facility.name}</h3>
                <p className="text-gray-600 text-sm flex items-center gap-1 mt-1">
                  <MapPin className="h-3 w-3" />
                  {facility.address}
                </p>
              </div>
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
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 text-sm">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-gray-500" />
                <span className="text-gray-600">
                  {tSync('admin.facilities.capacity')}: {facility.capacity}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-500" />
                <span className="text-gray-600">
                  {tSync('admin.facilities.nextAvailable')}: {facility.nextAvailable}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="text-gray-600">
                  {tSync('admin.facilities.type')}: {facility.type}
                </span>
              </div>
            </div>
            
            <div className="mt-auto pt-4 flex justify-end border-t mt-4">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onView(facility)}
                  className="flex items-center gap-1"
                >
                  <Eye className="h-4 w-4" />
                  {tSync('admin.facilities.actions.view')}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onCalendar(facility)}
                  className="flex items-center gap-1"
                >
                  <Calendar className="h-4 w-4" />
                  {tSync('admin.facilities.actions.calendar')}
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => onEdit(facility)}
                  className="flex items-center gap-1"
                >
                  <Pencil className="h-4 w-4" />
                  {tSync('admin.facilities.actions.edit')}
                </Button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FacilityListViewDisplay;
