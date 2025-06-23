
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { Facility } from '@/types/facility';
import { useJsonTranslation } from '@/hooks/useJsonTranslation';

interface FacilityCalendarViewComponentProps {
  facility: Facility;
  onBack: () => void;
}

export const FacilityCalendarViewComponent: React.FC<FacilityCalendarViewComponentProps> = ({
  facility,
  onBack
}) => {
  const { tSync } = useJsonTranslation();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          {tSync('common.back', 'Back')}
        </Button>
        <h1 className="text-2xl font-bold">{facility.name} - Calendar</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Booking Calendar</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-gray-500">
            <p>Calendar view for {facility.name} will be implemented here.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FacilityCalendarViewComponent;

