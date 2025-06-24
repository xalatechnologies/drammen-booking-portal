
import React from "react";

interface ImageGridProps {
  images: any[];
  facilityId: number;
  onEditImage: (image: any) => void;
}

export const ImageGrid: React.FC<ImageGridProps> = ({
  images,
  facilityId,
  onEditImage
}) => {
  if (!images?.length) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No images uploaded yet. Upload some images to get started.
      </div>
    );
  }

  return (
    <div className="text-center py-8 text-muted-foreground">
      Image grid functionality will be available here.
    </div>
  );
};
