
import React, { useState } from "react";
import { GalleryGrid } from "./gallery/GalleryGrid";
import { MobileGallery } from "./gallery/MobileGallery";
import { GalleryControls } from "./gallery/GalleryControls";
import { GalleryModal } from "./gallery/GalleryModal";

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
      <div className="relative overflow-hidden group w-full">
        <GalleryGrid
          images={images}
          facilityName={facilityName}
          activeImageIndex={activeImageIndex}
          onImageClick={openModal}
          onShowAllClick={() => openModal()}
          onPrevImage={prevImage}
          onNextImage={nextImage}
        />

        <MobileGallery
          images={images}
          facilityName={facilityName}
          activeImageIndex={activeImageIndex}
          onImageClick={() => openModal(0)}
          onPrevImage={prevImage}
          onNextImage={nextImage}
          onShowAllClick={() => openModal()}
          onThumbnailClick={setActiveImageIndex}
        />

        <GalleryControls
          facilityName={facilityName}
          onShare={handleShare}
        />
      </div>

      {showModal && (
        <GalleryModal
          images={images}
          facilityName={facilityName}
          activeImageIndex={activeImageIndex}
          onClose={closeModal}
          onPrevImage={prevImage}
          onNextImage={nextImage}
          onImageSelect={setActiveImageIndex}
          onShare={handleShare}
        />
      )}
    </>
  );
}
