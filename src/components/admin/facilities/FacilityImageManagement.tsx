
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

interface FacilityImageManagementProps {
  facilityId: number;
}

export const FacilityImageManagement: React.FC<FacilityImageManagementProps> = ({
  facilityId
}) => {
  const { tSync } = useTranslation();

  return (
    <div className="space-y-8">
      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            {tSync("admin.facilities.images.uploadNew", "Upload New Images")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-gray-500">
            <Upload className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>Image management functionality will be available here.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
