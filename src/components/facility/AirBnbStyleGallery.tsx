import React, { useState } from "react";
import { ArrowLeft, ArrowRight, X, Grid3x3, ChevronLeft, ChevronRight, Share2 } from "lucide-react";
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

  const openModal = (index?: number) => {
    if (typeof index === 'number') {
      setActiveImageIndex(index);
    }
    setShowModal(true);
  };

  const closeModal = () => setShowModal(false);

  // Handle keyboard navigation
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!showModal) return;
      if (e.key === 'Escape') closeModal();
      if (e.key === 'ArrowLeft') prevImage();
      if (e.key === 'ArrowRight') nextImage();
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [showModal]);

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: facilityName,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <>
      {/* Airbnb-Style Grid Layout - Full Width */}
      <div className="relative overflow-hidden group w-full">
        {/* Desktop Grid Layout */}
        <div className="hidden md:grid md:grid-cols-4 gap-2 h-96 w-full">
          {/* Main Image - Takes up 2 columns */}
          <div 
            className="col-span-2 relative cursor-pointer overflow-hidden group/main"
            onClick={() => openModal(0)}
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
                onClick={() => openModal(index + 1)}
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
                          openModal();
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

        {/* Mobile Layout - Single main image */}
        <div className="md:hidden h-64 relative cursor-pointer w-full" onClick={() => openModal(0)}>
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
                  prevImage();
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-900 p-2 rounded-full shadow-lg"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  nextImage();
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
                openModal();
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

        {/* Floating Action Buttons */}
        <div className="absolute top-6 right-6 flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            className="bg-white/95 hover:bg-white text-gray-900 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            onClick={handleShare}
          >
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Enhanced Full-screen Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/95 z-50 flex flex-col">
          {/* Modal Header */}
          <div className="flex items-center justify-between p-6 text-white">
            <button
              onClick={closeModal}
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
              onClick={handleShare}
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
          </div>
          
          {/* Thumbnail Strip */}
          {images.length > 1 && (
            <div className="px-6 pb-6">
              <div className="flex gap-3 justify-center overflow-x-auto pb-2">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImageIndex(index)}
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
      )}
    </>
  );
}
