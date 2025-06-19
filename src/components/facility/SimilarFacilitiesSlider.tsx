
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

interface SimilarFacilitiesSliderProps {
  currentFacilityId: string;
}

export function SimilarFacilitiesSlider({ currentFacilityId }: SimilarFacilitiesSliderProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();

  // Mock data for similar facilities - using same comprehensive data as main page
  const allFacilities = [
    {
      id: 1,
      name: "Gymsal - Brandengen skole",
      address: "Knoffs gate 8, Drammen",
      type: "Gymsal",
      image: "/lovable-uploads/08e8f8d5-4126-4805-a56e-e4337f97dbd0.png",
      nextAvailable: "I dag 14:00",
      capacity: 30,
      accessibility: ["wheelchair", "hearing-loop"],
      area: "Bragernes",
      suitableFor: ["Idrett", "Trening", "Arrangementer", "Grupper"],
      equipment: ["Projektor", "Lydanlegg", "Whiteboard", "Sportsutstyr"],
      openingHours: "Man-Søn: 06:00-23:00",
      description: "Moderne gymsal på Brandengen skole med god ventilasjon og moderne utstyr.",
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
      id: 2,
      name: "Møterom 3 - Rådhuset",
      address: "Engenes gate 1, Drammen",
      type: "Møterom",
      image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80",
      nextAvailable: "I dag 10:00",
      capacity: 12,
      accessibility: ["wheelchair", "hearing-loop"],
      area: "Sentrum",
      suitableFor: ["Møter", "Presentasjoner", "Workshops", "Seminarer"],
      equipment: ["Projektor", "Whiteboard", "Videokonferanse", "Flipchart"],
      openingHours: "Man-Fre: 07:00-22:00",
      description: "Moderne møterom i rådhuset med full teknisk utrustning for profesjonelle møter.",
      availableTimes: [
        {
          date: new Date(),
          slots: [
            { start: "08:00", end: "10:00", available: false },
            { start: "10:00", end: "12:00", available: true },
            { start: "12:00", end: "14:00", available: false },
            { start: "14:00", end: "16:00", available: true },
            { start: "16:00", end: "18:00", available: true },
            { start: "18:00", end: "20:00", available: false },
            { start: "20:00", end: "22:00", available: true },
          ]
        }
      ]
    },
    {
      id: 3,
      name: "Idrettshall - Strømsø",
      address: "Strømsø torg 8, Drammen",
      type: "Idrettshall",
      image: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?auto=format&fit=crop&w=600&q=80",
      nextAvailable: "I dag 16:00",
      capacity: 50,
      accessibility: ["wheelchair", "hearing-loop", "visual-guidance"],
      area: "Strømsø",
      suitableFor: ["Idrett", "Ballsport", "Turneringer", "Arrangementer"],
      equipment: ["Projektor", "Lydanlegg", "Basketkurver", "Volleyballnett", "Håndballmål", "Tribuner"],
      openingHours: "Man-Søn: 06:00-23:00",
      description: "Stor idrettshall med tribuner og profesjonelt utstyr for alle typer ballsport.",
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
      id: 4,
      name: "Auditorium - Papirbredden",
      address: "Grønland 58, Drammen",
      type: "Auditorium",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",
      nextAvailable: "I morgen 09:00",
      capacity: 200,
      accessibility: ["wheelchair", "hearing-loop", "visual-guidance"],
      area: "Grønland",
      suitableFor: ["Konferanser", "Forestillinger", "Konserter", "Presentasjoner"],
      equipment: ["Scene", "Profesjonelt lyd- og lyssystem", "Projektor", "Mikrofoner"],
      openingHours: "Man-Søn: 08:00-23:00",
      description: "Stort auditorium perfekt for store arrangementer og forestillinger med moderne teknologi.",
      availableTimes: [
        {
          date: new Date(),
          slots: [
            { start: "08:00", end: "10:00", available: false },
            { start: "10:00", end: "12:00", available: false },
            { start: "12:00", end: "14:00", available: false },
            { start: "14:00", end: "16:00", available: false },
            { start: "16:00", end: "18:00", available: false },
            { start: "18:00", end: "20:00", available: false },
            { start: "20:00", end: "22:00", available: false },
          ]
        }
      ]
    },
    {
      id: 5,
      name: "Verksted 2 - Drammen VGS",
      address: "Hospitalsgata 18, Drammen",
      type: "Verksted",
      image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80",
      nextAvailable: "I dag 13:00",
      capacity: 16,
      accessibility: ["wheelchair"],
      area: "Sentrum",
      suitableFor: ["Workshops", "Håndverk", "Kurser", "Prosjekter"],
      equipment: ["Verktøy", "Arbeidsbenker", "Sikkerhetsutstyr", "Ventilasjon"],
      openingHours: "Man-Fre: 08:00-20:00",
      description: "Fullt utstyrt verksted for praktiske aktiviteter og workshops med moderne sikkerhetsutstyr.",
      availableTimes: [
        {
          date: new Date(),
          slots: [
            { start: "08:00", end: "10:00", available: true },
            { start: "10:00", end: "12:00", available: false },
            { start: "12:00", end: "14:00", available: true },
            { start: "14:00", end: "16:00", available: true },
            { start: "16:00", end: "18:00", available: true },
            { start: "18:00", end: "20:00", available: false },
          ]
        }
      ]
    },
    {
      id: 6,
      name: "Aktivitetssal - Bragernes",
      address: "Bragernes torg 2, Drammen",
      type: "Aktivitetssal",
      image: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?auto=format&fit=crop&w=600&q=80",
      nextAvailable: "I dag 15:00",
      capacity: 40,
      accessibility: ["wheelchair", "hearing-loop"],
      area: "Bragernes",
      suitableFor: ["Dans", "Yoga", "Aerobic", "Gruppetrening"],
      equipment: ["Speil", "Lydanlegg", "Yoga-matter", "Treningsutstyr"],
      openingHours: "Man-Søn: 06:00-22:00",
      description: "Fleksibel aktivitetssal perfekt for treningsaktiviteter med speil og moderne lydanlegg.",
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
    },
    {
      id: 7,
      name: "Bibliotek lokale - Spiralen",
      address: "Spiraltoppen 7, Drammen",
      type: "Studieplass",
      image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=600&q=80",
      nextAvailable: "I dag 12:00",
      capacity: 8,
      accessibility: ["wheelchair", "hearing-loop"],
      area: "Spiralen",
      suitableFor: ["Studier", "Lesing", "Stille arbeid", "Småmøter"],
      equipment: ["Bord", "Stoler", "Whiteboard", "Stikkontakter"],
      openingHours: "Man-Søn: 08:00-22:00",
      description: "Rolig studieplass i biblioteket, perfekt for konsentrert arbeid i stille omgivelser.",
      availableTimes: [
        {
          date: new Date(),
          slots: [
            { start: "08:00", end: "10:00", available: true },
            { start: "10:00", end: "12:00", available: false },
            { start: "12:00", end: "14:00", available: true },
            { start: "14:00", end: "16:00", available: true },
            { start: "16:00", end: "18:00", available: true },
            { start: "18:00", end: "20:00", available: true },
            { start: "20:00", end: "22:00", available: false },
          ]
        }
      ]
    },
    {
      id: 8,
      name: "Uteområde - Marienlyst park",
      address: "Marienlyst, Drammen",
      type: "Uteområde",
      image: "https://images.unsplash.com/photo-1441148345475-384ad4c4b22d?auto=format&fit=crop&w=600&q=80",
      nextAvailable: "I dag 08:00",
      capacity: 100,
      accessibility: ["wheelchair"],
      area: "Marienlyst",
      suitableFor: ["Utendørs arrangement", "Sport", "Festivaler", "Markeder"],
      equipment: ["Strøm tilgang", "Vannposter", "Søppelkasser"],
      openingHours: "Man-Søn: 06:00-22:00",
      description: "Stort uteområde perfekt for arrangementer under åpen himmel med god infrastruktur.",
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
    }
  ];

  // Filter out the current facility and take up to 5 similar ones
  const similarFacilities = allFacilities
    .filter(facility => facility.id.toString() !== currentFacilityId)
    .slice(0, 5);

  const handleAddressClick = (e: React.MouseEvent, facility: any) => {
    e.stopPropagation();
    console.log('Show map for:', facility.address);
  };

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
