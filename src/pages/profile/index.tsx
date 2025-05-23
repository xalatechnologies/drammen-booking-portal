
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import GlobalHeader from "@/components/GlobalHeader";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Calendar, Clock, MapPin } from "lucide-react";
import { format } from "date-fns";
import { nb } from "date-fns/locale";

const ProfilePage: React.FC = () => {
  // Mock data for confirmed bookings
  const confirmedBookings = [
    {
      id: 1,
      facilityName: "Gymsal - Brandengen skole",
      location: "Brandengen skole, Knoffs gate 8, Drammen",
      date: new Date(2025, 4, 25, 14, 0),
      endDate: new Date(2025, 4, 25, 16, 0),
      status: "Bekreftet"
    },
    {
      id: 2,
      facilityName: "Møterom 3 - Rådhuset",
      location: "Rådhuset, Engene 1, Drammen",
      date: new Date(2025, 4, 26, 10, 0),
      endDate: new Date(2025, 4, 26, 12, 0),
      status: "Bekreftet"
    },
    {
      id: 3,
      facilityName: "Auditorium - Papirbredden",
      location: "Papirbredden, Grønland 58, Drammen",
      date: new Date(2025, 5, 3, 18, 0),
      endDate: new Date(2025, 5, 3, 21, 0),
      status: "Bekreftet"
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <GlobalHeader />
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">Min profil</h1>
        <div className="grid md:grid-cols-12 gap-6">
          <div className="md:col-span-4">
            <Card>
              <CardHeader>
                <div className="flex flex-col items-center">
                  <Avatar className="h-24 w-24 mb-4">
                    <AvatarFallback className="bg-blue-100 text-blue-600 text-xl">
                      BN
                    </AvatarFallback>
                  </Avatar>
                  <CardTitle>Bruker Navn</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground">
                  bruker@eksempel.no
                </p>
              </CardContent>
            </Card>
          </div>
          <div className="md:col-span-8">
            <Card>
              <CardHeader>
                <CardTitle>Mine bookinger</CardTitle>
              </CardHeader>
              <CardContent>
                {confirmedBookings.length > 0 ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Lokale</TableHead>
                          <TableHead>Dato</TableHead>
                          <TableHead>Tid</TableHead>
                          <TableHead>Sted</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {confirmedBookings.map((booking) => (
                          <TableRow key={booking.id}>
                            <TableCell className="font-medium">{booking.facilityName}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4 text-blue-500" />
                                <span>{format(booking.date, "d. MMM yyyy", {locale: nb})}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4 text-blue-500" />
                                <span>{format(booking.date, "HH:mm")} - {format(booking.endDate, "HH:mm")}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <MapPin className="h-4 w-4 text-blue-500" />
                                <span className="truncate max-w-[200px]" title={booking.location}>
                                  {booking.location}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                {booking.status}
                              </span>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <p className="text-muted-foreground">
                    Du har ingen bookinger for øyeblikket.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
