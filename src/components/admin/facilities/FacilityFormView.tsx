
import React from "react";
import { EnhancedFacilityForm } from "./form/EnhancedFacilityForm";

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
    <EnhancedFacilityForm 
      facilityId={facility?.id}
      onSuccess={onSuccess}
    />
  );
};
