
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, Image } from 'lucide-react';

interface FacilityImageGalleryProps {
  facilityId: number;
  images?: any[];
}

export function FacilityImageGallery({ facilityId, images = [] }: FacilityImageGalleryProps) {
  const handleUploadImage = () => {
    console.log('Upload image for facility:', facilityId);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image className="h-5 w-5" />
            Image Gallery
          </div>
          <Button onClick={handleUploadImage} size="sm">
            <Upload className="h-4 w-4 mr-2" />
            Upload Image
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {images.length === 0 ? (
          <div className="text-center py-8">
            <Image className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-2">No images uploaded yet</p>
            <p className="text-sm text-gray-400">
              Upload images to showcase this facility
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((image, index) => (
              <div key={index} className="aspect-square rounded-lg overflow-hidden">
                <img 
                  src={image.url} 
                  alt={image.alt || `Facility image ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
