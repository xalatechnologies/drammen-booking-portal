
import React from "react";
import { FormLayout } from "@/components/layouts";
import { FacilityImageManagement } from "./FacilityImageManagement";
import { useTranslation } from "@/hooks/useTranslation";

interface FacilityFormTabsProps {
  facilityId?: number;
  children: React.ReactNode;
  title: string;
  description?: string;
  breadcrumb?: React.ReactNode;
  actions: React.ReactNode;
  onSubmit?: (e: React.FormEvent) => void;
}

export const FacilityFormTabs: React.FC<FacilityFormTabsProps> = ({
  facilityId,
  children,
  title,
  description,
  breadcrumb,
  actions,
  onSubmit
}) => {
  const { tSync } = useTranslation();

  const tabs = [
    {
      id: "details",
      label: tSync("admin.facilities.form.tabs.details", "Facility Details"),
      content: children
    },
    {
      id: "images",
      label: tSync("admin.facilities.form.tabs.images", `Images (${facilityId ? 'Available' : 'Save facility first'})`),
      content: facilityId ? (
        <FacilityImageManagement facilityId={facilityId} />
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          {tSync("admin.facilities.form.saveFirst", "Please save the facility first before managing images.")}
        </div>
      ),
      disabled: !facilityId
    }
  ];

  return (
    <FormLayout
      title={title}
      description={description}
      breadcrumb={breadcrumb}
      tabs={tabs}
      actions={actions}
      onSubmit={onSubmit}
    />
  );
};
