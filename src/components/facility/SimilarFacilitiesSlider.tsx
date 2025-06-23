
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { FacilityCard } from "@/components/facility/FacilityCard";
import { useTranslation } from "@/i18n/hooks/useTranslation";
import { useFacilities } from "@/hooks/useFacilities";
import { transformFacilitiesForUI } from "@/utils/facilityTransforms";

interface SimilarFacilitiesSliderProps {
  currentFacilityId: string;
}

export function SimilarFacilitiesSlider({ currentFacilityId }: SimilarFacilitiesSliderProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();

  // Use the facilities hook to get facility data
  const { data: rawFacilities = [] } = useFacilities();

  // Transform and filter facilities
  const similarFacilities = React.useMemo(() => {
    const transformed = transformFacilitiesForUI(rawFacilities);
    return transformed
      .filter(facility => facility.id.toString() !== currentFacilityId)
      .slice(0, 5);
  }, [rawFacilities, currentFacilityId]);

  const handleAddressClick = (e: React.MouseEvent, facility: any) => {
    e.stopPropagation();
    console.log('Show map for:', facility.address);
  };

  if (similarFacilities.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">{t('facility.similar.title')}</h2>
        <Button variant="outline" onClick={() => navigate("/")}>
          {t('facility.similar.viewAll')}
        </Button>
      </div>
      
      <Carousel className="w-full">
        <CarouselContent className="-ml-2 md:-ml-4">
          {similarFacilities.map((facility) => (
            <CarouselItem key={facility.id} className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3">
              <FacilityCard 
                facility={facility}
                onAddressClick={handleAddressClick}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden md:flex" />
        <CarouselNext className="hidden md:flex" />
      </Carousel>
    </div>
  );
}
