import React, { useState } from "react";
import { PageLayout } from "@/components/layouts";
import { FacilityListView } from "@/components/admin/facilities/FacilityListView";

const LocationsPage = () => {
  const [selectedFacilityId, setSelectedFacilityId] = useState<number | undefined>();

  return (
    <PageLayout>
      <FacilityListView 
        selectedFacilityId={selectedFacilityId}
        onFacilitySelect={setSelectedFacilityId}
      />
    </PageLayout>
  );
};

export default LocationsPage; 