
import React from "react";
import { Star, Users, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useNavigate } from "react-router-dom";

interface SimilarFacilitiesSliderProps {
  currentFacilityId: string;
}

export function SimilarFacilitiesSlider({ currentFacilityId }: SimilarFacilitiesSliderProps) {
  const navigate = useNavigate();

  // Mock data for similar facilities
  const similarFacilities = [
    {
      id: "3",
      name: "Gymsal 3 - Åssiden skole",
      address: "Åssiden 12, Drammen",
      image: "https://images.unsplash.com/photo-1580237072617-771c3ecc4a24?auto=format&fit=crop&w=400&q=80",
      rating: 4.6,
      reviewCount: 89,
      capacity: 25,
      pricePerHour: 400,
      type: "Gymsal",
      nextAvailable: "I dag 14:00"
    },
    {
      id: "7",
      name: "Gymsal 7 - Konnerud skole",
      address: "Konnerudgata 25, Drammen",
      image: "https://images.unsplash.com/photo-1516205651411-aef33a44f7c2?auto=format&fit=crop&w=400&q=80",
      rating: 4.7,
      reviewCount: 156,
      capacity: 30,
      pricePerHour: 450,
      type: "Gymsal",
      nextAvailable: "I morgen 08:00"
    },
    {
      id: "12",
      name: "Idrettshall - Strømsø",
      address: "Strømsø torg 8, Drammen",
      image: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?auto=format&fit=crop&w=400&q=80",
      rating: 4.9,
      reviewCount: 203,
      capacity: 50,
      pricePerHour: 650,
      type: "Idrettshall",
      nextAvailable: "I dag 16:00"
    },
    {
      id: "8",
      name: "Gymsal 8 - Bragernes skole",
      address: "Bragernes torg 2, Drammen",
      image: "/lovable-uploads/08e8f8d5-4126-4805-a56e-e4337f97dbd0.png",
      rating: 4.5,
      reviewCount: 67,
      capacity: 28,
      pricePerHour: 420,
      type: "Gymsal",
      nextAvailable: "I dag 18:00"
    },
    {
      id: "15",
      name: "Flerbrukshall - Svelvik",
      address: "Svelvik sentrum 15, Svelvik",
      image: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?auto=format&fit=crop&w=400&q=80",
      rating: 4.8,
      reviewCount: 134,
      capacity: 40,
      pricePerHour: 550,
      type: "Flerbrukshall",
      nextAvailable: "I morgen 10:00"
    }
  ].filter(facility => facility.id !== currentFacilityId);

  const handleFacilityClick = (facilityId: string) => {
    navigate(`/facilities/${facilityId}`);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Lignende lokaler</h2>
        <Button variant="outline" onClick={() => navigate("/")}>
          Se alle lokaler
        </Button>
      </div>
      
      <Carousel className="w-full">
        <CarouselContent className="-ml-2 md:-ml-4">
          {similarFacilities.map((facility) => (
            <CarouselItem key={facility.id} className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3">
              <Card 
                className="cursor-pointer hover:shadow-lg transition-shadow duration-200"
                onClick={() => handleFacilityClick(facility.id)}
              >
                <div className="aspect-video relative overflow-hidden rounded-t-lg">
                  <img
                    src={facility.image}
                    alt={facility.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                  />
                  <div className="absolute top-3 left-3">
                    <Badge variant="outline" className="bg-white/90 text-blue-700 border-blue-200">
                      {facility.type}
                    </Badge>
                  </div>
                  <div className="absolute top-3 right-3">
                    <div className="flex items-center gap-1 bg-white/90 rounded-full px-2 py-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{facility.rating}</span>
                    </div>
                  </div>
                </div>
                
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div>
                      <h3 className="font-semibold text-lg text-gray-900 line-clamp-1">
                        {facility.name}
                      </h3>
                      <div className="flex items-center text-gray-600 text-sm mt-1">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span className="line-clamp-1">{facility.address}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-1 text-gray-600">
                        <Users className="h-4 w-4" />
                        <span>{facility.capacity} pers.</span>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-blue-600">
                          {facility.pricePerHour} kr/time
                        </div>
                        <div className="text-xs text-gray-500">
                          Fra {facility.pricePerHour * 0.6} kr/time
                        </div>
                      </div>
                    </div>
                    
                    <div className="pt-2 border-t border-gray-100">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Neste ledige:</span>
                        <span className="text-sm font-medium text-green-600">
                          {facility.nextAvailable}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden md:flex" />
        <CarouselNext className="hidden md:flex" />
      </Carousel>
    </div>
  );
}
