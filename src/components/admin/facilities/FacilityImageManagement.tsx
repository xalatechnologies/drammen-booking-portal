
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { FacilityImage } from "@/types/facility";
import { ImageUploadSection } from "./image-management/ImageUploadSection";
import { ImageGrid } from "./image-management/ImageGrid";
import { ImageEditDialog } from "./image-management/ImageEditDialog";

interface FacilityImageManagementProps {
  facilityId: number;
}

export const FacilityImageManagement: React.FC<FacilityImageManagementProps> = ({
  facilityId
}) => {
  const [editingImage, setEditingImage] = useState<FacilityImage | null>(null);

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
    <div className="space-y-6">
      <ImageUploadSection 
        facilityId={facilityId} 
        existingImagesCount={images?.length || 0} 
      />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Current Images ({images?.length || 0})
            {featuredImage && (
              <Badge variant="outline" className="flex items-center gap-1">
                <Star className="w-3 h-3" />
                Featured: {featuredImage.alt_text}
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div>Loading images...</div>
          ) : (
            <ImageGrid 
              images={images || []} 
              facilityId={facilityId}
              onEditImage={setEditingImage}
            />
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
