
import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";

interface FacilityImageGalleryProps {
  images: string[];
}

export function FacilityImageGallery({ images }: FacilityImageGalleryProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const nextImage = () => {
    setActiveImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setActiveImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <>
      {/* Image Gallery with Navigation */}
      <div className="relative rounded-lg overflow-hidden mb-4">
        <div className="h-80 relative">
          {images.map((img, i) => (
            <div 
              key={i} 
              className={`absolute top-0 left-0 w-full h-full transition-opacity duration-500 ${
                i === activeImageIndex ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
            >
              <img 
                src={img} 
                alt={`Facility image ${i+1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
          
          {/* Navigation arrows */}
          <button 
            onClick={prevImage}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full"
            aria-label="Forrige bilde"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <button 
            onClick={nextImage}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full"
            aria-label="Neste bilde"
          >
            <ArrowLeft className="h-5 w-5 transform rotate-180" />
          </button>
          
          {/* Image counter */}
          <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
            {activeImageIndex + 1} / {images.length}
          </div>
        </div>
      </div>
      
      {/* Thumbnail Gallery */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {images.map((img, i) => (
          <button 
            key={i} 
            onClick={() => setActiveImageIndex(i)}
            className={`rounded-md overflow-hidden h-16 w-24 flex-shrink-0 border-2 transition
              ${activeImageIndex === i ? 'border-blue-600' : 'border-transparent hover:border-gray-300'}`}
          >
            <img 
              src={img} 
              alt={`Thumbnail ${i+1}`}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
    </>
  );
}
