
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageLayout } from "@/components/layouts";
import { FacilityListView } from "@/components/admin/facilities/FacilityListView";

const FacilitiesPage = () => {
  const navigate = useNavigate();

  const handleCreateNew = () => {
    navigate('/admin/facilities/new');
  };

  const handleEdit = (facilityId: number) => {
    navigate(`/admin/facilities/${facilityId}`);
  };

  return (
    <PageLayout>
      <FacilityListView 
        onCreateNew={handleCreateNew}
        onEdit={handleEdit}
      />
    </PageLayout>
  );
};

export default FacilitiesPage;
