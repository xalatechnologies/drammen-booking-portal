import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { FacilityService } from "@/services/facilityService";
import { EnhancedFacilityForm } from "@/components/admin/facilities/form/EnhancedFacilityForm";
import { LoadingState } from "@/components/layouts";
import { useFacilityAdminStore } from '@/stores/useFacilityAdminStore';

const FacilityFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = id && id !== 'new';
  const { setCurrentFacility, openForm } = useFacilityAdminStore();

  const { data: facilityResponse, isLoading } = useQuery({
    queryKey: ['facility', id],
    queryFn: () => FacilityService.getFacilityById(id!),
    enabled: !!isEditing
  });

  const facility = facilityResponse?.success ? facilityResponse.data : null;

  React.useEffect(() => {
    if (facility) {
      setCurrentFacility(facility);
      openForm('edit', facility);
    }
  }, [facility, setCurrentFacility, openForm]);

  const handleSuccess = () => {
    navigate('/admin/facilities');
  };

  const handleCancel = () => {
    navigate('/admin/facilities');
  };

  if (isLoading && isEditing) {
    return <LoadingState />;
  }
  if (isEditing && !facility) {
    return <div>Loading facility data...</div>;
  }

  return (
    <EnhancedFacilityForm 
      onSuccess={handleSuccess}
    />
  );
};

export default FacilityFormPage;
