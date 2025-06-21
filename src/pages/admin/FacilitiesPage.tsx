
import React, { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import PageHeader from "@/components/admin/PageHeader";
import { FacilityManagementTabs } from "@/components/admin/facilities/FacilityManagementTabs";

const FacilitiesPage = () => {
  const [selectedFacilityId, setSelectedFacilityId] = useState<number | undefined>();

  return (
    <AdminLayout>
      <div className="space-y-6">
        <PageHeader
          title="Facility Management"
          description="Manage facilities, zones, opening hours, and blackout periods"
        />
        
        <FacilityManagementTabs 
          selectedFacilityId={selectedFacilityId}
          onFacilitySelect={setSelectedFacilityId}
        />
      </div>
    </AdminLayout>
  );
};

export default FacilitiesPage;
