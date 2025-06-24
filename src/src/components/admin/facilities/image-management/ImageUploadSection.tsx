
import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { FacilityImage } from "@/types/facility";

interface ImageUploadSectionProps {
  facilityId: number;
  existingImagesCount: number;
}

export const ImageUploadSection: React.FC<ImageUploadSectionProps> = ({
  facilityId,
  existingImagesCount
}) => {
  const [uploadingFiles, setUploadingFiles] = useState<File[]>([]);
  const queryClient = useQueryClient();

  const uploadMutation = useMutation({
    mutationFn: async (files: File[]) => {
      const uploadedImages = [];
      
      for (const file of files) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random()}.${fileExt}`;
        const filePath = `facility-images/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('facility-images')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage
          .from('facility-images')
          .getPublicUrl(filePath);

        const { data: imageRecord, error: dbError } = await supabase
          .from('facility_images')
          .insert({
            facility_id: facilityId,
            image_url: data.publicUrl,
            alt_text: file.name,
            display_order: existingImagesCount + uploadedImages.length,
            is_featured: !existingImagesCount && uploadedImages.length === 0,
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

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const validFiles = files.filter(file => 
      file.type.startsWith('image/') && file.size <= 10 * 1024 * 1024
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

  return (
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
  );
};
