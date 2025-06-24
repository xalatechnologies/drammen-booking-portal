
import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { FacilityImage } from "@/types/facility";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ImageEditDialogProps {
  image: FacilityImage | null;
  onClose: () => void;
  facilityId: number;
}

export const ImageEditDialog: React.FC<ImageEditDialogProps> = ({
  image,
  onClose,
  facilityId
}) => {
  const [editingImage, setEditingImage] = React.useState<FacilityImage | null>(image);
  const queryClient = useQueryClient();

  React.useEffect(() => {
    setEditingImage(image);
  }, [image]);

  const updateImageMutation = useMutation({
    mutationFn: async (updatedImage: Partial<FacilityImage> & { id: string }) => {
      const { data, error } = await supabase
        .from('facility_images')
        .update(updatedImage)
        .eq('id', updatedImage.id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['facility-images', facilityId] });
      onClose();
      toast({
        title: "Success",
        description: "Image updated successfully",
      });
    },
  });

  const handleSave = () => {
    if (editingImage) {
      updateImageMutation.mutate(editingImage);
    }
  };

  if (!editingImage) return null;

  return (
    <Dialog open={!!image} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Image</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="alt-text">Alt Text</Label>
            <Input
              id="alt-text"
              value={editingImage.alt_text || ''}
              onChange={(e) => setEditingImage({...editingImage, alt_text: e.target.value})}
            />
          </div>
          <div>
            <Label htmlFor="caption">Caption</Label>
            <Textarea
              id="caption"
              value={editingImage.caption || ''}
              onChange={(e) => setEditingImage({...editingImage, caption: e.target.value})}
            />
          </div>
          <div>
            <Label htmlFor="display-order">Display Order</Label>
            <Input
              id="display-order"
              type="number"
              value={editingImage.display_order}
              onChange={(e) => setEditingImage({...editingImage, display_order: parseInt(e.target.value)})}
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={updateImageMutation.isPending}>
              {updateImageMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
