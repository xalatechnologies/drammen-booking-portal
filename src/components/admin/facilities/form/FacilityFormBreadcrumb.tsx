
import React from "react";
import { Button } from "@/components/ui/button";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { ArrowLeft, Home } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

interface FacilityFormBreadcrumbProps {
  isEditing: boolean;
  facilityName?: string;
  onCancel: () => void;
}

export const FacilityFormBreadcrumb: React.FC<FacilityFormBreadcrumbProps> = ({
  isEditing,
  facilityName,
  onCancel
}) => {
  const { tSync } = useTranslation();

  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="sm" onClick={onCancel} className="p-2">
          <ArrowLeft className="w-4 h-4" />
        </Button>
        
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin" className="flex items-center">
                <Home className="w-4 h-4 mr-1" />
                {tSync("admin.breadcrumb.home", "Admin")}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin/facilities">
                {tSync("admin.facilities.management", "Facilities")}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>
                {isEditing 
                  ? `${tSync("admin.facilities.form.edit", "Edit")} ${facilityName || tSync("admin.facilities.form.facility", "Facility")}`
                  : tSync("admin.facilities.form.addNew", "Add New Facility")
                }
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </div>
  );
};
