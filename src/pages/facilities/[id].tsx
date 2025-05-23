
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Drawer, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger, DrawerClose } from "@/components/ui/drawer";
import { ArrowLeft, Calendar, CheckCircle, MapPin, Clock, Users, Info, Star, Images, CalendarDays } from "lucide-react";
import { format } from "date-fns";
import GlobalHeader from "@/components/GlobalHeader";
import GlobalFooter from "@/components/GlobalFooter";
import { BookingForm } from "@/components/booking/BookingForm";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const FacilityDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [date, setDate] = useState<Date>(new Date());
  const [calendarView, setCalendarView] = useState<"day" | "week" | "month">("week");
  const [isBookingComplete, setIsBookingComplete] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const { toast } = useToast();
  
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

  const handleBookingComplete = () => {
    setIsBookingComplete(true);
    
    // Reset booking state after viewing the success state
    setTimeout(() => {
      document.getElementById("close-booking-drawer")?.click();
      
      // Reset the state after the drawer closes
      setTimeout(() => {
        setIsBookingComplete(false);
      }, 300);
    }, 3000);
  };

  const nextImage = () => {
    setActiveImageIndex((prev) => (prev + 1) % facility.images.length);
  };

  const prevImage = () => {
    setActiveImageIndex((prev) => (prev - 1 + facility.images.length) % facility.images.length);
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
            {/* Image Gallery with Navigation */}
            <div className="relative rounded-lg overflow-hidden mb-4">
              <div className="h-80 relative">
                {facility.images.map((img, i) => (
                  <div 
                    key={i} 
                    className={`absolute top-0 left-0 w-full h-full transition-opacity duration-500 ${
                      i === activeImageIndex ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
                  >
                    <img 
                      src={img} 
                      alt={`${facility.name} - bilde ${i+1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
                
                {/* Navigation arrows */}
                <button 
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full"
                  aria-label="Forrige bilde"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
                <button 
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full"
                  aria-label="Neste bilde"
                >
                  <ArrowLeft className="h-5 w-5 transform rotate-180" />
                </button>
                
                {/* Image counter */}
                <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
                  {activeImageIndex + 1} / {facility.images.length}
                </div>
              </div>
            </div>
            
            {/* Thumbnail Gallery */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
              {facility.images.map((img, i) => (
                <button 
                  key={i} 
                  onClick={() => setActiveImageIndex(i)}
                  className={`rounded-md overflow-hidden h-16 w-24 flex-shrink-0 border-2 transition
                    ${activeImageIndex === i ? 'border-blue-600' : 'border-transparent hover:border-gray-300'}`}
                >
                  <img 
                    src={img} 
                    alt={`Thumbnail ${i+1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>

            {/* Tabs for Description, Features, etc. */}
            <Tabs defaultValue="description" className="bg-white rounded-lg shadow-sm">
              <TabsList className="w-full border-b p-0 h-auto">
                <TabsTrigger value="description" className="flex-1 py-3 rounded-none rounded-tl-lg data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:shadow-none">
                  Beskrivelse
                </TabsTrigger>
                <TabsTrigger value="features" className="flex-1 py-3 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:shadow-none">
                  Fasiliteter
                </TabsTrigger>
                <TabsTrigger value="calendar" className="flex-1 py-3 rounded-none rounded-tr-lg data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:shadow-none">
                  Kalender
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="description" className="p-6">
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
              </TabsContent>
              
              <TabsContent value="features" className="p-6">
                <h2 className="text-xl font-medium mb-4">Fasiliteter og utstyr</h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4">
                  <div className="flex items-start space-x-2">
                    <Users className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium">Kapasitet</p>
                      <p className="text-gray-600">{facility.capacity} personer</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-2">
                    <Clock className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium">Åpningstider</p>
                      <p className="text-gray-600">08:00 - 22:00 alle dager</p>
                    </div>
                  </div>
                </div>
                
                <h3 className="font-medium text-lg mt-6 mb-3">Tilgjengelig utstyr</h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 text-gray-700">
                  {facility.equipment.map((item, i) => (
                    <li key={i} className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                      {item}
                    </li>
                  ))}
                </ul>
              </TabsContent>
              
              <TabsContent value="calendar" className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-medium">Tilgjengelighet</h2>
                  <div className="flex rounded-md overflow-hidden border">
                    <button 
                      className={`px-4 py-2 text-sm ${calendarView === "day" ? "bg-blue-600 text-white" : "bg-white"}`} 
                      onClick={() => setCalendarView("day")}
                    >
                      Dag
                    </button>
                    <button 
                      className={`px-4 py-2 text-sm ${calendarView === "week" ? "bg-blue-600 text-white" : "bg-white"}`} 
                      onClick={() => setCalendarView("week")}
                    >
                      Uke
                    </button>
                    <button 
                      className={`px-4 py-2 text-sm ${calendarView === "month" ? "bg-blue-600 text-white" : "bg-white"}`} 
                      onClick={() => setCalendarView("month")}
                    >
                      Måned
                    </button>
                  </div>
                </div>
                
                <div className="border rounded-lg overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr>
                        <th className="p-2 border-b border-r text-left">Tid</th>
                        {[0, 1, 2, 3, 4].map(day => (
                          <th key={day} className="p-2 border-b border-r text-center">
                            {format(new Date(date.getTime() + day * 24 * 60 * 60 * 1000), "EEE d.MMM")}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {["08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00"].map((time, i) => (
                        <tr key={i} className={i % 2 === 0 ? "bg-gray-50" : ""}>
                          <td className="p-2 border-b border-r">{time}</td>
                          {[0, 1, 2, 3, 4].map(day => {
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
                  Fargemarkering viser når lokalet er ledig (grønt) eller opptatt (rødt).
                </p>
              </TabsContent>
            </Tabs>
          </div>

          {/* Details and Booking Button */}
          <div>
            {/* Featured info card */}
            <Card className="mb-6 shadow-sm border-blue-100">
              <CardContent className="p-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold">Book dette lokalet</h2>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">Populært</Badge>
                </div>
                
                <Separator className="my-4" />
                
                <div className="space-y-4">
                  {/* Quick info items */}
                  <div className="flex items-center">
                    <div className="bg-blue-50 p-2 rounded-md">
                      <Users className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="ml-3">
                      <p className="text-gray-700">Kapasitet</p>
                      <p className="text-lg font-medium">{facility.capacity} personer</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="bg-blue-50 p-2 rounded-md">
                      <CalendarDays className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="ml-3">
                      <p className="text-gray-700">Oppholdstid</p>
                      <p className="text-lg font-medium">1-8 timer</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="bg-blue-50 p-2 rounded-md">
                      <Star className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="ml-3">
                      <p className="text-gray-700">Vurdering</p>
                      <p className="text-lg font-medium">4.8 av 5</p>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-green-50 rounded-lg mt-4 text-center">
                    <p className="text-green-800 text-sm">
                      <CheckCircle className="inline h-4 w-4 mr-1" />
                      Tilgjengelig for umiddelbar booking
                    </p>
                  </div>
                </div>

                <Drawer>
                  <DrawerTrigger asChild>
                    <Button className="w-full bg-[#0B3D91] hover:bg-blue-700 text-white font-medium shadow-sm h-12 mt-6">
                      Reserver nå
                    </Button>
                  </DrawerTrigger>
                  <DrawerContent className="max-h-[90vh] overflow-auto">
                    <DrawerClose id="close-booking-drawer" className="hidden" />
                    <DrawerHeader className="text-center pb-2 border-b">
                      <DrawerTitle className="text-2xl">
                        {isBookingComplete 
                          ? "Reservasjon fullført!" 
                          : `Reserver ${facility.name}`
                        }
                      </DrawerTitle>
                      <DrawerDescription className="max-w-md mx-auto">
                        {isBookingComplete 
                          ? "Din reservasjon er mottatt og vil bli behandlet." 
                          : "Fyll ut skjemaet under for å reservere lokalet. Reservasjonen blir bekreftet når du sender inn skjemaet."
                        }
                      </DrawerDescription>
                    </DrawerHeader>
                    
                    <div className="px-4 pb-4">
                      {isBookingComplete ? (
                        <div className="text-center py-10 space-y-4">
                          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                            <CheckCircle className="h-10 w-10 text-green-600" />
                          </div>
                          <h3 className="text-xl font-medium">Takk for din reservasjon!</h3>
                          <p className="text-gray-600 max-w-md mx-auto">
                            En bekreftelse er sendt til din e-post. Du vil også motta en SMS når reservasjonen er godkjent.
                          </p>
                          <div className="flex gap-4 justify-center pt-4">
                            <Button 
                              onClick={() => navigate("/bookings")}
                              className="bg-blue-600 hover:bg-blue-700"
                              size="lg"
                            >
                              Se dine reservasjoner
                            </Button>
                            <Button 
                              variant="outline" 
                              onClick={() => document.getElementById("close-booking-drawer")?.click()}
                            >
                              Lukk
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <BookingForm 
                          facilityId={facility.id || ""}
                          facilityName={facility.name}
                          maxCapacity={facility.capacity}
                          availableTimeSlots={facility.availableTimes}
                          onCompleteBooking={handleBookingComplete}
                        />
                      )}
                    </div>
                  </DrawerContent>
                </Drawer>
              </CardContent>
            </Card>
            
            {/* Additional quick info cards */}
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
                    <Images className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">Tilgjengelighet</h3>
                    <p className="text-sm text-gray-600">
                      Tilgjengelig alle dager 08:00-22:00
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <GlobalFooter />
    </div>
  );
};

export default FacilityDetail;
