
import React from "react";
import { ArrowLeft, ArrowRight, X, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface GalleryModalProps {
  images: string[];
  facilityName: string;
  activeImageIndex: number;
  onClose: () => void;
  onPrevImage: () => void;
  onNextImage: () => void;
  onImageSelect: (index: number) => void;
  onShare: (e: React.MouseEvent) => void;
}

export function GalleryModal({ 
  images, 
  facilityName, 
  activeImageIndex, 
  onClose, 
  onPrevImage, 
  onNextImage, 
  onImageSelect,
  onShare 
}: GalleryModalProps) {
  return (
    <div className="fixed inset-0 bg-black/95 z-50 flex flex-col">
      {/* Modal Header */}
      <div className="flex items-center justify-between p-6 text-white">
        <button
          onClick={onClose}
          className="p-2 rounded-full hover:bg-white/10 transition-colors"
          aria-label="Close gallery"
        >
          <X className="h-6 w-6" />
        </button>
        
        <div className="text-center">
          <span className="text-sm font-medium">
            {activeImageIndex + 1} / {images.length}
          </span>
        </div>
        
        <Button
          variant="secondary"
          size="sm"
          className="bg-white/10 hover:bg-white/20 text-white border-white/20"
          onClick={onShare}
        >
          <Share2 className="h-4 w-4 mr-2" />
          Share
        </Button>
      </div>
      
      {/* Main Image Area */}
      <div className="flex-1 flex items-center justify-center relative px-6 pb-6">
        <img
          src={images[activeImageIndex]}
          alt={`${facilityName} - Image ${activeImageIndex + 1}`}
          className="max-w-full max-h-full object-contain rounded-lg"
        />
        
        {/* Navigation in modal */}
        {images.length > 1 && (
          <>
            <button
              onClick={onPrevImage}
              className="absolute left-6 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 p-4 rounded-full bg-black/20 hover:bg-black/40 transition-colors"
              aria-label="Previous image"
            >
              <ArrowLeft className="h-6 w-6" />
            </button>
            <button
              onClick={onNextImage}
              className="absolute right-6 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 p-4 rounded-full bg-black/20 hover:bg-black/40 transition-colors"
              aria-label="Next image"
            >
              <ArrowRight className="h-6 w-6" />
            </button>
          </>
        )}
      </div>
      
      {/* Thumbnail Strip */}
      {images.length > 1 && (
        <div className="px-6 pb-6">
          <div className="flex gap-3 justify-center overflow-x-auto pb-2">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => onImageSelect(index)}
                className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                  index === activeImageIndex 
                    ? 'border-white' 
                    : 'border-transparent hover:border-white/50'
                }`}
              >
                <img
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
