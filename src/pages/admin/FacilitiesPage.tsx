
import React, { useState } from "react";
import { PageLayout } from "@/components/layouts";
import { FacilityListView } from "@/components/admin/facilities/FacilityListView";

const FacilitiesPage = () => {
  const [selectedFacilityId, setSelectedFacilityId] = useState<string | undefined>();

  return (
    <PageLayout>
      <FacilityListView 
        selectedFacilityId={selectedFacilityId}
        onFacilitySelect={setSelectedFacilityId}
      />
    </PageLayout>
  );
};

export default FacilitiesPage;
