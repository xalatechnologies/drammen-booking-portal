
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { PageHeader } from "@/components/layouts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Search, Filter, Plus } from "lucide-react";
import { BookingService } from "@/services/BookingService";

const BookingsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterFacility, setFilterFacility] = useState("all");

  const { data: bookingsResponse, isLoading, refetch } = useQuery({
    queryKey: ['user-bookings'],
    queryFn: () => BookingService.getBookings({
      page: 1,
      limit: 50
    })
  });

  const bookings = bookingsResponse?.success ? bookingsResponse.data?.items || [] : [];

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = booking.facilityName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          booking.organizationName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || booking.status === filterStatus;
    const matchesFacility = filterFacility === "all" || booking.facilityId === filterFacility;
    return matchesSearch && matchesStatus && matchesFacility;
  });

  return (
    <div className="space-y-8">
      <PageHeader 
        title="Mine Bookinger"
        description="Oversikt over dine aktive og tidligere bookinger."
        actions={
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Ny booking
          </Button>
        }
      />
      
      <Card>
        <CardHeader>
          <CardTitle>Alle bookinger</CardTitle>
          <CardDescription>Se status og detaljer for dine bookinger.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6 flex flex-col sm:flex-row gap-4">
            <Input
              placeholder="Søk etter lokale eller organisasjon..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-md"
            />
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrer etter status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle statuser</SelectItem>
                <SelectItem value="pending">Venter godkjenning</SelectItem>
                <SelectItem value="confirmed">Bekreftet</SelectItem>
                <SelectItem value="cancelled">Avbrutt</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterFacility} onValueChange={setFilterFacility}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrer etter lokale" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle lokaler</SelectItem>
                <SelectItem value="1">Drammenshallen</SelectItem>
                <SelectItem value="2">Konnerudhallen</SelectItem>
                <SelectItem value="3">Brandengen skole</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {isLoading ? (
            <div className="text-center py-8">
              <p>Laster bookinger...</p>
            </div>
          ) : filteredBookings.length > 0 ? (
            <div className="space-y-4">
              {filteredBookings.map(booking => (
                <Card key={booking.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">{booking.facilityName || 'Ukjent lokale'}</CardTitle>
                        <p className="text-sm text-gray-600">{booking.organizationName || 'Ukjent organisasjon'}</p>
                      </div>
                      <Badge variant={
                        booking.status === 'confirmed' ? 'default' : 
                        booking.status === 'pending' ? 'secondary' : 
                        'destructive'
                      }>
                        {booking.status === 'confirmed' ? 'Bekreftet' :
                         booking.status === 'pending' ? 'Venter' :
                         booking.status === 'cancelled' ? 'Avbrutt' : booking.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span className="text-sm">{booking.startTime || 'Ikke angitt'} - {booking.endTime || 'Ikke angitt'}</span>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">Se detaljer</Button>
                        {booking.status === 'pending' && (
                          <Button variant="ghost" size="sm">Avbryt</Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">Ingen bookinger funnet.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BookingsPage;
