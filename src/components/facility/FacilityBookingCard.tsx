
import React from "react";
import { Users, CalendarDays, Star, CheckCircle, Info, Images } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface FacilityBookingCardProps {
  facility: {
    id: string | undefined;
    name: string;
    capacity: number;
  };
  onBookClick: () => void;
}

export function FacilityBookingCard({ facility, onBookClick }: FacilityBookingCardProps) {
  return (
    <>
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

          <Button 
            className="w-full bg-[#0B3D91] hover:bg-blue-700 text-white font-medium shadow-sm h-12 mt-6"
            onClick={onBookClick}
          >
            Reserver nå
          </Button>
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
    </>
  );
}
