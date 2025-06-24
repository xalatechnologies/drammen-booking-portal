
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface EnhancedFacilityFormProps {
  facilityId?: number;
}

export const EnhancedFacilityForm: React.FC<EnhancedFacilityFormProps> = ({
  facilityId
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Enhanced Facility Form</CardTitle>
      </CardHeader>
      <CardContent className="py-8">
        <div className="text-center text-gray-500">
          <p>Enhanced facility form {facilityId ? `for facility ${facilityId}` : 'for new facility'} will be available soon...</p>
        </div>
      </CardContent>
    </Card>
  );
};
