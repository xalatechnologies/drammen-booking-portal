
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface FacilityCalendarViewProps {
  facilityId: number;
}

export const FacilityCalendarView: React.FC<FacilityCalendarViewProps> = ({
  facilityId
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Facility Calendar</CardTitle>
      </CardHeader>
      <CardContent className="py-8">
        <div className="text-center text-gray-500">
          <p>Calendar view for facility {facilityId} will be available soon...</p>
        </div>
      </CardContent>
    </Card>
  );
};
