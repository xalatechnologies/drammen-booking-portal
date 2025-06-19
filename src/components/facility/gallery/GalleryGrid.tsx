
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
    <div className="hidden md:grid md:grid-cols-4 gap-2 h-96 w-full">
      {/* Main Image - Takes up 2 columns */}
      <div 
        className="col-span-2 relative cursor-pointer overflow-hidden group/main"
        onClick={() => onImageClick(0)}
      >
        <img 
          src={images[0]} 
          alt={`${facilityName} - Main view`}
          className="w-full h-full object-cover transition-transform duration-300 group-hover/main:scale-105"
        />
        <div className="absolute inset-0 bg-black/0 group-hover/main:bg-black/10 transition-colors duration-300" />
      </div>
      
      {/* Grid of 4 smaller images */}
      <div className="col-span-2 grid grid-cols-2 gap-2">
        {images.slice(1, 5).map((image, index) => (
          <div 
            key={index + 1}
            className="relative cursor-pointer overflow-hidden group/grid"
            onClick={() => onImageClick(index + 1)}
          >
            <img 
              src={image} 
              alt={`${facilityName} - View ${index + 2}`}
              className="w-full h-full object-cover transition-transform duration-300 group-hover/grid:scale-105"
            />
            <div className="absolute inset-0 bg-black/0 group-hover/grid:bg-black/10 transition-colors duration-300" />
            
            {/* Show all photos button on last image */}
            {index === 3 && images.length > 5 && (
              <div className="absolute inset-0 bg-black/40 group-hover/grid:bg-black/50 transition-colors duration-300">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="bg-white hover:bg-gray-100 text-gray-900 shadow-lg font-medium"
                    onClick={(e) => {
                      e.stopPropagation();
                      onShowAllClick();
                    }}
                  >
                    <Grid3x3 className="h-4 w-4 mr-2" />
                    Show all {images.length} photos
                  </Button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
