
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OpeningHoursManagement } from "../../OpeningHoursManagement";
import { BlackoutPeriodsManagement } from "../../BlackoutPeriodsManagement";
import { useTranslation } from "@/hooks/useTranslation";

interface FacilityCalendarManagementProps {
  facilityId: number;
}

export const FacilityCalendarManagement: React.FC<FacilityCalendarManagementProps> = ({
  facilityId
}) => {
  const { tSync } = useTranslation();

  return (
    <div className="space-y-8">
      {/* Opening Hours */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">
            {tSync("admin.facilities.calendar.openingHours", "Opening Hours")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <OpeningHoursManagement selectedFacilityId={facilityId} />
        </CardContent>
      </Card>

      {/* Blackout Periods */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">
            {tSync("admin.facilities.calendar.blackoutPeriods", "Blackout Periods")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <BlackoutPeriodsManagement facilityId={facilityId.toString()} />
        </CardContent>
      </Card>

      {/* Availability Rules */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">
            {tSync("admin.facilities.calendar.availabilityRules", "Availability Rules")}
          </CardTitle>
        </CardHeader>
        <CardContent className="py-8">
          <div className="text-center text-gray-500">
            <p>{tSync("admin.facilities.calendar.comingSoon", "Advanced availability rules coming soon...")}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
