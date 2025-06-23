
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Edit, Calendar } from 'lucide-react';
import { Facility } from '@/types/facility';
import { useJsonTranslation } from '@/hooks/useJsonTranslation';

interface FacilityDetailViewComponentProps {
  facility: Facility;
  onBack: () => void;
  onEdit: () => void;
  onCalendar: () => void;
}

export const FacilityDetailViewComponent: React.FC<FacilityDetailViewComponentProps> = ({
  facility,
  onBack,
  onEdit,
  onCalendar
}) => {
  const { tSync } = useJsonTranslation();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          {tSync('common.back', 'Back')}
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onCalendar}>
            <Calendar className="h-4 w-4 mr-2" />
            {tSync('admin.facilities.actions.calendar', 'Calendar')}
          </Button>
          <Button onClick={onEdit}>
            <Edit className="h-4 w-4 mr-2" />
            {tSync('admin.facilities.actions.edit', 'Edit')}
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{facility.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium mb-2">Basic Information</h3>
              <div className="space-y-2 text-sm">
                <p><strong>Type:</strong> {facility.type}</p>
                <p><strong>Capacity:</strong> {facility.capacity}</p>
                <p><strong>Status:</strong> {facility.status}</p>
                <p><strong>Address:</strong> {facility.address}</p>
              </div>
            </div>
            <div>
              <h3 className="font-medium mb-2">Booking Information</h3>
              <div className="space-y-2 text-sm">
                <p><strong>Price per hour:</strong> {facility.pricePerHour} NOK</p>
                <p><strong>Next available:</strong> {facility.nextAvailable}</p>
                <p><strong>Auto approval:</strong> {facility.hasAutoApproval ? 'Yes' : 'No'}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FacilityDetailViewComponent;

