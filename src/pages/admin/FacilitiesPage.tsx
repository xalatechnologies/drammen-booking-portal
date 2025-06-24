
import React, { useState } from "react";
import { PageLayout } from "@/components/layouts";
import { FacilityManagementTabs } from "@/components/admin/facilities/FacilityManagementTabs";

const FacilitiesPage = () => {
  const [selectedFacilityId, setSelectedFacilityId] = useState<number | undefined>();

  const handleFacilitySelect = (id: number) => {
    setSelectedFacilityId(id);
  };

  return (
    <PageLayout>
      <FacilityManagementTabs 
        selectedFacilityId={selectedFacilityId}
        onFacilitySelect={handleFacilitySelect}
      />
    </PageLayout>
  );
};

export default FacilitiesPage;
