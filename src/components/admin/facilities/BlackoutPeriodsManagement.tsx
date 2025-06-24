
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface BlackoutPeriodsManagementProps {
  facilityId: string;
}

export const BlackoutPeriodsManagement: React.FC<BlackoutPeriodsManagementProps> = ({
  facilityId
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Blackout Periods Management</CardTitle>
      </CardHeader>
      <CardContent className="py-8">
        <div className="text-center text-gray-500">
          <p>Blackout periods management for facility {facilityId} will be available soon...</p>
        </div>
      </CardContent>
    </Card>
  );
};
