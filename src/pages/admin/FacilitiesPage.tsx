
import React, { useState } from "react";
import { FacilityManagementTabs } from "@/components/admin/facilities/FacilityManagementTabs";

const FacilitiesPage = () => {
  const [selectedFacilityId, setSelectedFacilityId] = useState<number | undefined>();

  return (
    <div className="w-full min-h-screen bg-gray-50">
      <FacilityManagementTabs 
        selectedFacilityId={selectedFacilityId}
        onFacilitySelect={setSelectedFacilityId}
      />
    </div>
  );
};

export default FacilitiesPage;
