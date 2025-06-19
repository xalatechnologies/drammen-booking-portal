
import React from "react";
import { Grid3x3 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface GalleryGridProps {
  images: string[];
  facilityName: string;
  onImageClick: (index: number) => void;
  onShowAllClick: () => void;
}

export function GalleryGrid({ images, facilityName, onImageClick, onShowAllClick }: GalleryGridProps) {
  return (
    <div className="hidden md:block h-96 w-full relative cursor-pointer rounded-xl overflow-hidden shadow-lg group" onClick={() => onImageClick(0)}>
      <img 
        src={images[0]} 
        alt={`${facilityName} - Main view`}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      
      {/* Gradient overlay for better contrast */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* Show all photos button - only show if more than 1 image */}
      {images.length > 1 && (
        <div className="absolute bottom-6 right-6">
          <Button
            variant="secondary"
            size="sm"
            className="bg-white/95 hover:bg-white text-gray-900 shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-sm border border-white/20 rounded-lg hover:scale-105"
            onClick={(e) => {
              e.stopPropagation();
              onShowAllClick();
            }}
          >
            <Grid3x3 className="h-4 w-4 mr-2" />
            Show all {images.length} photos
          </Button>
        </div>
      )}

      {/* Dots indicator - only show if more than 1 image */}
      {images.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3">
          {images.slice(0, 5).map((_, index) => (
            <div
              key={index}
              className="w-2.5 h-2.5 rounded-full bg-white/60 transition-all duration-300"
            />
          ))}
          {images.length > 5 && (
            <span className="text-white/80 text-sm ml-2 font-medium">
              +{images.length - 5} more
            </span>
          )}
        </div>
      )}
    </div>
  );
}
