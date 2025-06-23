import React from 'react';
import { Facility } from '@/types/facility';
import { useJsonTranslation } from '@/hooks/useJsonTranslation';
import { Button } from '@/components/ui/button';
import { Calendar, Eye, Pencil } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface FacilityTableViewProps {
  facilities: Facility[];
  onView: (facility: Facility) => void;
  onCalendar: (facility: Facility) => void;
  onEdit: (facility: Facility) => void;
}

const FacilityTableView: React.FC<FacilityTableViewProps> = ({
  facilities,
  onView,
  onCalendar,
  onEdit
}) => {
  const { tSync } = useJsonTranslation();

  return (
    <div className="w-full overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{tSync('admin.facilities.table.name')}</TableHead>
            <TableHead>{tSync('admin.facilities.table.type')}</TableHead>
            <TableHead>{tSync('admin.facilities.table.capacity')}</TableHead>
            <TableHead>{tSync('admin.facilities.table.status')}</TableHead>
            <TableHead>{tSync('admin.facilities.table.nextAvailable')}</TableHead>
            <TableHead className="text-right">{tSync('admin.facilities.table.actions')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {facilities.map((facility) => (
            <TableRow key={facility.id}>
              <TableCell className="font-medium">{facility.name}</TableCell>
              <TableCell>{facility.type}</TableCell>
              <TableCell>{facility.capacity}</TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  facility.status === 'active' ? 'bg-green-100 text-green-800' :
                  facility.status === 'maintenance' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {facility.status === 'active' ? tSync('admin.facilities.status.active') :
                   facility.status === 'maintenance' ? tSync('admin.facilities.status.maintenance') :
                   tSync('admin.facilities.status.inactive')}
                </span>
              </TableCell>
              <TableCell>{facility.nextAvailable}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onView(facility)}
                    title={tSync('admin.facilities.actions.view')}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
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
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default FacilityTableView;
