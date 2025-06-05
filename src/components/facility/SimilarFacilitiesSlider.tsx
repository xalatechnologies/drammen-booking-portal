
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

interface SimilarFacilitiesSliderProps {
  currentFacilityId: string;
}

export function SimilarFacilitiesSlider({ currentFacilityId }: SimilarFacilitiesSliderProps) {
  const navigate = useNavigate();

  // Mock data for similar facilities - using same structure as frontend FacilityCard expects
  const similarFacilities = [
    {
      id: 3,
      name: "Gymsal 3 - Åssiden skole",
      address: "Åssiden 12, Drammen",
      type: "Gymsal",
      image: "https://images.unsplash.com/photo-1580237072617-771c3ecc4a24?auto=format&fit=crop&w=600&q=80",
      nextAvailable: "I dag 14:00",
      capacity: 25,
      accessibility: ["wheelchair", "hearing-loop"],
      area: "100 m²",
      suitableFor: ["Idrett", "Trening", "Grupper", "Dans"],
      equipment: ["Projektor", "Lydanlegg", "Basketkurver", "Volleyballnett"],
      openingHours: "Man-Søn: 06:00-23:00",
      description: "Moderne gymsal på Åssiden skole med god ventilasjon og moderne utstyr. Perfekt for ballsport og gruppeaktiviteter.",
      availableTimes: [
        {
          date: new Date(),
          slots: [
            { start: "08:00", end: "10:00", available: true },
            { start: "10:00", end: "12:00", available: false },
            { start: "12:00", end: "14:00", available: true },
            { start: "14:00", end: "16:00", available: true },
            { start: "16:00", end: "18:00", available: false },
            { start: "18:00", end: "20:00", available: true },
            { start: "20:00", end: "22:00", available: true },
          ]
        }
      ]
    },
    {
      id: 7,
      name: "Gymsal 7 - Konnerud skole",
      address: "Konnerudgata 25, Drammen",
      type: "Gymsal",
      image: "https://images.unsplash.com/photo-1516205651411-aef33a44f7c2?auto=format&fit=crop&w=600&q=80",
      nextAvailable: "I morgen 08:00",
      capacity: 30,
      accessibility: ["wheelchair"],
      area: "120 m²",
      suitableFor: ["Idrett", "Ballsport", "Arrangementer", "Trening"],
      equipment: ["Lydanlegg", "Basketkurver", "Håndballmål", "Sportsutstyr"],
      openingHours: "Man-Søn: 06:00-23:00",
      description: "Stor gymsal med høy standard og moderne sportsutstyr. Egnet for alle typer ballsport og større arrangementer.",
      availableTimes: [
        {
          date: new Date(),
          slots: [
            { start: "08:00", end: "10:00", available: true },
            { start: "10:00", end: "12:00", available: true },
            { start: "12:00", end: "14:00", available: true },
            { start: "14:00", end: "16:00", available: false },
            { start: "16:00", end: "18:00", available: true },
            { start: "18:00", end: "20:00", available: false },
            { start: "20:00", end: "22:00", available: true },
          ]
        }
      ]
    },
    {
      id: 12,
      name: "Idrettshall - Strømsø",
      address: "Strømsø torg 8, Drammen",
      type: "Idrettshall",
      image: "/lovable-uploads/08e8f8d5-4126-4805-a56e-e4337f97dbd0.png",
      nextAvailable: "I dag 16:00",
      capacity: 50,
      accessibility: ["wheelchair", "hearing-loop", "visual-guidance"],
      area: "200 m²",
      suitableFor: ["Idrett", "Ballsport", "Turneringer", "Arrangementer", "Dans"],
      equipment: ["Projektor", "Lydanlegg", "Basketkurver", "Volleyballnett", "Håndballmål", "Tribuner"],
      openingHours: "Man-Søn: 06:00-23:00",
      description: "Stor idrettshall med tribuner og profesjonelt utstyr. Perfekt for turneringer og store arrangementer.",
      availableTimes: [
        {
          date: new Date(),
          slots: [
            { start: "08:00", end: "10:00", available: true },
            { start: "10:00", end: "12:00", available: true },
            { start: "12:00", end: "14:00", available: true },
            { start: "14:00", end: "16:00", available: true },
            { start: "16:00", end: "18:00", available: true },
            { start: "18:00", end: "20:00", available: true },
            { start: "20:00", end: "22:00", available: true },
          ]
        }
      ]
    },
    {
      id: 8,
      name: "Gymsal 8 - Bragernes skole",
      address: "Bragernes torg 2, Drammen",
      type: "Gymsal",
      image: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?auto=format&fit=crop&w=600&q=80",
      nextAvailable: "I dag 18:00",
      capacity: 28,
      accessibility: ["wheelchair", "hearing-loop"],
      area: "110 m²",
      suitableFor: ["Idrett", "Trening", "Dans", "Grupper"],
      equipment: ["Lydanlegg", "Basketkurver", "Sportsutstyr", "Speil"],
      openingHours: "Man-Søn: 06:00-23:00",
      description: "Gymsal med speilvegg, perfekt for dans og treningsgrupper. God akustikk og moderne belysning.",
      availableTimes: [
        {
          date: new Date(),
          slots: [
            { start: "08:00", end: "10:00", available: false },
            { start: "10:00", end: "12:00", available: true },
            { start: "12:00", end: "14:00", available: true },
            { start: "14:00", end: "16:00", available: false },
            { start: "16:00", end: "18:00", available: false },
            { start: "18:00", end: "20:00", available: true },
            { start: "20:00", end: "22:00", available: true },
          ]
        }
      ]
    },
    {
      id: 15,
      name: "Flerbrukshall - Svelvik",
      address: "Svelvik sentrum 15, Svelvik",
      type: "Flerbrukshall",
      image: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?auto=format&fit=crop&w=600&q=80",
      nextAvailable: "I morgen 10:00",
      capacity: 40,
      accessibility: ["wheelchair", "hearing-loop"],
      area: "150 m²",
      suitableFor: ["Idrett", "Kulturarrangementer", "Møter", "Fester", "Dans"],
      equipment: ["Projektor", "Lydanlegg", "Scène", "Basketkurver", "Bord og stoler"],
      openingHours: "Man-Søn: 06:00-23:00",
      description: "Fleksibel flerbrukshall som kan tilpasses ulike formål. Har scene og kan brukes til både idrett og kulturarrangementer.",
      availableTimes: [
        {
          date: new Date(),
          slots: [
            { start: "08:00", end: "10:00", available: true },
            { start: "10:00", end: "12:00", available: true },
            { start: "12:00", end: "14:00", available: false },
            { start: "14:00", end: "16:00", available: true },
            { start: "16:00", end: "18:00", available: true },
            { start: "18:00", end: "20:00", available: false },
            { start: "20:00", end: "22:00", available: true },
          ]
        }
      ]
    }
  ].filter(facility => facility.id.toString() !== currentFacilityId);

  const handleAddressClick = (e: React.MouseEvent, facility: any) => {
    e.stopPropagation();
    // Handle map view for address
    console.log('Show map for:', facility.address);
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
