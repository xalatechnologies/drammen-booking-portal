
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, Image, Trash2 } from 'lucide-react';

interface FacilityImageManagementProps {
  facilityId: number;
}

export function FacilityImageManagement({ facilityId }: FacilityImageManagementProps) {
  const handleUploadImage = () => {
    console.log('Upload image for facility:', facilityId);
  };

  const handleDeleteImage = (imageId: string) => {
    console.log('Delete image:', imageId);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image className="h-5 w-5" />
            Image Management
          </div>
          <Button onClick={handleUploadImage} size="sm">
            <Upload className="h-4 w-4 mr-2" />
            Upload Images
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8">
          <Image className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 mb-2">No images uploaded yet</p>
          <p className="text-sm text-gray-400">
            Upload images to showcase this facility
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
