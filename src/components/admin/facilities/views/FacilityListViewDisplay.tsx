import React from 'react';
import { Facility } from '@/types/facility';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/hooks/useTranslation';

interface FacilityListViewDisplayProps {
  facilities: Facility[];
  onView: (facility: Facility) => void;
  onCalendar: (facility: Facility) => void;
  onEdit: (facility: Facility) => void;
}

export const FacilityListViewDisplay: React.FC<FacilityListViewDisplayProps> = ({ facilities, onView, onCalendar, onEdit }) => {
  const { tSync } = useTranslation();

  if (!facilities.length) {
    return <div className="text-center py-8 text-gray-500">{tSync('admin.facilities.search.noResults', 'No facilities found.')}</div>;
  }

  return (
    <ul className="w-full px-8 divide-y divide-gray-200">
      {facilities.map((facility) => (
        <li key={facility.id} className="flex flex-col md:flex-row items-start md:items-center justify-between py-6 gap-2 text-base">
          <div>
            <div className="font-semibold text-lg">{facility.name}</div>
            <div className="text-base text-gray-500">{facility.type}</div>
            <div className="text-sm text-gray-400">{facility.area}</div>
          </div>
          <div className="flex gap-2 mt-2 md:mt-0">
            <Button size="sm" variant="outline" onClick={() => onView(facility)}>{tSync('admin.facilities.actions.view', 'View')}</Button>
            <Button size="sm" variant="outline" onClick={() => onCalendar(facility)}>{tSync('admin.facilities.actions.calendar', 'Calendar')}</Button>
            <Button size="sm" onClick={() => onEdit(facility)}>{tSync('admin.facilities.actions.edit', 'Edit')}</Button>
          </div>
        </li>
      ))}
    </ul>
  );
};
