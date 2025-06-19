
import React from "react";
import { ChevronLeft, ChevronRight, Grid3x3 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MobileGalleryProps {
  images: string[];
  facilityName: string;
  activeImageIndex: number;
  onImageClick: () => void;
  onPrevImage: () => void;
  onNextImage: () => void;
  onShowAllClick: () => void;
  onDotClick: (index: number) => void;
}

export function MobileGallery({ 
  images, 
  facilityName, 
  activeImageIndex, 
  onImageClick, 
  onPrevImage, 
  onNextImage, 
  onShowAllClick,
  onDotClick 
}: MobileGalleryProps) {
  return (
    <div className="md:hidden h-64 relative cursor-pointer w-full" onClick={onImageClick}>
      <img 
        src={images[activeImageIndex]} 
        alt={`${facilityName} - Image ${activeImageIndex + 1}`}
        className="w-full h-full object-cover"
      />
      
      {/* Mobile navigation */}
      {images.length > 1 && (
        <>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onPrevImage();
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-900 p-2 rounded-full shadow-lg"
            aria-label="Previous image"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onNextImage();
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-900 p-2 rounded-full shadow-lg"
            aria-label="Next image"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </>
      )}
      
      {/* Mobile show all button */}
      <div className="absolute bottom-4 right-4">
        <Button
          variant="secondary"
          size="sm"
          className="bg-white/95 hover:bg-white text-gray-900 shadow-lg"
          onClick={(e) => {
            e.stopPropagation();
            onShowAllClick();
          }}
        >
          <Grid3x3 className="h-4 w-4 mr-2" />
          {images.length} photos
        </Button>
      </div>
      
      {/* Mobile dots indicator */}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={(e) => {
                e.stopPropagation();
                onDotClick(index);
              }}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === activeImageIndex 
                  ? 'bg-white scale-125' 
                  : 'bg-white/50 hover:bg-white/75'
              }`}
              aria-label={`View image ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
