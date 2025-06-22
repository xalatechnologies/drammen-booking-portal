
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { FacilityService } from "@/services/facilityService";
import { SimplifiedFacilityForm } from "@/components/admin/facilities/form/SimplifiedFacilityForm";
import { LoadingState } from "@/components/layouts";

const FacilityFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = id && id !== 'new';

  const { data: facilityResponse, isLoading } = useQuery({
    queryKey: ['facility', id],
    queryFn: () => FacilityService.getFacility(id!),
    enabled: !!isEditing
  });

  const facility = facilityResponse?.success ? facilityResponse.data : null;

  const handleSuccess = () => {
    navigate('/admin/facilities');
  };

  const handleCancel = () => {
    navigate('/admin/facilities');
  };

  if (isLoading && isEditing) {
    return <LoadingState />;
  }

  return (
    <SimplifiedFacilityForm 
      facility={facility}
      onSuccess={handleSuccess}
      onCancel={handleCancel}
    />
  );
};

export default FacilityFormPage;
