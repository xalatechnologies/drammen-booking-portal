
import React from "react";
import GlobalHeader from "@/components/GlobalHeader";
import GlobalFooter from "@/components/GlobalFooter";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { format } from "date-fns";
import { Calendar, MapPin, Clock } from "lucide-react";
import { nb } from "date-fns/locale";

// Mock booking data - would typically come from an API/database
const bookings = [
  {
    id: 1,
    facilityName: "Gymsal - Brandengen skole",
    location: "Brandengen skole, Knoffs gate 8, Drammen",
    date: new Date(2025, 4, 25, 14, 0),
    endDate: new Date(2025, 4, 25, 16, 0),
    status: "confirmed",
    bookingNumber: "BK-2025-2205",
  },
  {
    id: 2,
    facilityName: "Møterom 3 - Rådhuset",
    location: "Rådhuset, Engene 1, Drammen",
    date: new Date(2025, 4, 26, 10, 0),
    endDate: new Date(2025, 4, 26, 12, 0),
    status: "pending",
    bookingNumber: "BK-2025-2206",
  },
  {
    id: 3,
    facilityName: "Auditorium - Papirbredden",
    location: "Papirbredden, Grønland 58, Drammen",
    date: new Date(2025, 5, 3, 18, 0),
    endDate: new Date(2025, 5, 3, 21, 0),
    status: "confirmed",
    bookingNumber: "BK-2025-2207",
  },
];

const BookingsPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col">
      <GlobalHeader />

      <div className="container mx-auto px-4 py-8 max-w-7xl flex-grow">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4 md:mb-0">
            Mine reservasjoner
          </h1>
          <Button 
            className="bg-[#0B3D91] hover:bg-blue-700 text-white"
            onClick={() => window.location.href = "/"}
          >
            + Ny reservasjon
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {bookings.map((booking) => (
            <Card key={booking.id} className="overflow-hidden border-t-4 border-blue-600 shadow-md">
              <CardHeader className="bg-gray-50 border-b">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg font-bold">{booking.facilityName}</CardTitle>
                  <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    booking.status === "confirmed" 
                      ? "bg-green-100 text-green-800" 
                      : "bg-yellow-100 text-yellow-800"
                  }`}>
                    {booking.status === "confirmed" ? "Bekreftet" : "Venter godkjenning"}
                  </div>
                </div>
                <p className="text-sm text-gray-500">{booking.bookingNumber}</p>
              </CardHeader>

              <CardContent className="p-4 pt-5">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Calendar className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="font-medium">
                        {format(booking.date, "EEEE d. MMMM yyyy", {locale: nb})}
                      </p>
                      <p className="text-sm text-gray-500">
                        {format(booking.date, "HH:mm")} - {format(booking.endDate, "HH:mm")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-blue-600 mt-0.5" />
                    <p>{booking.location}</p>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="bg-gray-50 border-t px-4 py-3">
                <div className="flex justify-between w-full">
                  <Button
                    variant="outline"
                    className="border-blue-200 text-blue-700 hover:bg-blue-50"
                  >
                    Vis detaljer
                  </Button>
                  <div className="space-x-2">
                    <Button
                      variant="outline"
                      className="border-gray-300 text-gray-700 hover:bg-gray-50"
                    >
                      Endre
                    </Button>
                    <Button
                      variant="outline"
                      className="border-red-200 text-red-600 hover:bg-red-50"
                    >
                      Kansellér
                    </Button>
                  </div>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      <GlobalFooter />
    </div>
  );
};

export default BookingsPage;
