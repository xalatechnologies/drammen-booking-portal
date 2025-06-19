
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
    <div className="md:hidden h-64 relative cursor-pointer w-full rounded-xl overflow-hidden shadow-lg" onClick={onImageClick}>
      <img 
        src={images[activeImageIndex]} 
        alt={`${facilityName} - Image ${activeImageIndex + 1}`}
        className="w-full h-full object-cover transition-transform duration-500"
      />
      
      {/* Gradient overlay for better contrast */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/10" />
      
      {/* Mobile navigation - only show if more than 1 image */}
      {images.length > 1 && (
        <>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onPrevImage();
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-900 p-3 rounded-full shadow-xl backdrop-blur-sm border border-white/20 transition-all duration-300 hover:scale-110"
            aria-label="Previous image"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onNextImage();
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-900 p-3 rounded-full shadow-xl backdrop-blur-sm border border-white/20 transition-all duration-300 hover:scale-110"
            aria-label="Next image"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </>
      )}
      
      {/* Mobile show all button - only show if more than 1 image */}
      {images.length > 1 && (
        <div className="absolute bottom-4 right-4">
          <Button
            variant="secondary"
            size="sm"
            className="bg-white/95 hover:bg-white text-gray-900 shadow-xl backdrop-blur-sm border border-white/20 rounded-lg transition-all duration-300 hover:scale-105"
            onClick={(e) => {
              e.stopPropagation();
              onShowAllClick();
            }}
          >
            <Grid3x3 className="h-4 w-4 mr-2" />
            {images.length} photos
          </Button>
        </div>
      )}
      
      {/* Mobile dots indicator - only show if more than 1 image */}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={(e) => {
                e.stopPropagation();
                onDotClick(index);
              }}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 backdrop-blur-sm ${
                index === activeImageIndex 
                  ? 'bg-white scale-125 shadow-lg' 
                  : 'bg-white/60 hover:bg-white/80 hover:scale-110'
              }`}
              aria-label={`View image ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
