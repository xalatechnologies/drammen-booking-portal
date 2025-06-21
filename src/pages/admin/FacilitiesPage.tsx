
import React, { useState } from "react";
import { FacilityListView } from "@/components/admin/facilities/FacilityListView";

const FacilitiesPage = () => {
  const [selectedFacilityId, setSelectedFacilityId] = useState<number | undefined>();

  return (
    <div className="w-full min-h-screen bg-gray-50">
      <FacilityListView 
        selectedFacilityId={selectedFacilityId}
        onFacilitySelect={setSelectedFacilityId}
      />
    </div>
  );
};

export default FacilitiesPage;
