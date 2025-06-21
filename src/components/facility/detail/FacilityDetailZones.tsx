
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Users, MapPin, Repeat } from 'lucide-react';
import { Zone } from '@/components/booking/types';
import { useNavigate } from 'react-router-dom';

interface FacilityDetailZonesProps {
  zones: Zone[];
  facilityId: string;
  facilityName: string;
}

export function FacilityDetailZones({ zones, facilityId, facilityName }: FacilityDetailZonesProps) {
  const navigate = useNavigate();
  const [selectedZone, setSelectedZone] = useState<Zone | null>(zones[0] || null);

  if (!zones || zones.length === 0) {
    return null;
  }

  const handleRecurringBooking = (zoneId: string) => {
    navigate(`/booking/${facilityId}?zone=${zoneId}&recurring=true`);
  };

  const handleBookZone = (zoneId: string) => {
    navigate(`/booking/${facilityId}?zone=${zoneId}`);
  };

  // If only one zone, show simple layout
  if (zones.length === 1) {
    const zone = zones[0];
    return (
      <Card className="w-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">{zone.name}</CardTitle>
              <p className="text-gray-600 mt-1">{zone.description}</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">
                {zone.pricePerHour} kr
              </div>
              <div className="text-sm text-gray-500">per time</div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-gray-600" />
              <span className="text-sm text-gray-700">{zone.capacity} plasser</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-gray-600" />
              <span className="text-sm text-gray-700">{zone.area}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-gray-600" />
              <span className="text-sm text-gray-700">
                Min {zone.bookingRules?.minBookingDuration || 1}t booking
              </span>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button 
              onClick={() => handleBookZone(zone.id)}
              className="flex-1 bg-[#1e3a8a] hover:bg-[#1e40af] text-white"
            >
              Book denne sonen
            </Button>
            <Button 
              onClick={() => handleRecurringBooking(zone.id)}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Repeat className="h-4 w-4" />
              Gjentakende booking
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Multiple zones - show tabs
  return (
    <div className="w-full">
      <Tabs value={selectedZone?.id} onValueChange={(zoneId) => {
        const zone = zones.find(z => z.id === zoneId);
        setSelectedZone(zone || null);
      }}>
        <TabsList className="grid w-full grid-cols-auto">
          {zones.map((zone) => (
            <TabsTrigger key={zone.id} value={zone.id} className="text-sm">
              {zone.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {zones.map((zone) => (
          <TabsContent key={zone.id} value={zone.id}>
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl">{zone.name}</CardTitle>
                    <p className="text-gray-600 mt-1">{zone.description}</p>
                    {zone.isMainZone && (
                      <Badge className="mt-2 bg-blue-100 text-blue-800 border-blue-200">
                        Hovedsone
                      </Badge>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">
                      {zone.pricePerHour} kr
                    </div>
                    <div className="text-sm text-gray-500">per time</div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-gray-600" />
                    <span className="text-sm text-gray-700">{zone.capacity} plasser</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-gray-600" />
                    <span className="text-sm text-gray-700">{zone.area}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-gray-600" />
                    <span className="text-sm text-gray-700">
                      Min {zone.bookingRules?.minBookingDuration || 1}t booking
                    </span>
                  </div>
                </div>

                {/* Equipment */}
                {zone.equipment && zone.equipment.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">
                      Utstyr inkludert
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {zone.equipment.slice(0, 6).map((item, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {item}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Accessibility */}
                {zone.accessibility && zone.accessibility.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">
                      Tilgjengelighet
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {zone.accessibility.map((feature, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <Button 
                    onClick={() => handleBookZone(zone.id)}
                    className="flex-1 bg-[#1e3a8a] hover:bg-[#1e40af] text-white"
                  >
                    Book denne sonen
                  </Button>
                  <Button 
                    onClick={() => handleRecurringBooking(zone.id)}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <Repeat className="h-4 w-4" />
                    Gjentakende booking
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
