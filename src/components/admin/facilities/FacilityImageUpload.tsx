
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { Input } from "@/components/ui/input";

interface FacilityImageUploadProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
}

const FacilityImageUpload: React.FC<FacilityImageUploadProps> = ({
  images,
  onImagesChange,
  maxImages = 5
}) => {
  const [dragOver, setDragOver] = useState(false);

  const handleFileUpload = (files: FileList | null) => {
    if (!files) return;

    const fileArray = Array.from(files);
    const validFiles = fileArray.filter(file => file.type.startsWith('image/'));
    
    if (validFiles.length === 0) {
      alert('Vennligst velg kun bildefiler');
      return;
    }

    if (images.length + validFiles.length > maxImages) {
      alert(`Du kan maksimalt laste opp ${maxImages} bilder`);
      return;
    }

    // Convert files to URLs for preview (in a real app, you'd upload to storage)
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newImageUrl = e.target?.result as string;
        onImagesChange([...images, newImageUrl]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleUrlAdd = (url: string) => {
    if (url.trim() && images.length < maxImages) {
      onImagesChange([...images, url.trim()]);
    }
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFileUpload(e.dataTransfer.files);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Bilder ({images.length}/{maxImages})</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Upload area */}
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            dragOver 
              ? 'border-blue-400 bg-blue-50' 
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <ImageIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <div className="text-base text-gray-600 mb-4">
            Dra og slipp bilder her, eller
          </div>
          <Input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => handleFileUpload(e.target.files)}
            className="hidden"
            id="file-upload"
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => document.getElementById('file-upload')?.click()}
            disabled={images.length >= maxImages}
            className="text-base px-4 py-2"
          >
            <Upload className="w-4 h-4 mr-2" />
            Velg filer
          </Button>
        </div>

        {/* URL input */}
        <div>
          <label className="block text-base font-medium text-gray-700 mb-2">
            Eller legg til bilde-URL
          </label>
          <div className="flex space-x-2">
            <Input
              type="url"
              placeholder="https://example.com/image.jpg"
              className="flex-1 h-10 text-base"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleUrlAdd((e.target as HTMLInputElement).value);
                  (e.target as HTMLInputElement).value = '';
                }
              }}
            />
            <Button
              type="button"
              variant="outline"
              onClick={(e) => {
                const input = (e.target as HTMLElement).previousElementSibling as HTMLInputElement;
                handleUrlAdd(input.value);
                input.value = '';
              }}
              disabled={images.length >= maxImages}
              className="text-base px-4 py-2"
            >
              Legg til
            </Button>
          </div>
        </div>

        {/* Image preview */}
        {images.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {images.map((image, index) => (
              <div key={index} className="relative group">
                <img
                  src={image}
                  alt={`Fasilitets bilde ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg border"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/placeholder-image.jpg';
                  }}
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity w-8 h-8 p-0"
                >
                  <X className="w-4 h-4" />
                </Button>
                {index === 0 && (
                  <div className="absolute bottom-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                    Hovedbilde
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FacilityImageUpload;
