
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { useTranslation } from "@/i18n";
import { FacilityCardImage } from "./FacilityCardImage";
import { FacilityCardContent } from "./FacilityCardContent";

interface Facility {
  id: number;
  name: string;
  address: string;
  type: string;
  image: string;
  nextAvailable: string;
  capacity: number;
  accessibility: string[];
  area: string;
  suitableFor: string[];
  equipment: string[];
  openingHours: string;
  description: string;
  availableTimes?: {
    date: Date;
    slots: {
      start: string;
      end: string;
      available: boolean;
    }[];
  }[];
}

interface FacilityCardProps {
  facility: Facility;
  onAddressClick: (e: React.MouseEvent, facility: Facility) => void;
}

export function FacilityCard({ facility, onAddressClick }: FacilityCardProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [isFavorited, setIsFavorited] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: facility.name,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFavorited(!isFavorited);
  };

  return (
    <Card 
      className="group overflow-hidden hover:shadow-2xl transition-all duration-500 hover:translate-y-[-8px] border-0 shadow-lg bg-white relative cursor-pointer focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 h-full flex flex-col"
      onClick={() => navigate(`/facilities/${facility.id}`)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role="button"
      tabIndex={0}
      aria-label={t('facility.actions.viewDetails', { name: facility.name, address: facility.address })}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          navigate(`/facilities/${facility.id}`);
        }
      }}
    >
      <FacilityCardImage
        facility={facility}
        isFavorited={isFavorited}
        onFavorite={handleFavorite}
        onShare={handleShare}
      />
      
      <div className="flex-1 flex flex-col">
        <FacilityCardContent
          facility={facility}
          onAddressClick={onAddressClick}
        />
      </div>

      {/* Hover Effect Border */}
      <div className={`absolute inset-0 rounded-xl border-2 border-blue-400 transition-opacity duration-300 pointer-events-none ${isHovered ? 'opacity-100' : 'opacity-0'}`} />
    </Card>
  );
}
