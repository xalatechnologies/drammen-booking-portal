
import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, StarOff, Eye, Trash2, Edit } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { FacilityImage } from "@/types/facility";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface ImageGridProps {
  images: FacilityImage[];
  facilityId: number;
  onEditImage: (image: FacilityImage) => void;
}

export const ImageGrid: React.FC<ImageGridProps> = ({
  images,
  facilityId,
  onEditImage
}) => {
  const queryClient = useQueryClient();

  const deleteImageMutation = useMutation({
    mutationFn: async (imageId: string) => {
      const { error } = await supabase
        .from('facility_images')
        .delete()
        .eq('id', imageId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['facility-images', facilityId] });
      toast({
        title: "Success",
        description: "Image deleted successfully",
      });
    },
  });

  const setFeaturedMutation = useMutation({
    mutationFn: async (imageId: string) => {
      await supabase
        .from('facility_images')
        .update({ is_featured: false })
        .eq('facility_id', facilityId);
      
      const { error } = await supabase
        .from('facility_images')
        .update({ is_featured: true })
        .eq('id', imageId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['facility-images', facilityId] });
      toast({
        title: "Success",
        description: "Featured image updated",
      });
    },
  });

  if (!images?.length) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No images uploaded yet. Upload some images to get started.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {images.map((image) => (
        <div key={image.id} className="relative group">
          <div className="aspect-square relative overflow-hidden rounded-lg border">
            <img
              src={image.image_url}
              alt={image.alt_text || 'Facility image'}
              className="w-full h-full object-cover"
            />
            
            {image.is_featured && (
              <Badge className="absolute top-2 left-2 bg-yellow-500">
                <Star className="w-3 h-3 mr-1" />
                Featured
              </Badge>
            )}
            
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setFeaturedMutation.mutate(image.id)}
                disabled={image.is_featured}
              >
                {image.is_featured ? <Star className="w-4 h-4" /> : <StarOff className="w-4 h-4" />}
              </Button>
              
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="secondary" size="sm">
                    <Eye className="w-4 h-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Image Preview</DialogTitle>
                  </DialogHeader>
                  <img
                    src={image.image_url}
                    alt={image.alt_text || 'Facility image'}
                    className="w-full h-auto max-h-96 object-contain"
                  />
                </DialogContent>
              </Dialog>
              
              <Button
                variant="secondary"
                size="sm"
                onClick={() => onEditImage(image)}
              >
                <Edit className="w-4 h-4" />
              </Button>
              
              <Button
                variant="destructive"
                size="sm"
                onClick={() => deleteImageMutation.mutate(image.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          <div className="mt-2 text-xs text-muted-foreground">
            <div>Order: {image.display_order}</div>
            {image.caption && <div>Caption: {image.caption}</div>}
          </div>
        </div>
      ))}
    </div>
  );
};
