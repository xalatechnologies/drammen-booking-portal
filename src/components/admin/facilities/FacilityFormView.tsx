
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface FacilityFormViewProps {
  facility?: any;
  onSuccess: () => void;
  onCancel: () => void;
}

export const FacilityFormView: React.FC<FacilityFormViewProps> = ({
  facility,
  onSuccess,
  onCancel
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Facility Form</CardTitle>
      </CardHeader>
      <CardContent className="py-8">
        <div className="text-center text-gray-500">
          <p>Facility form {facility ? `for ${facility.name}` : 'for new facility'} will be available soon...</p>
        </div>
      </CardContent>
    </Card>
  );
};
