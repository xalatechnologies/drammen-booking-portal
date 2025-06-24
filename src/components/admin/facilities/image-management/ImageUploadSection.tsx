
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ImageUploadSectionProps {
  facilityId: number;
  existingImagesCount: number;
}

export const ImageUploadSection: React.FC<ImageUploadSectionProps> = ({
  facilityId,
  existingImagesCount
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload New Images</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center py-8 text-gray-500">
          Image upload functionality will be available here.
        </div>
      </CardContent>
    </Card>
  );
};
