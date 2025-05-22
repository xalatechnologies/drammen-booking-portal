
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useNavigate } from "react-router-dom";
import GlobalHeader from "@/components/GlobalHeader";
import GlobalFooter from "@/components/GlobalFooter";

const BookingsPage = () => {
  const navigate = useNavigate();
  
  // Mock bookings data - in a real app this would be fetched from an API
  const bookings = [
    {
      id: 1,
      facility: "Gymsal - Brandengen skole",
      date: "2025-06-01",
      time: "18:00 - 20:00",
      status: "bekreftet",
    },
    {
      id: 2,
      facility: "Møterom B - Drammen rådhus",
      date: "2025-06-05",
      time: "12:00 - 14:00",
      status: "venter godkjenning",
    },
    {
      id: 3,
      facility: "Auditorium - Fjell skole",
      date: "2025-06-10",
      time: "16:00 - 18:00",
      status: "bekreftet",
    }
  ];

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('no-NO', options);
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
        
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Mine bookinger</h1>
          <Button 
            className="bg-[#0B3D91] hover:bg-blue-700"
            onClick={() => navigate("/")}
          >
            <Calendar className="mr-2 h-4 w-4" />
            Ny booking
          </Button>
        </div>

        {bookings.length > 0 ? (
          <>
            {/* Desktop view - Table */}
            <div className="hidden md:block mb-8">
              <Table className="border rounded-md overflow-hidden">
                <TableHeader>
                  <TableRow>
                    <TableHead>Lokale</TableHead>
                    <TableHead>Dato</TableHead>
                    <TableHead>Tidspunkt</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bookings.map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell className="font-medium">{booking.facility}</TableCell>
                      <TableCell>{formatDate(booking.date)}</TableCell>
                      <TableCell>{booking.time}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          booking.status === 'bekreftet' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {booking.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2 justify-end">
                          <Button variant="outline" size="sm">Endre</Button>
                          <Button variant="outline" size="sm" className="text-red-600 border-red-200 hover:bg-red-50">
                            Kansellér
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Mobile view - Cards */}
            <div className="md:hidden space-y-4 mb-8">
              {bookings.map((booking) => (
                <Card key={booking.id}>
                  <CardContent className="p-4">
                    <h3 className="font-bold text-lg mb-1">{booking.facility}</h3>
                    <div className="space-y-2 mb-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Dato:</span>
                        <span>{formatDate(booking.date)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Tidspunkt:</span>
                        <span>{booking.time}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Status:</span>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          booking.status === 'bekreftet' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {booking.status}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button variant="outline" size="sm" className="flex-1">Endre</Button>
                      <Button variant="outline" size="sm" className="flex-1 text-red-600 border-red-200 hover:bg-red-50">
                        Kansellér
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        ) : (
          <Card className="bg-white rounded-md shadow p-6 text-center">
            <p className="text-gray-500 mb-4">Du har ingen bookinger enda.</p>
            <Button 
              className="bg-[#0B3D91] hover:bg-blue-700"
              onClick={() => navigate("/")}
            >
              Book et lokale
            </Button>
          </Card>
        )}
      </div>

      <GlobalFooter />
    </div>
  );
};

export default BookingsPage;
