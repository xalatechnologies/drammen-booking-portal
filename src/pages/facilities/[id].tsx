
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Drawer, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import GlobalHeader from "@/components/GlobalHeader";
import GlobalFooter from "@/components/GlobalFooter";

const FacilityDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [date, setDate] = useState<Date>(new Date());
  const [calendarView, setCalendarView] = useState<"day" | "week" | "month">("week");
  
  // Mock facility data - in a real app this would be fetched based on id
  const facility = {
    id,
    name: `Gymsal ${id} - Brandengen skole`,
    address: "Knoffs gate 8, Drammen",
    capacity: "30 personer",
    equipment: ["Projektor", "Lydanlegg", "Whiteboard", "Wi-Fi"],
    description: "Dette er en moderne gymsal på Brandengen skole, perfekt for idrettsaktiviteter, trening og mindre arrangementer. Salen er utstyrt med standard sportsutstyr og har god ventilasjon.",
    images: [
      "https://images.unsplash.com/photo-1577301886662-26e1b2e2a00b?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1580237072617-771c3ecc4a24?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1516205651411-aef33a44f7c2?auto=format&fit=crop&w=1200&q=80"
    ]
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
                    <p>{facility.capacity}</p>
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
              <DrawerContent>
                <DrawerHeader>
                  <DrawerTitle>Reserver {facility.name}</DrawerTitle>
                  <DrawerDescription>Trinn 1/3: Velg tid og dato</DrawerDescription>
                </DrawerHeader>
                <div className="px-4">
                  <div className="grid gap-6 py-4">
                    <div className="grid gap-2">
                      <label className="text-sm font-medium">Dato</label>
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={(d) => d && setDate(d)}
                        className="rounded border shadow-sm p-3 pointer-events-auto"
                      />
                    </div>
                    
                    <div className="grid gap-2">
                      <label className="text-sm font-medium">Tidsintervall</label>
                      <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2">
                        <option>08:00 - 10:00</option>
                        <option>10:00 - 12:00</option>
                        <option>12:00 - 14:00</option>
                        <option>14:00 - 16:00</option>
                        <option>16:00 - 18:00</option>
                        <option>18:00 - 20:00</option>
                        <option>20:00 - 22:00</option>
                      </select>
                    </div>
                    
                    <div className="grid gap-2">
                      <label className="text-sm font-medium">Formål</label>
                      <textarea 
                        className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2" 
                        placeholder="Beskriv formålet med reservasjonen"
                      />
                    </div>
                  </div>
                </div>
                <DrawerFooter>
                  <Button className="bg-[#0B3D91] hover:bg-blue-700">Neste →</Button>
                </DrawerFooter>
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
