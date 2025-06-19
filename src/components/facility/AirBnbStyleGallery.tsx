
import React, { useState } from "react";
import { ArrowLeft, ArrowRight, X, Grid3x3, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AirBnbStyleGalleryProps {
  images: string[];
  facilityName: string;
}

export function AirBnbStyleGallery({ images, facilityName }: AirBnbStyleGalleryProps) {
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
      {/* Main Image Display - AirBnB Style */}
      <div className="relative rounded-xl overflow-hidden group cursor-pointer" onClick={openModal}>
        <div className="h-96 relative">
          <img 
            src={images[activeImageIndex]} 
            alt={`${facilityName} - Image ${activeImageIndex + 1}`}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* View all photos button */}
          <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Button
              variant="secondary"
              size="sm"
              className="bg-white/95 hover:bg-white text-gray-900 shadow-lg"
              onClick={(e) => {
                e.stopPropagation();
                openModal();
              }}
            >
              <Grid3x3 className="h-4 w-4 mr-2" />
              View all {images.length} photos
            </Button>
          </div>
          
          {/* Navigation arrows - only show if multiple images */}
          {images.length > 1 && (
            <>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  prevImage();
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-900 p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  nextImage();
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-900 p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
                aria-label="Next image"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}
          
          {/* Dots indicator - AirBnB style */}
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
      </div>

      {/* Full-screen Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center">
          <div className="relative w-full h-full flex items-center justify-center p-4">
            {/* Close button */}
            <button
              onClick={closeModal}
              className="absolute top-6 right-6 text-white hover:text-gray-300 z-10 p-2 rounded-full bg-black/20 hover:bg-black/40 transition-colors"
              aria-label="Close gallery"
            >
              <X className="h-6 w-6" />
            </button>
            
            {/* Image counter */}
            <div className="absolute top-6 left-6 text-white bg-black/20 px-4 py-2 rounded-full text-sm font-medium z-10">
              {activeImageIndex + 1} / {images.length}
            </div>
            
            {/* Image */}
            <img
              src={images[activeImageIndex]}
              alt={`${facilityName} - Image ${activeImageIndex + 1}`}
              className="max-w-full max-h-full object-contain rounded-lg"
            />
            
            {/* Navigation in modal */}
            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-6 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 p-4 rounded-full bg-black/20 hover:bg-black/40 transition-colors"
                  aria-label="Previous image"
                >
                  <ArrowLeft className="h-6 w-6" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-6 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 p-4 rounded-full bg-black/20 hover:bg-black/40 transition-colors"
                  aria-label="Next image"
                >
                  <ArrowRight className="h-6 w-6" />
                </button>
              </>
            )}
            
            {/* Dots in modal */}
            {images.length > 1 && (
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImageIndex(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === activeImageIndex 
                        ? 'bg-white' 
                        : 'bg-white/50 hover:bg-white/75'
                    }`}
                    aria-label={`View image ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
