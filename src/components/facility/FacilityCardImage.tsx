
import React from "react";
import { Heart, Share2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/i18n";

interface FacilityCardImageProps {
  facility: {
    id: number;
    name: string;
    image: string;
    type: string;
    area: string;
  };
  isFavorited: boolean;
  onFavorite: (e: React.MouseEvent) => void;
  onShare: (e: React.MouseEvent) => void;
}

export function FacilityCardImage({
  facility,
  isFavorited,
  onFavorite,
  onShare
}: FacilityCardImageProps) {
  const { t } = useTranslation();

  return (
    <div className="relative h-48 overflow-hidden">
      <img 
        src={facility.image} 
        alt={t('facility.image.alt', { name: facility.name })} 
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.src = "https://images.unsplash.com/photo-1525361147853-4bf9f54a0e98?w=600&auto=format&fit=crop";
          target.onerror = null;
        }}
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-80" />
      
      {/* Action Buttons */}
      <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
        <Button 
          variant="ghost" 
          size="sm" 
          className="bg-white/20 backdrop-blur-md hover:bg-white/30 text-white border-0 h-12 w-12 p-0 rounded-full focus:ring-2 focus:ring-white focus:ring-offset-2" 
          onClick={onFavorite} 
          aria-label={isFavorited ? t('facility.actions.removeFromFavorites') : t('facility.actions.addToFavorites')}
        >
          <Heart className={`h-5 w-5 ${isFavorited ? 'fill-red-500 text-red-500' : ''}`} />
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          className="bg-white/20 backdrop-blur-md hover:bg-white/30 text-white border-0 h-12 w-12 p-0 rounded-full focus:ring-2 focus:ring-white focus:ring-offset-2" 
          onClick={onShare} 
          aria-label={t('facility.actions.shareFacility')}
        >
          <Share2 className="h-5 w-5" />
        </Button>
      </div>

      {/* Type and Area Badges */}
      <div className="absolute top-4 left-4 flex flex-col gap-2">
        <Badge className="bg-white/95 backdrop-blur-sm text-gray-800 border-0 font-semibold px-4 py-2 text-base shadow-lg">
          {t(`facility.types.${facility.type}`, {}, facility.type)}
        </Badge>
      </div>

      {/* Facility Name Overlay */}
      <div className="absolute bottom-4 left-4 right-4">
        <h3 className="text-3xl font-bold text-white mb-2 drop-shadow-lg">
          {facility.name}
        </h3>
      </div>
    </div>
  );
}
