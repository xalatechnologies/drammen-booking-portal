import React from 'react';
import { Facility } from '@/types/facility';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Calendar, Edit } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useJsonTranslation } from '@/hooks/useJsonTranslation';

interface FacilityTableViewProps {
  facilities: Facility[];
  onView: (facility: Facility) => void;
  onCalendar: (facility: Facility) => void;
  onEdit: (facility: Facility) => void;
  isLoading?: boolean;
}

export const FacilityTableView: React.FC<FacilityTableViewProps> = ({ facilities, onView, onCalendar, onEdit, isLoading }) => {
  const { tSync } = useJsonTranslation();

  // Skeleton loader
  if (isLoading) {
    return (
      <div className="w-full mt-4 mb-6 bg-white rounded-lg shadow-sm overflow-x-auto px-4 sm:px-6 lg:px-8 animate-pulse">
        <div className="h-12 bg-gray-100 rounded mb-2" />
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-10 bg-gray-50 rounded mb-2" />
        ))}
      </div>
    );
  }

  // Empty state
  if (!facilities.length) {
    return (
      <div className="w-full mt-4 mb-6 bg-white rounded-lg shadow-sm px-4 sm:px-6 lg:px-8 text-center py-12 text-gray-500">
        {tSync('admin.facilities.search.noResults', 'No facilities found.')}
      </div>
    );
  }

  return (
    <table className="w-full min-w-full divide-y divide-gray-200 text-base mt-0">
      <thead className="bg-gray-50 sticky top-0 z-10">
        <tr>
          <th className="px-3 py-3 text-left font-semibold text-gray-800 uppercase tracking-wider whitespace-nowrap">{tSync('admin.facilities.table.name', 'Name')}</th>
          <th className="px-3 py-3 text-left font-semibold text-gray-800 uppercase tracking-wider whitespace-nowrap">{tSync('admin.facilities.table.type', 'Type')}</th>
          <th className="px-3 py-3 text-left font-semibold text-gray-800 uppercase tracking-wider whitespace-nowrap">{tSync('admin.facilities.table.area', 'Area')}</th>
          <th className="px-3 py-3 text-left font-semibold text-gray-800 uppercase tracking-wider whitespace-nowrap">{tSync('admin.facilities.table.status', 'Status')}</th>
          <th className="px-3 py-3 text-center font-semibold text-gray-800 uppercase tracking-wider whitespace-nowrap">{tSync('admin.facilities.table.actions', 'Actions')}</th>
        </tr>
      </thead>
      <tbody>
        {facilities.map((facility, idx) => (
          <tr
            key={facility.id}
            className={`transition-colors cursor-pointer ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50`}
            tabIndex={0}
            aria-label={tSync('admin.facilities.table.viewDetails', 'View facility details')}
            onClick={() => onView(facility)}
            onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') onView(facility); }}
          >
            <td className="px-3 py-3 whitespace-nowrap font-medium">{facility.name}</td>
            <td className="px-3 py-3 whitespace-nowrap">{facility.type}</td>
            <td className="px-3 py-3 whitespace-nowrap">{facility.area}</td>
            <td className="px-3 py-3 whitespace-nowrap">
              <Badge variant={facility.status === 'active' ? 'default' : 'secondary'} className={facility.status === 'active' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-gray-100 text-gray-500 border-gray-200'}>
                {facility.status}
              </Badge>
            </td>
            <td className="px-3 py-3 whitespace-nowrap flex gap-2 justify-center" onClick={e => e.stopPropagation()}>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button size="icon" variant="ghost" aria-label={tSync('admin.facilities.actions.view', 'View')} onClick={() => onView(facility)}>
                      <Eye className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>{tSync('admin.facilities.actions.view', 'View')}</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button size="icon" variant="ghost" aria-label={tSync('admin.facilities.actions.calendar', 'Calendar')} onClick={() => onCalendar(facility)}>
                      <Calendar className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>{tSync('admin.facilities.actions.calendar', 'Calendar')}</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button size="icon" variant="ghost" aria-label={tSync('admin.facilities.actions.edit', 'Edit')} onClick={() => onEdit(facility)}>
                      <Edit className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>{tSync('admin.facilities.actions.edit', 'Edit')}</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
