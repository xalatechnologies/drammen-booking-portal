import React from 'react';
import { Facility } from '@/types/facility';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/hooks/useTranslation';

interface FacilityGridViewProps {
  facilities: Facility[];
  onView: (facility: Facility) => void;
  onCalendar: (facility: Facility) => void;
  onEdit: (facility: Facility) => void;
}

export const FacilityGridView: React.FC<FacilityGridViewProps> = ({ facilities, onView, onCalendar, onEdit }) => {
  const { tSync } = useTranslation();

  if (!facilities.length) {
    return <div className="text-center py-8 text-gray-500">{tSync('admin.facilities.search.noResults', 'No facilities found.')}</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full px-8">
      {facilities.map((facility) => (
        <Card key={facility.id} className="flex flex-col p-6 gap-2 shadow-md hover:shadow-lg transition-shadow text-base">
          <div className="font-semibold text-lg mb-1">{facility.name}</div>
          <div className="text-base text-gray-500 mb-2">{facility.type}</div>
          <div className="flex-1 text-sm text-gray-400 mb-2">{facility.area}</div>
          <div className="flex gap-2 mt-auto">
            <Button size="sm" variant="outline" onClick={() => onView(facility)}>{tSync('admin.facilities.actions.view', 'View')}</Button>
            <Button size="sm" variant="outline" onClick={() => onCalendar(facility)}>{tSync('admin.facilities.actions.calendar', 'Calendar')}</Button>
            <Button size="sm" onClick={() => onEdit(facility)}>{tSync('admin.facilities.actions.edit', 'Edit')}</Button>
          </div>
        </Card>
      ))}
    </div>
  );
};
