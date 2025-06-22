
import React from "react";
import { SimplifiedFacilityForm } from "./form/SimplifiedFacilityForm";

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
    <SimplifiedFacilityForm 
      facility={facility}
      onSuccess={onSuccess}
      onCancel={onCancel}
    />
  );
};
