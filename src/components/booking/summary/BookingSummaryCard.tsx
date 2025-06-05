
import React from "react";
import { format } from "date-fns";
import { nb } from "date-fns/locale";
import { MapPin, InfoIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { BookingDateInfo } from "./BookingDateInfo";
import { BookingContactInfo } from "./BookingContactInfo";
import { BookingData } from "../BookingSummary";

interface BookingSummaryCardProps {
  facilityName: string;
  bookingData: BookingData;
}

export function BookingSummaryCard({ facilityName, bookingData }: BookingSummaryCardProps) {
  return (
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
          <BookingDateInfo
            bookingMode={bookingData.bookingMode}
            date={bookingData.date}
            endDate={bookingData.endDate}
            timeSlot={bookingData.timeSlot}
            attendees={bookingData.attendees}
            recurrenceDescription={bookingData.recurrenceDescription}
          />
          
          <BookingContactInfo
            contactName={bookingData.contactName}
            contactEmail={bookingData.contactEmail}
            contactPhone={bookingData.contactPhone}
            organization={bookingData.organization}
          />
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
  );
}
