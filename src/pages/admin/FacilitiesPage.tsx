
import React, { useState } from "react";
import { PageLayout } from "@/components/layouts";
import { FacilityListView } from "@/components/admin/facilities/FacilityListView";

const FacilitiesPage = () => {
  const [selectedFacilityId, setSelectedFacilityId] = useState<number | undefined>();

  const handleFacilitySelect = (id: number) => {
    setSelectedFacilityId(id);
  };

  return (
    <PageLayout>
      <FacilityListView 
        selectedFacilityId={selectedFacilityId}
        onFacilitySelect={handleFacilitySelect}
      />
    </PageLayout>
  );
};

export default FacilitiesPage;
