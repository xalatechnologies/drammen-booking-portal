
import React from "react";
import { useNavigate } from "react-router-dom";
import { PageLayout } from "@/components/layouts";
import { FacilityListView } from "@/components/admin/facilities/FacilityListView";

const LocationsPage = () => {
  const navigate = useNavigate();

  const handleEdit = (facilityId: number) => {
    navigate(`/caseworker/locations/${facilityId}`);
  };

  return (
    <PageLayout>
      <FacilityListView onEdit={handleEdit} />
    </PageLayout>
  );
};

export default LocationsPage;
