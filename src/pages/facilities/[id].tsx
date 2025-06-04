
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MapPin, Users, Clock, Star, Share2, Heart, Calendar, CheckCircle, Wifi, Car, Accessibility } from "lucide-react";
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
  const [isFavorited, setIsFavorited] = useState(false);
  
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
    rating: 4.8,
    reviewCount: 124,
    pricePerHour: 450,
    area: "120 m²",
    accessibility: ["wheelchair", "hearing-loop"],
    amenities: ["Parkering", "Wi-Fi", "Garderober", "Dusjer", "Kafeteria"],
    openingHours: "Man-Søn: 06:00-23:00",
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
        {/* Enhanced Navigation Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              className="flex items-center gap-2 hover:bg-gray-50 transition-colors"
              onClick={() => navigate("/")}
            >
              <ArrowLeft className="h-4 w-4" />
              Tilbake til søk
            </Button>
            
            <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 px-3 py-1">
              Idrettsanlegg
            </Badge>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
              onClick={() => setIsFavorited(!isFavorited)}
            >
              <Heart className={`h-4 w-4 ${isFavorited ? 'fill-red-500 text-red-500' : ''}`} />
              {isFavorited ? 'Fjern fra favoritter' : 'Legg til favoritter'}
            </Button>
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Share2 className="h-4 w-4" />
              Del
            </Button>
          </div>
        </div>

        {/* Enhanced Header Section */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-6">
            <div className="flex-1">
              <h1 className="text-4xl font-bold mb-3 text-gray-900">{facility.name}</h1>
              
              <div className="flex flex-wrap items-center gap-4 mb-4">
                <div className="flex items-center text-gray-600">
                  <MapPin className="h-5 w-5 mr-2 text-blue-600" />
                  <span className="text-lg">{facility.address}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold text-lg">{facility.rating}</span>
                  </div>
                  <span className="text-gray-500">({facility.reviewCount} anmeldelser)</span>
                </div>
              </div>

              {/* Quick Info Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                  <div className="flex items-center gap-2 mb-1">
                    <Users className="h-5 w-5 text-blue-600" />
                    <span className="text-sm font-medium text-gray-500">Kapasitet</span>
                  </div>
                  <p className="text-xl font-bold text-gray-900">{facility.capacity} personer</p>
                </div>
                
                <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="h-5 w-5 text-green-600" />
                    <span className="text-sm font-medium text-gray-500">Åpningstider</span>
                  </div>
                  <p className="text-sm font-semibold text-gray-900">{facility.openingHours}</p>
                </div>
                
                <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                  <div className="flex items-center gap-2 mb-1">
                    <Calendar className="h-5 w-5 text-purple-600" />
                    <span className="text-sm font-medium text-gray-500">Pris per time</span>
                  </div>
                  <p className="text-xl font-bold text-gray-900">{facility.pricePerHour} kr</p>
                </div>
                
                <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                  <div className="flex items-center gap-2 mb-1">
                    <CheckCircle className="h-5 w-5 text-emerald-600" />
                    <span className="text-sm font-medium text-gray-500">Areal</span>
                  </div>
                  <p className="text-xl font-bold text-gray-900">{facility.area}</p>
                </div>
              </div>

              {/* Amenities */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3 text-gray-900">Fasiliteter</h3>
                <div className="flex flex-wrap gap-2">
                  {facility.amenities.map((amenity, index) => {
                    const getIcon = (name: string) => {
                      switch (name.toLowerCase()) {
                        case 'parkering': return <Car className="h-4 w-4" />;
                        case 'wi-fi': return <Wifi className="h-4 w-4" />;
                        default: return <CheckCircle className="h-4 w-4" />;
                      }
                    };
                    
                    return (
                      <Badge 
                        key={index} 
                        variant="outline" 
                        className="bg-green-50 text-green-700 border-green-200 px-3 py-1 flex items-center gap-1"
                      >
                        {getIcon(amenity)}
                        {amenity}
                      </Badge>
                    );
                  })}
                  {facility.accessibility.includes('wheelchair') && (
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 px-3 py-1 flex items-center gap-1">
                      <Accessibility className="h-4 w-4" />
                      Rullestoltilgjengelig
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Booking Button */}
            <div className="flex-shrink-0">
              <Button 
                size="lg" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                onClick={() => setIsBookingDrawerOpen(true)}
              >
                Book nå
              </Button>
            </div>
          </div>
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

          {/* Enhanced Booking Card */}
          <div className="lg:sticky lg:top-6">
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
