
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { FacilityImage } from "@/types/facility";
import { ImageUploadSection } from "./image-management/ImageUploadSection";
import { ImageGrid } from "./image-management/ImageGrid";
import { ImageEditDialog } from "./image-management/ImageEditDialog";
import { useTranslation } from "@/hooks/useTranslation";

interface FacilityImageManagementProps {
  facilityId: number;
}

export const FacilityImageManagement: React.FC<FacilityImageManagementProps> = ({
  facilityId
}) => {
  const [editingImage, setEditingImage] = useState<FacilityImage | null>(null);
  const { tSync } = useTranslation();

  const { data: images, isLoading } = useQuery({
    queryKey: ['facility-images', facilityId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('facility_images')
        .select('*')
        .eq('facility_id', facilityId)
        .order('display_order', { ascending: true });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!facilityId,
  });

  const featuredImage = images?.find(img => img.is_featured);

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
          <ImageUploadSection 
            facilityId={facilityId} 
            existingImagesCount={images?.length || 0} 
          />
        </CardContent>
      </Card>

      {/* Current Images */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>
              {tSync("admin.facilities.images.currentImages", "Current Images")} ({images?.length || 0})
            </span>
            {featuredImage && (
              <Badge variant="outline" className="flex items-center gap-1">
                <Star className="w-3 h-3" />
                {tSync("admin.facilities.images.featured", "Featured")}: {featuredImage.alt_text}
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-gray-500">
                {tSync("admin.common.loading", "Loading...")}
              </div>
            </div>
          ) : images && images.length > 0 ? (
            <ImageGrid 
              images={images} 
              facilityId={facilityId}
              onEditImage={setEditingImage}
            />
          ) : (
            <div className="text-center py-12 text-gray-500">
              <Upload className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>{tSync("admin.facilities.images.noImages", "No images uploaded yet")}</p>
              <p className="text-sm mt-2">
                {tSync("admin.facilities.images.uploadFirst", "Upload your first image using the section above")}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <ImageEditDialog
        image={editingImage}
        onClose={() => setEditingImage(null)}
        facilityId={facilityId}
      />
    </div>
  );
};
