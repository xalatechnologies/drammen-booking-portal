
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Users, Clock } from 'lucide-react';
import { format } from 'date-fns';

const BookingsOverview = () => {
  // Fetch bookings with related data
  const { data: bookings, isLoading, error } = useQuery({
    queryKey: ['admin-bookings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('app_bookings')
        .select(`
          *,
          app_locations(name),
          app_zones(name)
        `)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      return data || [];
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Laster inn bookinger...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Feil ved lasting av bookinger</p>
        <Button onClick={() => window.location.reload()} className="mt-4">
          Prøv igjen
        </Button>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      pending: 'outline',
      confirmed: 'default',
      cancelled: 'destructive',
      completed: 'secondary'
    };
    
    return (
      <Badge variant={variants[status] || 'outline'}>
        {status === 'pending' ? 'Venter' : 
         status === 'confirmed' ? 'Bekreftet' :
         status === 'cancelled' ? 'Avbrutt' :
         status === 'completed' ? 'Fullført' : status}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Bookinger</h1>
          <p className="mt-2 text-gray-600">Oversikt over alle bookinger</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Totale bookinger</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{bookings?.length || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ventende</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {bookings?.filter(b => b.status === 'pending').length || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bekreftede</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {bookings?.filter(b => b.status === 'confirmed').length || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Denne måneden</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {bookings?.filter(b => {
                const bookingDate = new Date(b.created_at);
                const now = new Date();
                return bookingDate.getMonth() === now.getMonth() && 
                       bookingDate.getFullYear() === now.getFullYear();
              }).length || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bookings List */}
      <Card>
        <CardHeader>
          <CardTitle>Siste bookinger</CardTitle>
          <CardDescription>Oversikt over de nyeste bookinganmodningene</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {bookings && bookings.length > 0 ? (
              bookings.map((booking: any) => (
                <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-medium">
                        {booking.app_locations?.name || 'Ukjent lokale'}
                      </h3>
                      {getStatusBadge(booking.status)}
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>Zone: {booking.app_zones?.name || 'Ukjent zone'}</p>
                      <p>Type: {booking.type}</p>
                      <p>Fra: {format(new Date(booking.start_date_time), 'dd.MM.yyyy HH:mm')}</p>
                      <p>Til: {format(new Date(booking.end_date_time), 'dd.MM.yyyy HH:mm')}</p>
                      {booking.price && <p>Pris: {booking.price} kr</p>}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {booking.status === 'pending' && (
                      <>
                        <Button size="sm" variant="outline">
                          Godkjenn
                        </Button>
                        <Button size="sm" variant="destructive">
                          Avvis
                        </Button>
                      </>
                    )}
                    <Button size="sm" variant="ghost">
                      Detaljer
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Ingen bookinger funnet</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BookingsOverview;
