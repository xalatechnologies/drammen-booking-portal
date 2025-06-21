
import React, { useState } from "react";
import { FacilityListView } from "@/components/admin/facilities/FacilityListView";

const FacilitiesPage = () => {
  const [selectedFacilityId, setSelectedFacilityId] = useState<number | undefined>();

  return (
    <div className="w-full h-full p-3">
      <FacilityListView 
        selectedFacilityId={selectedFacilityId}
        onFacilitySelect={setSelectedFacilityId}
      />
    </div>
  );
};

export default FacilitiesPage;
