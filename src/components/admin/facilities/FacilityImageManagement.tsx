
import React, { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Upload, X, Star, StarOff, Eye, Trash2, Edit } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface FacilityImage {
  id: string;
  facility_id: number;
  image_url: string;
  alt_text?: string;
  caption?: string;
  display_order: number;
  is_featured: boolean;
  file_size?: number;
  uploaded_by?: string;
  uploaded_at: string;
}

interface FacilityImageManagementProps {
  facilityId: number;
}

export const FacilityImageManagement: React.FC<FacilityImageManagementProps> = ({
  facilityId
}) => {
  const [uploadingFiles, setUploadingFiles] = useState<File[]>([]);
  const [editingImage, setEditingImage] = useState<FacilityImage | null>(null);
  const queryClient = useQueryClient();

  const { data: images, isLoading } = useQuery({
    queryKey: ['facility-images', facilityId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('facility_images')
        .select('*')
        .eq('facility_id', facilityId)
        .order('display_order', { ascending: true });
      
      if (error) throw error;
      return data as FacilityImage[];
    },
    enabled: !!facilityId,
  });

  const uploadMutation = useMutation({
    mutationFn: async (files: File[]) => {
      const uploadedImages = [];
      
      for (const file of files) {
        // Upload to Supabase Storage
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random()}.${fileExt}`;
        const filePath = `facility-images/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('facility-images')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        // Get public URL
        const { data } = supabase.storage
          .from('facility-images')
          .getPublicUrl(filePath);

        // Save to database
        const { data: imageRecord, error: dbError } = await supabase
          .from('facility_images')
          .insert({
            facility_id: facilityId,
            image_url: data.publicUrl,
            alt_text: file.name,
            display_order: (images?.length || 0) + uploadedImages.length,
            is_featured: !images?.length && uploadedImages.length === 0, // First image is featured
            file_size: file.size,
          })
          .select()
          .single();

        if (dbError) throw dbError;
        uploadedImages.push(imageRecord);
      }
      
      return uploadedImages;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['facility-images', facilityId] });
      setUploadingFiles([]);
      toast({
        title: "Success",
        description: "Images uploaded successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to upload images",
        variant: "destructive",
      });
    },
  });

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
      setEditingImage(null);
      toast({
        title: "Success",
        description: "Image updated successfully",
      });
    },
  });

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
      // First, remove featured status from all images
      await supabase
        .from('facility_images')
        .update({ is_featured: false })
        .eq('facility_id', facilityId);
      
      // Then set the selected image as featured
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

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const validFiles = files.filter(file => 
      file.type.startsWith('image/') && file.size <= 10 * 1024 * 1024 // 10MB limit
    );
    
    if (validFiles.length !== files.length) {
      toast({
        title: "Warning",
        description: "Some files were skipped (only images under 10MB are allowed)",
        variant: "destructive",
      });
    }
    
    setUploadingFiles(validFiles);
  };

  const handleUpload = () => {
    if (uploadingFiles.length > 0) {
      uploadMutation.mutate(uploadingFiles);
    }
  };

  const featuredImage = images?.find(img => img.is_featured);

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle>Upload New Images</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="image-upload">Select Images</Label>
            <Input
              id="image-upload"
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileUpload}
              className="mt-2"
            />
            <p className="text-sm text-muted-foreground mt-1">
              Select multiple images (max 10MB each). First image will be set as featured automatically.
            </p>
          </div>
          
          {uploadingFiles.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium">Files to upload:</h4>
              {uploadingFiles.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-2 border rounded">
                  <span className="text-sm">{file.name}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setUploadingFiles(prev => prev.filter((_, i) => i !== index))}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              <Button 
                onClick={handleUpload} 
                disabled={uploadMutation.isPending}
                className="w-full"
              >
                <Upload className="w-4 h-4 mr-2" />
                {uploadMutation.isPending ? "Uploading..." : "Upload Images"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Current Images */}
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
          ) : !images?.length ? (
            <div className="text-center py-8 text-muted-foreground">
              No images uploaded yet. Upload some images to get started.
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {images.map((image) => (
                <div key={image.id} className="relative group">
                  <div className="aspect-square relative overflow-hidden rounded-lg border">
                    <img
                      src={image.image_url}
                      alt={image.alt_text || 'Facility image'}
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Featured badge */}
                    {image.is_featured && (
                      <Badge className="absolute top-2 left-2 bg-yellow-500">
                        <Star className="w-3 h-3 mr-1" />
                        Featured
                      </Badge>
                    )}
                    
                    {/* Action buttons */}
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
                        onClick={() => setEditingImage(image)}
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
                  
                  {/* Image info */}
                  <div className="mt-2 text-xs text-muted-foreground">
                    <div>Order: {image.display_order}</div>
                    {image.caption && <div>Caption: {image.caption}</div>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Image Dialog */}
      {editingImage && (
        <Dialog open={true} onOpenChange={() => setEditingImage(null)}>
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
                <Button variant="outline" onClick={() => setEditingImage(null)}>
                  Cancel
                </Button>
                <Button onClick={() => updateImageMutation.mutate(editingImage)}>
                  Save Changes
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};
