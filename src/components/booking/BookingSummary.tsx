
import React from "react";
import { format } from "date-fns";
import { nb } from "date-fns/locale";
import { CalendarDays, Clock, Users, Mail, Phone, User, Building, Repeat, MapPin, Calendar, InfoIcon, Calculator } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { PriceBreakdown } from "./PriceBreakdown";
import { usePriceCalculation } from "@/hooks/usePriceCalculation";

export interface BookingData {
  date: Date;
  bookingMode: "one-time" | "date-range" | "recurring";
  timeSlot: string;
  purpose: string;
  attendees: number;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  organization?: string;
  endDate?: Date;
  recurrenceRule?: string;
  recurrenceDescription?: string;
  zoneId?: string;
  zoneName?: string;
}

interface BookingSummaryProps {
  facilityName: string;
  facilityId?: string;
  bookingData: BookingData;
}

export function BookingSummary({ facilityName, facilityId, bookingData }: BookingSummaryProps) {
  // Calculate price for the booking
  const { calculation, isLoading } = usePriceCalculation({
    facilityId: facilityId,
    zoneId: bookingData.zoneId,
    startDate: bookingData.date,
    endDate: bookingData.endDate,
    timeSlot: bookingData.timeSlot,
    customerType: 'private',
    bookingMode: bookingData.bookingMode
  });

  const renderDateInfo = () => {
    switch (bookingData.bookingMode) {
      case "one-time":
        return (
          <div className="flex items-start gap-3">
            <div className="bg-blue-50 p-2 rounded-md text-blue-600">
              <Calendar className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Dato</p>
              <p className="font-medium">{format(bookingData.date, "EEEE d. MMMM yyyy", { locale: nb })}</p>
            </div>
          </div>
        );
        
      case "date-range":
        return (
          <div className="flex items-start gap-3">
            <div className="bg-blue-50 p-2 rounded-md text-blue-600">
              <CalendarDays className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Periode</p>
              <p className="font-medium">
                {format(bookingData.date, "d. MMMM yyyy", { locale: nb })} 
                {bookingData.endDate ? ` - ${format(bookingData.endDate, "d. MMMM yyyy", { locale: nb })}` : ""}
              </p>
              <p className="text-sm text-blue-600">
                {bookingData.endDate ? 
                  `${Math.ceil((bookingData.endDate.getTime() - bookingData.date.getTime()) / (1000 * 60 * 60 * 24) + 1)} dager` 
                  : ""}
              </p>
            </div>
          </div>
        );
        
      case "recurring":
        return (
          <>
            <div className="flex items-start gap-3">
              <div className="bg-blue-50 p-2 rounded-md text-blue-600">
                <Calendar className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Startdato</p>
                <p className="font-medium">{format(bookingData.date, "EEEE d. MMMM yyyy", { locale: nb })}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="bg-blue-50 p-2 rounded-md text-blue-600">
                <Repeat className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Gjentagelse</p>
                <p className="font-medium">{bookingData.recurrenceDescription || "Hver uke"}</p>
                {bookingData.endDate && (
                  <p className="text-sm text-blue-600">
                    Til {format(bookingData.endDate, "d. MMMM yyyy", { locale: nb })}
                  </p>
                )}
              </div>
            </div>
          </>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border border-gray-200 shadow-sm">
        <CardContent className="p-6 space-y-5">
          <div className="flex items-center justify-between border-b pb-3">
            <h4 className="font-medium text-lg flex items-center">
              <MapPin className="h-5 w-5 text-blue-600 mr-2" />
              <span>{facilityName}</span>
            </h4>
            <span className={`px-3 py-1 rounded-full text-xs font-medium
              ${bookingData.bookingMode === 'one-time' && 'bg-blue-100 text-blue-800'} 
              ${bookingData.bookingMode === 'date-range' && 'bg-purple-100 text-purple-800'}
              ${bookingData.bookingMode === 'recurring' && 'bg-green-100 text-green-800'}`
            }>
              {bookingData.bookingMode === 'one-time' && 'Enkelt dag'}
              {bookingData.bookingMode === 'date-range' && 'Datointervall'}
              {bookingData.bookingMode === 'recurring' && 'Gjentakende'}
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-4">
              {renderDateInfo()}
              
              <div className="flex items-start gap-3">
                <div className="bg-blue-50 p-2 rounded-md text-blue-600">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Tidspunkt</p>
                  <p className="font-medium">{bookingData.timeSlot}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="bg-blue-50 p-2 rounded-md text-blue-600">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Antall deltakere</p>
                  <p className="font-medium">{bookingData.attendees}</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="bg-green-50 p-2 rounded-md text-green-600">
                  <User className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Kontaktperson</p>
                  <p className="font-medium">{bookingData.contactName}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="bg-green-50 p-2 rounded-md text-green-600">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">E-post</p>
                  <p className="font-medium">{bookingData.contactEmail}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="bg-green-50 p-2 rounded-md text-green-600">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Telefon</p>
                  <p className="font-medium">{bookingData.contactPhone}</p>
                </div>
              </div>
              
              {bookingData.organization && (
                <div className="flex items-start gap-3">
                  <div className="bg-green-50 p-2 rounded-md text-green-600">
                    <Building className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Organisasjon</p>
                    <p className="font-medium">{bookingData.organization}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="border-t border-gray-100 pt-4 mt-4">
            <div className="flex items-start gap-3">
              <div className="bg-amber-50 p-2 rounded-md text-amber-600">
                <InfoIcon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Formål med reservasjonen</p>
                <p className="text-gray-800">{bookingData.purpose}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 text-center mt-6">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <p className="text-blue-800 flex items-center justify-center">
                    {bookingData.bookingMode === "one-time" && (
                      <>
                        Du er i ferd med å reservere <span className="font-medium mx-1">{facilityName}</span> 
                        for {format(bookingData.date, "EEEE d. MMMM", { locale: nb })} kl. {bookingData.timeSlot}
                      </>
                    )}
                    {bookingData.bookingMode === "date-range" && (
                      <>
                        Du er i ferd med å reservere <span className="font-medium mx-1">{facilityName}</span> 
                        fra {format(bookingData.date, "d. MMMM", { locale: nb })}
                        {bookingData.endDate ? ` til ${format(bookingData.endDate, "d. MMMM", { locale: nb })}` : ""} 
                        kl. {bookingData.timeSlot}
                      </>
                    )}
                    {bookingData.bookingMode === "recurring" && (
                      <>
                        Du er i ferd med å reservere <span className="font-medium mx-1">{facilityName}</span> 
                        {bookingData.recurrenceDescription?.toLowerCase() || "ukentlig"}  
                        fra {format(bookingData.date, "d. MMMM", { locale: nb })}
                        {bookingData.endDate ? ` til ${format(bookingData.endDate, "d. MMMM", { locale: nb })}` : ""} 
                        kl. {bookingData.timeSlot}
                      </>
                    )}
                  </p>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-sm max-w-xs">Klikk på 'Send inn reservasjon' når du er klar til å sende denne forespørselen.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </CardContent>
      </Card>

      {/* Price Calculation */}
      {facilityId && bookingData.zoneId && (
        <PriceBreakdown 
          calculation={calculation || { basePrice: 0, totalHours: 0, totalDays: 0, customerTypeDiscount: 0, weekendSurcharge: 0, subtotal: 0, finalPrice: 0, breakdown: [] }}
          isLoading={isLoading}
          showDetailed={true}
        />
      )}
    </div>
  );
}
