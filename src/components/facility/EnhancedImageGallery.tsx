
import React, { useState } from "react";
import { ArrowLeft, ArrowRight, X, Grid3x3 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EnhancedImageGalleryProps {
  images: string[];
  facilityName: string;
}

export function EnhancedImageGallery({ images, facilityName }: EnhancedImageGalleryProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);

  const nextImage = () => {
    setActiveImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setActiveImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  return (
    <>
      {/* Main Image Display */}
      <div className="relative rounded-xl overflow-hidden group cursor-pointer" onClick={openModal}>
        <div className="h-96 relative">
          <img 
            src={images[activeImageIndex]} 
            alt={`${facilityName} - Image ${activeImageIndex + 1}`}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          
          {/* Overlay with controls */}
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute top-4 right-4">
              <Button
                variant="secondary"
                size="sm"
                className="bg-white/90 hover:bg-white text-gray-900"
                onClick={(e) => {
                  e.stopPropagation();
                  openModal();
                }}
              >
                <Grid3x3 className="h-4 w-4 mr-2" />
                View All {images.length} Photos
              </Button>
            </div>
          </div>
          
          {/* Navigation arrows */}
          {images.length > 1 && (
            <>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  prevImage();
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-900 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                aria-label="Previous image"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  nextImage();
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-900 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                aria-label="Next image"
              >
                <ArrowRight className="h-5 w-5" />
              </button>
            </>
          )}
          
          {/* Dots indicator */}
          {images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveImageIndex(index);
                  }}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === activeImageIndex ? 'bg-white' : 'bg-white/50'
                  }`}
                  aria-label={`View image ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Full-screen Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
          <div className="relative w-full h-full flex items-center justify-center p-4">
            {/* Close button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
              aria-label="Close gallery"
            >
              <X className="h-8 w-8" />
            </button>
            
            {/* Image */}
            <img
              src={images[activeImageIndex]}
              alt={`${facilityName} - Image ${activeImageIndex + 1}`}
              className="max-w-full max-h-full object-contain"
            />
            
            {/* Navigation in modal */}
            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 p-2"
                  aria-label="Previous image"
                >
                  <ArrowLeft className="h-8 w-8" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 p-2"
                  aria-label="Next image"
                >
                  <ArrowRight className="h-8 w-8" />
                </button>
              </>
            )}
            
            {/* Image counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white bg-black/50 px-3 py-1 rounded-full text-sm">
              {activeImageIndex + 1} / {images.length}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
