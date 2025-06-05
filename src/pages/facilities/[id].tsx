import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MapPin, Users, Clock, Star, CheckCircle, Wifi, Car, Accessibility, Map, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import GlobalHeader from "@/components/GlobalHeader";
import GlobalFooter from "@/components/GlobalFooter";
import { FacilityImageGallery } from "@/components/facility/FacilityImageGallery";
import { FacilityBookingDrawer } from "@/components/facility/FacilityBookingDrawer";
import { FacilityBookingCard } from "@/components/facility/FacilityBookingCard";
import { ZoneAvailabilityTable } from "@/components/facility/ZoneAvailabilityTable";
import MapView from "@/components/MapView";
import { format } from "date-fns";
import { isDateUnavailable, isNorwegianHoliday } from "@/utils/holidaysAndAvailability";
import { Zone } from "@/components/booking/types";

const FacilityDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isBookingDrawerOpen, setIsBookingDrawerOpen] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [date] = useState<Date>(new Date());
  
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
    equipment: ["Projektor", "Lydanlegg", "Whiteboard", "Wi-Fi"],
    description: "Dette er en moderne gymsal på Brandengen skole, perfekt for idrettsaktiviteter, trening og mindre arrangementer. Salen er utstyrt med standard sportsutstyr og har god ventilasjon.",
    images: [
      "/lovable-uploads/08e8f8d5-4126-4805-a56e-e4337f97dbd0.png",
      "https://images.unsplash.com/photo-1580237072617-771c3ecc4a24?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1516205651411-aef33a44f7c2?auto=format&fit=crop&w=1200&q=80"
    ],
    rating: 4.8,
    reviewCount: 124,
    pricePerHour: 450, // Base price for whole facility
    area: "120 m²",
    accessibility: ["wheelchair", "hearing-loop"],
    amenities: ["Parkering", "Wi-Fi", "Garderober", "Dusjer", "Kafeteria"],
    openingHours: "Man-Søn: 06:00-23:00",
    zones: zones,
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
    <div className="min-h-screen bg-white flex flex-col">
      <GlobalHeader />

      <div className="flex-grow">
        {/* Navigation Header */}
        <div className="bg-white border-b border-gray-200 sticky top-[72px] z-20">
          <div className="container mx-auto px-4 py-3">
            <Button 
              variant="ghost" 
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
              onClick={() => navigate("/")}
            >
              <ArrowLeft className="h-4 w-4" />
              Tilbake til søk
            </Button>
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
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    Idrettsanlegg
                  </Badge>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{facility.rating}</span>
                    <span className="text-gray-500 text-sm">({facility.reviewCount})</span>
                  </div>
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-3">{facility.name}</h1>
                <div className="flex items-center text-gray-600 mb-4">
                  <MapPin className="h-5 w-5 mr-2" />
                  <span>{facility.address}</span>
                </div>
              </div>

              {/* Quick Facts Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Users className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium text-gray-500">Kapasitet</span>
                  </div>
                  <p className="font-bold">{facility.capacity}</p>
                </Card>
                
                <Card className="p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Map className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium text-gray-500">Areal</span>
                  </div>
                  <p className="font-bold">{facility.area}</p>
                </Card>
                
                <Card className="p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="h-4 w-4 text-purple-600" />
                    <span className="text-sm font-medium text-gray-500">Åpent</span>
                  </div>
                  <p className="font-bold text-sm">06:00-23:00</p>
                </Card>
                
                <Card className="p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <CheckCircle className="h-4 w-4 text-emerald-600" />
                    <span className="text-sm font-medium text-gray-500">Soner</span>
                  </div>
                  <p className="font-bold text-emerald-600">{zones.length}</p>
                </Card>
              </div>

              {/* Description */}
              <Card className="p-6">
                <h2 className="text-xl font-medium mb-4">Om lokalet</h2>
                <p className="text-gray-700 whitespace-pre-line">{facility.description}</p>
                
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <h3 className="font-medium text-lg mb-2">Egnet for</h3>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="bg-gray-50">Idrett</Badge>
                    <Badge variant="outline" className="bg-gray-50">Trening</Badge>
                    <Badge variant="outline" className="bg-gray-50">Arrangementer</Badge>
                    <Badge variant="outline" className="bg-gray-50">Grupper</Badge>
                  </div>
                </div>
              </Card>

              {/* Zone Overview */}
              <Card className="p-6">
                <h2 className="text-xl font-medium mb-4">Tilgjengelige soner</h2>
                <div className="space-y-4">
                  {zones.map((zone) => (
                    <Card key={zone.id} className="border border-gray-200">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-semibold text-lg">{zone.name}</h3>
                            <p className="text-sm text-gray-600">{zone.description}</p>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold">{zone.pricePerHour} kr</div>
                            <div className="text-sm text-gray-500">per time</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4 mb-3">
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <Users className="h-4 w-4" />
                            <span>Maks {zone.capacity} personer</span>
                          </div>
                          {zone.area && (
                            <div className="text-sm text-gray-600">
                              <span>{zone.area}</span>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex flex-wrap gap-1">
                          {zone.equipment.map((item, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {item}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </Card>

              {/* Zone Availability */}
              <ZoneAvailabilityTable 
                zones={zones}
                startDate={date}
                timeSlots={["08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00"]}
              />

              {/* Map Section */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Lokasjon</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowMap(!showMap)}
                    className="flex items-center gap-2"
                  >
                    <Map className="h-4 w-4" />
                    {showMap ? 'Skjul kart' : 'Vis kart'}
                  </Button>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <MapPin className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium">{facility.address}</p>
                      <p className="text-sm text-gray-600">Drammen Kommune</p>
                    </div>
                  </div>
                  
                  {showMap && (
                    <div className="h-64 rounded-lg overflow-hidden border">
                      <MapView facilityType="" location={facility.address} />
                    </div>
                  )}
                </div>
              </Card>
            </div>

            {/* Right Sidebar - Booking */}
            <div className="lg:sticky lg:top-24 lg:self-start">
              <FacilityBookingCard 
                facility={facility}
                onBookClick={() => setIsBookingDrawerOpen(true)}
              />
            </div>
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
