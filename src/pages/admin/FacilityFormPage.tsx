
import React from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "@/components/admin/AdminLayout";
import { EnhancedFacilityForm } from "@/components/admin/facilities/form/EnhancedFacilityForm";
import { FacilityFormBreadcrumb } from "@/components/admin/facilities/form/FacilityFormBreadcrumb";

const FacilityFormPage = () => {
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate("/admin/facilities");
  };

  const handleCancel = () => {
    navigate("/admin/facilities");
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <FacilityFormBreadcrumb 
          isEditing={false}
          onCancel={handleCancel}
        />
        <EnhancedFacilityForm />
      </div>
    </AdminLayout>
  );
};

export default FacilityFormPage;
