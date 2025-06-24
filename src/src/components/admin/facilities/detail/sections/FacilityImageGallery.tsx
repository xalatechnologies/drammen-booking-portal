
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Upload, Star, Edit, Trash2 } from "lucide-react";

interface FacilityImageGalleryProps {
  facility: any;
}

export const FacilityImageGallery: React.FC<FacilityImageGalleryProps> = ({ facility }) => {
  // Mock images data - replace with real data
  const images = [
    {
      id: '1',
      image_url: '/lovable-uploads/facility1.jpg',
      alt_text: 'Main hall view',
      is_featured: true,
      display_order: 1
    },
    {
      id: '2',
      image_url: '/lovable-uploads/facility2.jpg',
      alt_text: 'Equipment room',
      is_featured: false,
      display_order: 2
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Image Gallery</h2>
        <Button>
          <Upload className="h-4 w-4 mr-2" />
          Upload Images
        </Button>
      </div>

      {images.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Upload className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Images Uploaded</h3>
            <p className="text-gray-600 mb-4">
              Upload images to showcase this facility to potential visitors.
            </p>
            <Button>
              <Upload className="h-4 w-4 mr-2" />
              Upload First Image
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
                  alt={image.alt_text}
                  className="w-full h-48 object-cover"
                />
                {image.is_featured && (
                  <Badge className="absolute top-2 left-2 bg-yellow-500">
                    <Star className="h-3 w-3 mr-1" />
                    Featured
                  </Badge>
                )}
                <div className="absolute top-2 right-2 flex space-x-1">
                  <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="destructive" className="h-8 w-8 p-0">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <CardContent className="p-3">
                <p className="text-sm text-gray-600">{image.alt_text}</p>
                <p className="text-xs text-gray-500 mt-1">Order: {image.display_order}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Upload Guidelines */}
      <Card>
        <CardHeader>
          <CardTitle>Image Guidelines</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-gray-600 space-y-2">
            <p>• Upload high-quality images (minimum 1024x768 pixels)</p>
            <p>• Supported formats: JPEG, PNG, WebP</p>
            <p>• Maximum file size: 5MB per image</p>
            <p>• Set one image as featured to display in facility listings</p>
            <p>• Arrange images in display order for best presentation</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
