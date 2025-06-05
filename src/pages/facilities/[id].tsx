
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home } from "lucide-react";
import GlobalHeader from "@/components/GlobalHeader";
import GlobalFooter from "@/components/GlobalFooter";
import { FacilityImageGallery } from "@/components/facility/FacilityImageGallery";
import { FacilityBookingDrawer } from "@/components/facility/FacilityBookingDrawer";
import { FacilityHeader } from "@/components/facility/FacilityHeader";
import { FacilityQuickFacts } from "@/components/facility/FacilityQuickFacts";
import { FacilitySidebar } from "@/components/facility/FacilitySidebar";
import { FacilityInfoTabs } from "@/components/facility/FacilityInfoTabs";
import { SimilarFacilitiesSlider } from "@/components/facility/SimilarFacilitiesSlider";
import { Zone } from "@/components/booking/types";

const FacilityDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isBookingDrawerOpen, setIsBookingDrawerOpen] = useState(false);
  const [selectedZoneId, setSelectedZoneId] = useState<string>("");
  const [isFavorited, setIsFavorited] = useState(false);
  
  // Mock facility data with zones - in a real app this would be fetched based on id
  const zones: Zone[] = [
    {
      id: "whole-facility",
      name: "Hele lokalet",
      capacity: 30,
      equipment: ["Projektor", "Lydanlegg", "Whiteboard", "Wi-Fi"],
      pricePerHour: 450,
      description: "Komplett gymsal med full tilgang til alt utstyr",
      area: "120 m²"
    },
    {
      id: "zone-1",
      name: "Sone A",
      capacity: 15,
      equipment: ["Lydanlegg", "Wi-Fi"],
      pricePerHour: 250,
      description: "Nordre del av gymsalen",
      area: "60 m²"
    },
    {
      id: "zone-2",
      name: "Sone B",
      capacity: 15,
      equipment: ["Projektor", "Whiteboard", "Wi-Fi"],
      pricePerHour: 280,
      description: "Søndre del av gymsalen med presentasjonsutstyr",
      area: "60 m²"
    }
  ];

  const facility = {
    id,
    name: `Gymsal ${id} - Brandengen skole`,
    address: "Knoffs gate 8, Drammen",
    capacity: 30,
    equipment: ["Projektor", "Lydanlegg", "Whiteboard", "Wi-Fi", "Sportsutstyr", "Basketkurver", "Volleyballnett", "Håndballmål"],
    description: "Dette er en moderne gymsal på Brandengen skole, perfekt for idrettsaktiviteter, trening og mindre arrangementer. Salen er utstyrt med standard sportsutstyr og har god ventilasjon. Lokalet har nylig blitt renovert med moderne lyd- og lyssystemer. Gymsalen har parkett gulv av høy kvalitet som er egnet for alle typer ballsport og dans. Det er også installert moderne ventilasjonsanlegg som sikrer god luftkvalitet under intensive aktiviteter.",
    images: [
      "/lovable-uploads/08e8f8d5-4126-4805-a56e-e4337f97dbd0.png",
      "https://images.unsplash.com/photo-1580237072617-771c3ecc4a24?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1516205651411-aef33a44f7c2?auto=format&fit=crop&w=1200&q=80"
    ],
    rating: 4.8,
    reviewCount: 124,
    pricePerHour: 450,
    area: "120 m²",
    accessibility: ["wheelchair", "hearing-loop"],
    amenities: ["Parkering", "Wi-Fi", "Garderober", "Dusjer", "Kafeteria", "Førstehjelpsutstyr", "Brannsikkerhet", "Sikkerhetskameraer"],
    openingHours: "Man-Søn: 06:00-23:00",
    zones: zones,
    hasAutoApproval: true,
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
      },
      {
        date: new Date(Date.now() + 86400000),
        slots: [
          { start: "08:00", end: "10:00", available: true },
          { start: "10:00", end: "12:00", available: true },
          { start: "12:00", end: "14:00", available: true },
          { start: "14:00", end: "16:00", available: false },
          { start: "16:00", end: "18:00", available: true },
          { start: "18:00", end: "20:00", available: false },
          { start: "20:00", end: "22:00", available: true },
        ]
      },
      {
        date: new Date(Date.now() + 172800000),
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
  };

  const handleZoneBookClick = (zoneId: string) => {
    setSelectedZoneId(zoneId);
    setIsBookingDrawerOpen(true);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: facility.name,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <GlobalHeader />

      <div className="flex-grow">
        {/* Breadcrumb Navigation */}
        <div className="bg-gray-50 border-b border-gray-200">
          <div className="container mx-auto px-4 py-3">
            <nav className="flex items-center space-x-2 text-sm">
              <Button 
                variant="ghost" 
                size="sm"
                className="text-gray-600 hover:text-gray-900 p-0 h-auto font-normal"
                onClick={() => navigate("/")}
              >
                <Home className="h-4 w-4 mr-1" />
                Hjem
              </Button>
              <span className="text-gray-400">/</span>
              <Button 
                variant="ghost" 
                size="sm"
                className="text-gray-600 hover:text-gray-900 p-0 h-auto font-normal"
                onClick={() => navigate("/")}
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Søkeresultater
              </Button>
              <span className="text-gray-400">/</span>
              <span className="text-gray-900 font-medium">Lokalet</span>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-6 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Content - Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Image Gallery */}
              <FacilityImageGallery images={facility.images} />

              {/* Header */}
              <FacilityHeader
                name={facility.name}
                address={facility.address}
                rating={facility.rating}
                reviewCount={facility.reviewCount}
                onShare={handleShare}
                isFavorited={isFavorited}
                onToggleFavorite={() => setIsFavorited(!isFavorited)}
              />

              {/* Quick Facts Grid */}
              <FacilityQuickFacts
                capacity={facility.capacity}
                area={facility.area}
                openingHours={facility.openingHours}
                zoneCount={zones.length}
              />

              {/* Tabbed Content */}
              <FacilityInfoTabs
                description={facility.description}
                capacity={facility.capacity}
                equipment={facility.equipment}
                zones={zones}
                amenities={facility.amenities}
                address={facility.address}
              />
            </div>

            {/* Right Sidebar - Booking */}
            <FacilitySidebar
              zones={zones}
              facilityName={facility.name}
              hasAutoApproval={facility.hasAutoApproval}
              openingHours={facility.openingHours}
              onZoneBookClick={handleZoneBookClick}
            />
          </div>

          {/* Similar Facilities Section */}
          <div className="mt-12">
            <SimilarFacilitiesSlider currentFacilityId={id || ""} />
          </div>
        </div>
      </div>

      <GlobalFooter />
      
      <FacilityBookingDrawer 
        open={isBookingDrawerOpen}
        onOpenChange={setIsBookingDrawerOpen}
        facility={facility}
        selectedZoneId={selectedZoneId}
      />
    </div>
  );
};

export default FacilityDetail;
