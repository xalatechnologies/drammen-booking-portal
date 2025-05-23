
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import GlobalHeader from "@/components/GlobalHeader";
import GlobalFooter from "@/components/GlobalFooter";
import { FacilityImageGallery } from "@/components/facility/FacilityImageGallery";
import { FacilityInfoTabs } from "@/components/facility/FacilityInfoTabs";
import { FacilityBookingCard } from "@/components/facility/FacilityBookingCard";
import { FacilityBookingDrawer } from "@/components/facility/FacilityBookingDrawer";

const FacilityDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isBookingDrawerOpen, setIsBookingDrawerOpen] = useState(false);
  
  // Mock facility data - in a real app this would be fetched based on id
  const facility = {
    id,
    name: `Gymsal ${id} - Brandengen skole`,
    address: "Knoffs gate 8, Drammen",
    capacity: 30,
    equipment: ["Projektor", "Lydanlegg", "Whiteboard", "Wi-Fi"],
    description: "Dette er en moderne gymsal på Brandengen skole, perfekt for idrettsaktiviteter, trening og mindre arrangementer. Salen er utstyrt med standard sportsutstyr og har god ventilasjon.",
    images: [
      "/lovable-uploads/08e8f8d5-4126-4805-a56e-e4337f97dbd0.png",
      "https://images.unsplash.com/photo-1580237072617-771c3ecc4a24?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1516205651411-aef33a44f7c2?auto=format&fit=crop&w=1200&q=80"
    ],
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
        date: new Date(Date.now() + 86400000), // Tomorrow
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
        date: new Date(Date.now() + 172800000), // Day after tomorrow
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col">
      <GlobalHeader />

      <div className="container mx-auto px-4 py-6 max-w-7xl flex-grow">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <Button 
            variant="outline" 
            className="flex items-center gap-1"
            onClick={() => navigate("/")}
          >
            <ArrowLeft className="h-4 w-4" />
            Tilbake til søk
          </Button>
          
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">
            Idrettsanlegg
          </Badge>
        </div>

        <h1 className="text-3xl font-bold mb-2">{facility.name}</h1>
        <div className="flex items-center text-gray-500 mb-6">
          <MapPin className="h-4 w-4 mr-1" />
          <span>{facility.address}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Images and Description */}
          <div className="lg:col-span-2">
            <FacilityImageGallery images={facility.images} />
            <FacilityInfoTabs 
              description={facility.description}
              capacity={facility.capacity}
              equipment={facility.equipment}
            />
          </div>

          {/* Details and Booking Button */}
          <div>
            <FacilityBookingCard 
              facility={facility} 
              onBookClick={() => setIsBookingDrawerOpen(true)} 
            />
          </div>
        </div>
      </div>

      <GlobalFooter />
      
      <FacilityBookingDrawer 
        open={isBookingDrawerOpen}
        onOpenChange={setIsBookingDrawerOpen}
        facility={facility}
      />
    </div>
  );
};

export default FacilityDetail;
