
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MapPin, Users, Clock, Star, Share2, Heart, Calendar, CheckCircle, Wifi, Car, Accessibility, Map, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import GlobalHeader from "@/components/GlobalHeader";
import GlobalFooter from "@/components/GlobalFooter";
import { FacilityImageGallery } from "@/components/facility/FacilityImageGallery";
import { FacilityBookingDrawer } from "@/components/facility/FacilityBookingDrawer";
import MapView from "@/components/MapView";
import { format } from "date-fns";
import { isDateUnavailable, isNorwegianHoliday } from "@/utils/holidaysAndAvailability";

const FacilityDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isBookingDrawerOpen, setIsBookingDrawerOpen] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [date] = useState<Date>(new Date());
  
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
    <div className="min-h-screen bg-white flex flex-col">
      <GlobalHeader />

      <div className="flex-grow">
        {/* Navigation Header */}
        <div className="bg-white border-b border-gray-200 sticky top-[72px] z-20">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <Button 
                variant="ghost" 
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
                onClick={() => navigate("/")}
              >
                <ArrowLeft className="h-4 w-4" />
                Tilbake til søk
              </Button>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-2"
                  onClick={() => setIsFavorited(!isFavorited)}
                >
                  <Heart className={`h-4 w-4 ${isFavorited ? 'fill-red-500 text-red-500' : ''}`} />
                </Button>
                <Button variant="ghost" size="sm">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-6 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Content - Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Image Gallery */}
              <FacilityImageGallery images={facility.images} />

              {/* Header with Price */}
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="flex-1">
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
                
                <div className="text-right">
                  <div className="text-3xl font-bold text-gray-900">{facility.pricePerHour} kr</div>
                  <div className="text-gray-500">per time</div>
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
                    <Calendar className="h-4 w-4 text-green-600" />
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
                    <span className="text-sm font-medium text-gray-500">Status</span>
                  </div>
                  <p className="font-bold text-emerald-600">Tilgjengelig</p>
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

              {/* Facilities and Equipment */}
              <Card className="p-6">
                <h2 className="text-xl font-medium mb-4">Fasiliteter og utstyr</h2>
                
                <h3 className="font-medium text-lg mb-3">Tilgjengelig utstyr</h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 text-gray-700 mb-6">
                  {facility.equipment.map((item, i) => (
                    <li key={i} className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                      {item}
                    </li>
                  ))}
                </ul>

                <h3 className="text-lg font-semibold mb-4">Fasiliteter</h3>
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
              </Card>

              {/* Availability Calendar */}
              <Card className="p-6">
                <h2 className="text-xl font-medium mb-4">Tilgjengelighet</h2>
                
                {/* Availability Legend */}
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <h3 className="text-sm font-medium mb-2">Forklaring:</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-green-50 border border-green-200 rounded mr-2"></div>
                      <span>Ledig</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-red-50 border border-red-200 rounded mr-2"></div>
                      <span>Helligdag</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-orange-50 border border-orange-200 rounded mr-2"></div>
                      <span>Helg</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-yellow-50 border border-yellow-200 rounded mr-2"></div>
                      <span>Vedlikehold</span>
                    </div>
                  </div>
                </div>
                
                <div className="border rounded-lg overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr>
                        <th className="p-2 border-b border-r text-left">Tid</th>
                        {[0, 1, 2, 3, 4].map(day => {
                          const currentDate = new Date(date.getTime() + day * 24 * 60 * 60 * 1000);
                          const unavailableCheck = isDateUnavailable(currentDate);
                          const holidayCheck = isNorwegianHoliday(currentDate);
                          
                          return (
                            <th key={day} className="p-2 border-b border-r text-center">
                              <div>
                                {format(currentDate, "EEE d.MMM")}
                                {holidayCheck.isHoliday && (
                                  <div className="text-xs text-red-600 mt-1">{holidayCheck.name}</div>
                                )}
                                {unavailableCheck.isUnavailable && !holidayCheck.isHoliday && (
                                  <div className="text-xs text-orange-600 mt-1">{unavailableCheck.details}</div>
                                )}
                              </div>
                            </th>
                          );
                        })}
                      </tr>
                    </thead>
                    <tbody>
                      {["08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00"].map((time, i) => (
                        <tr key={i} className={i % 2 === 0 ? "bg-gray-50" : ""}>
                          <td className="p-2 border-b border-r">{time}</td>
                          {[0, 1, 2, 3, 4].map(day => {
                            const currentDate = new Date(date.getTime() + day * 24 * 60 * 60 * 1000);
                            const unavailableCheck = isDateUnavailable(currentDate);
                            
                            // If the day is unavailable, show the reason
                            if (unavailableCheck.isUnavailable) {
                              const bgColor = {
                                'past': 'bg-gray-100',
                                'weekend': 'bg-orange-100',
                                'holiday': 'bg-red-100',
                                'maintenance': 'bg-yellow-100'
                              }[unavailableCheck.reason!];
                              
                              const textColor = {
                                'past': 'text-gray-500',
                                'weekend': 'text-orange-600',
                                'holiday': 'text-red-600',
                                'maintenance': 'text-yellow-600'
                              }[unavailableCheck.reason!];
                              
                              return (
                                <td 
                                  key={day} 
                                  className={`p-2 border-b border-r text-center ${bgColor}`}
                                  title={unavailableCheck.details}
                                >
                                  <span className={textColor}>
                                    {unavailableCheck.reason === 'past' ? 'Fortid' : 
                                     unavailableCheck.reason === 'weekend' ? 'Helg' :
                                     unavailableCheck.reason === 'holiday' ? 'Helligdag' : 'Vedlikehold'}
                                  </span>
                                </td>
                              );
                            }
                            
                            // Mock availability - in a real app this would be based on actual bookings
                            const isAvailable = Math.random() > 0.3;
                            return (
                              <td 
                                key={day} 
                                className={`p-2 border-b border-r text-center ${isAvailable ? "bg-green-100" : "bg-red-100"}`}
                              >
                                <span className={isAvailable ? "text-green-600" : "text-red-600"}>
                                  {isAvailable ? "Ledig" : "Opptatt"}
                                </span>
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <p className="text-sm text-gray-500 mt-4">
                  <Info className="h-4 w-4 inline-block mr-1" />
                  Fargemarkering viser når lokalet er ledig (grønt), opptatt (rødt), eller ikke tilgjengelig på grunn av helligdager, helger eller vedlikehold.
                </p>
              </Card>

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
              {/* Price Card */}
              <Card className="mb-6 shadow-sm border-blue-100">
                <CardContent className="p-6">
                  <div className="text-center mb-4">
                    <div className="text-3xl font-bold text-gray-900">{facility.pricePerHour} kr</div>
                    <div className="text-gray-500">per time</div>
                  </div>
                  
                  <div className="p-4 bg-green-50 rounded-lg mb-4 text-center">
                    <p className="text-green-800 text-sm">
                      <CheckCircle className="inline h-4 w-4 mr-1" />
                      Tilgjengelig for umiddelbar booking
                    </p>
                  </div>

                  <Button 
                    className="w-full bg-[#0B3D91] hover:bg-blue-700 text-white font-medium shadow-sm h-12"
                    onClick={() => setIsBookingDrawerOpen(true)}
                  >
                    Reserver nå
                  </Button>
                </CardContent>
              </Card>
              
              {/* Additional info cards */}
              <Card className="mb-6 shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-amber-100 p-2 rounded-md">
                      <Info className="h-5 w-5 text-amber-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">Avbestilling</h3>
                      <p className="text-sm text-gray-600">
                        Gratis avbestilling inntil 48 timer før
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-100 p-2 rounded-md">
                      <Clock className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">Åpningstider</h3>
                      <p className="text-sm text-gray-600">
                        {facility.openingHours}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
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
