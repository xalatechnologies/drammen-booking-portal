
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Drawer, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger, DrawerClose } from "@/components/ui/drawer";
import { ArrowLeft, Calendar, CheckCircle } from "lucide-react";
import { format } from "date-fns";
import GlobalHeader from "@/components/GlobalHeader";
import GlobalFooter from "@/components/GlobalFooter";
import { BookingForm } from "@/components/booking/BookingForm";
import { useToast } from "@/hooks/use-toast";

const FacilityDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [date, setDate] = useState<Date>(new Date());
  const [calendarView, setCalendarView] = useState<"day" | "week" | "month">("week");
  const [isBookingComplete, setIsBookingComplete] = useState(false);
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col">
      <GlobalHeader />

      <div className="container mx-auto px-4 py-6 max-w-7xl flex-grow">
        <Button 
          variant="outline" 
          className="mb-6"
          onClick={() => navigate("/")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Tilbake til søk
        </Button>

        <h1 className="text-3xl font-bold mb-6">{facility.name}</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Images and Description */}
          <div className="lg:col-span-2">
            {/* Main Image */}
            <div className="rounded-lg overflow-hidden mb-4 h-80">
              <img 
                src={facility.images[0]} 
                alt={facility.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Thumbnail Gallery */}
            <div className="grid grid-cols-3 gap-2 mb-6">
              {facility.images.slice(1).map((img, i) => (
                <div key={i} className="rounded-md overflow-hidden h-24">
                  <img 
                    src={img} 
                    alt={`${facility.name} - bilde ${i+2}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>

            {/* Description */}
            <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
              <h2 className="text-xl font-bold mb-4">Beskrivelse</h2>
              <p className="text-gray-700">{facility.description}</p>
            </div>
          </div>

          {/* Details and Booking Button */}
          <div>
            <Card className="mb-6">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4">Detaljer</h2>
                
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Adresse</p>
                    <p>{facility.address}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-500">Kapasitet</p>
                    <p>{facility.capacity} personer</p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-500">Utstyr</p>
                    <ul className="list-disc pl-5 text-gray-700">
                      {facility.equipment.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Drawer>
              <DrawerTrigger asChild>
                <Button className="w-full bg-[#0B3D91] hover:bg-blue-700 text-white font-medium shadow-sm h-12">
                  Reserver nå
                </Button>
              </DrawerTrigger>
              <DrawerContent className="max-h-[90vh] overflow-auto">
                <DrawerClose id="close-booking-drawer" className="hidden" />
                <DrawerHeader>
                  <DrawerTitle>{isBookingComplete ? "Reservasjon fullført!" : `Reserver ${facility.name}`}</DrawerTitle>
                  <DrawerDescription>
                    {isBookingComplete 
                      ? "Din reservasjon er mottatt og vil bli behandlet." 
                      : "Fyll ut skjemaet under for å reservere lokalet"}
                  </DrawerDescription>
                </DrawerHeader>
                
                <div className="px-4 pb-4">
                  {isBookingComplete ? (
                    <div className="text-center py-10 space-y-4">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                        <CheckCircle className="h-8 w-8 text-green-600" />
                      </div>
                      <h3 className="text-xl font-medium">Takk for din reservasjon!</h3>
                      <p className="text-gray-600 max-w-md mx-auto">
                        En bekreftelse er sendt til din e-post. Du vil også motta en SMS når reservasjonen er godkjent.
                      </p>
                      <Button 
                        onClick={() => navigate("/bookings")}
                        className="mt-6 bg-blue-600 hover:bg-blue-700"
                      >
                        Se dine reservasjoner
                      </Button>
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
          </div>
        </div>

        {/* Calendar View */}
        <div className="bg-white rounded-lg p-6 shadow-sm mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Tilgjengelighet</h2>
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
        </div>
      </div>

      <GlobalFooter />
    </div>
  );
};

export default FacilityDetail;
