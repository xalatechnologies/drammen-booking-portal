
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
    <div className="hidden md:grid md:grid-cols-4 gap-3 h-96 w-full">
      {/* Main Image - Takes up 2 columns */}
      <div 
        className="col-span-2 relative cursor-pointer overflow-hidden rounded-l-xl group/main shadow-lg hover:shadow-xl transition-all duration-300"
        onClick={() => onImageClick(0)}
      >
        <img 
          src={images[0]} 
          alt={`${facilityName} - Main view`}
          className="w-full h-full object-cover transition-transform duration-500 group-hover/main:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover/main:opacity-100 transition-opacity duration-300" />
        <div className="absolute inset-0 bg-black/0 group-hover/main:bg-black/10 transition-colors duration-300" />
      </div>
      
      {/* Grid of 4 smaller images */}
      <div className="col-span-2 grid grid-cols-2 gap-3">
        {images.slice(1, 5).map((image, index) => (
          <div 
            key={index + 1}
            className={`relative cursor-pointer overflow-hidden group/grid shadow-md hover:shadow-lg transition-all duration-300 ${
              index === 1 ? 'rounded-tr-xl' : 
              index === 3 ? 'rounded-br-xl' : 
              'rounded-md'
            }`}
            onClick={() => onImageClick(index + 1)}
          >
            <img 
              src={image} 
              alt={`${facilityName} - View ${index + 2}`}
              className="w-full h-full object-cover transition-transform duration-500 group-hover/grid:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover/grid:opacity-100 transition-opacity duration-300" />
            <div className="absolute inset-0 bg-black/0 group-hover/grid:bg-black/10 transition-colors duration-300" />
            
            {/* Show all photos button on last image */}
            {index === 3 && images.length > 5 && (
              <div className="absolute inset-0 bg-black/40 group-hover/grid:bg-black/50 transition-colors duration-300">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="bg-white/95 hover:bg-white text-gray-900 shadow-xl font-medium backdrop-blur-sm border border-white/20 rounded-lg transition-all duration-300 hover:scale-105"
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
