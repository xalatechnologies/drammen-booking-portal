
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Facility } from '@/types/facility';
import { useJsonTranslation } from '@/hooks/useJsonTranslation';

interface FacilityMapViewComponentProps {
  facilities: Facility[];
  isLoading: boolean;
}

export const FacilityMapViewComponent: React.FC<FacilityMapViewComponentProps> = ({
  facilities,
  isLoading
}) => {
  const { tSync } = useJsonTranslation();

  if (isLoading) {
    return (
      <div className="text-center py-8">
        {tSync("admin.common.loading", "Loading...")}
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Facility Map View</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-12 text-gray-500">
          <p>Map view showing {facilities.length} facilities will be implemented here.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default FacilityMapViewComponent;

