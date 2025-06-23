
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Upload, Star, Edit, Trash2, Eye } from "lucide-react";
import { FacilityImageService } from "@/services/facilityImageService";
import { FacilityDataUtils } from "@/utils/facilityDataUtils";
import { useTranslation } from "@/hooks/useTranslation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface FacilityImageGalleryProps {
  facility: any;
}

export const FacilityImageGallery: React.FC<FacilityImageGalleryProps> = ({ facility }) => {
  const { tSync } = useTranslation();

  // Fetch real images from the database
  const { data: images = [], isLoading, error } = useQuery({
    queryKey: ['facility-images', facility.id],
    queryFn: () => FacilityImageService.getFacilityImages(facility.id),
    enabled: !!facility.id,
  });

  console.log('FacilityImageGallery - Facility ID:', facility.id);
  console.log('FacilityImageGallery - Images loaded:', images);

  const featuredImage = images.find(img => img.is_featured);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">
            {tSync("admin.facilities.images.gallery", "Image Gallery")}
          </h2>
          <Button disabled>
            <Upload className="h-4 w-4 mr-2" />
            {tSync("admin.facilities.images.upload", "Upload Images")}
          </Button>
        </div>
        <Card>
          <CardContent className="p-8 text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/4 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">
            {tSync("admin.facilities.images.gallery", "Image Gallery")}
          </h2>
          <Button>
            <Upload className="h-4 w-4 mr-2" />
            {tSync("admin.facilities.images.upload", "Upload Images")}
          </Button>
        </div>
        <Card>
          <CardContent className="p-8 text-center">
            <div className="text-red-500">
              {tSync("admin.facilities.images.loadError", "Error loading images")}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">
            {tSync("admin.facilities.images.gallery", "Image Gallery")}
          </h2>
          {featuredImage && (
            <Badge variant="outline" className="mt-2 flex items-center gap-1 w-fit">
              <Star className="w-3 h-3" />
              {tSync("admin.facilities.images.featured", "Featured")}: {featuredImage.alt_text}
            </Badge>
          )}
        </div>
        <Button>
          <Upload className="h-4 w-4 mr-2" />
          {tSync("admin.facilities.images.upload", "Upload Images")}
        </Button>
      </div>

      {images.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Upload className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {tSync("admin.facilities.images.noImages", "No Images Uploaded")}
            </h3>
            <p className="text-gray-600 mb-4">
              {tSync("admin.facilities.images.uploadDescription", "Upload images to showcase this facility to potential visitors.")}
            </p>
            <Button>
              <Upload className="h-4 w-4 mr-2" />
              {tSync("admin.facilities.images.uploadFirst", "Upload First Image")}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {images.map((image) => (
            <Card key={image.id} className="overflow-hidden">
              <div className="relative">
                <img
                  src={image.image_url}
                  alt={image.alt_text || 'Facility image'}
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    console.error('Image failed to load:', image.image_url);
                    // Use a fallback image from the local bilder directory
                    e.currentTarget.src = FacilityDataUtils.getFallbackImageUrl(0);
                  }}
                />
                {image.is_featured && (
                  <Badge className="absolute top-2 left-2 bg-yellow-500">
                    <Star className="h-3 w-3 mr-1" />
                    {tSync("admin.facilities.images.featured", "Featured")}
                  </Badge>
                )}
                <div className="absolute top-2 right-2 flex space-x-1">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>
                          {tSync("admin.facilities.images.preview", "Image Preview")}
                        </DialogTitle>
                      </DialogHeader>
                      <img
                        src={image.image_url}
                        alt={image.alt_text || 'Facility image'}
                        className="w-full h-auto max-h-96 object-contain"
                      />
                    </DialogContent>
                  </Dialog>
                  <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="destructive" className="h-8 w-8 p-0">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <CardContent className="p-3">
                <p className="text-sm text-gray-600">{image.alt_text || 'No description'}</p>
                <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
                  <span>Order: {image.display_order}</span>
                  {image.file_size && (
                    <span>{Math.round(image.file_size / 1024)} KB</span>
                  )}
                </div>
                {image.caption && (
                  <p className="text-xs text-gray-500 mt-1 italic">{image.caption}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Upload Guidelines */}
      <Card>
        <CardHeader>
          <CardTitle>
            {tSync("admin.facilities.images.guidelines", "Image Guidelines")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-gray-600 space-y-2">
            <p>• {tSync("admin.facilities.images.guideline1", "Upload high-quality images (minimum 1024x768 pixels)")}</p>
            <p>• {tSync("admin.facilities.images.guideline2", "Supported formats: JPEG, PNG, WebP")}</p>
            <p>• {tSync("admin.facilities.images.guideline3", "Maximum file size: 5MB per image")}</p>
            <p>• {tSync("admin.facilities.images.guideline4", "Set one image as featured to display in facility listings")}</p>
            <p>• {tSync("admin.facilities.images.guideline5", "Arrange images in display order for best presentation")}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
