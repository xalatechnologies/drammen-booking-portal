
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface FacilityImageManagementProps {
  facilityId: number;
}

export const FacilityImageManagement: React.FC<FacilityImageManagementProps> = ({
  facilityId
}) => {
  // For now, return a placeholder since the old facility_images table doesn't exist
  // This will be updated when we create proper image management for the new system
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Image Management</CardTitle>
      </CardHeader>
      <CardContent>
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Image management is being updated for the new system. This feature will be available soon.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
};
