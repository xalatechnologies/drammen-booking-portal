
import React from "react";
import { format } from "date-fns";
import { nb } from "date-fns/locale";
import { CalendarDays, Clock, Users, Mail, Phone, User, Building, Repeat } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

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
}

interface BookingSummaryProps {
  facilityName: string;
  bookingData: BookingData;
}

export function BookingSummary({ facilityName, bookingData }: BookingSummaryProps) {
  const renderDateInfo = () => {
    switch (bookingData.bookingMode) {
      case "one-time":
        return (
          <div className="flex items-start gap-3">
            <div className="bg-blue-50 p-1.5 rounded-md text-blue-600">
              <CalendarDays className="h-4 w-4" />
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
            <div className="bg-blue-50 p-1.5 rounded-md text-blue-600">
              <CalendarDays className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Periode</p>
              <p className="font-medium">
                {format(bookingData.date, "d. MMMM yyyy", { locale: nb })} 
                {bookingData.endDate ? ` - ${format(bookingData.endDate, "d. MMMM yyyy", { locale: nb })}` : ""}
              </p>
            </div>
          </div>
        );
        
      case "recurring":
        return (
          <>
            <div className="flex items-start gap-3">
              <div className="bg-blue-50 p-1.5 rounded-md text-blue-600">
                <CalendarDays className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Startdato</p>
                <p className="font-medium">{format(bookingData.date, "EEEE d. MMMM yyyy", { locale: nb })}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="bg-blue-50 p-1.5 rounded-md text-blue-600">
                <Repeat className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Gjentagelse</p>
                <p className="font-medium">{bookingData.recurrenceDescription || "Hver uke"}</p>
                {bookingData.endDate && (
                  <p className="text-sm text-gray-500">
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
    <Card className="border border-gray-200">
      <CardContent className="p-6 space-y-4">
        <h4 className="font-medium text-lg">Reservasjonsdetaljer</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            {renderDateInfo()}
            
            <div className="flex items-start gap-3">
              <div className="bg-blue-50 p-1.5 rounded-md text-blue-600">
                <Clock className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Tidspunkt</p>
                <p className="font-medium">{bookingData.timeSlot}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="bg-blue-50 p-1.5 rounded-md text-blue-600">
                <Users className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Antall deltakere</p>
                <p className="font-medium">{bookingData.attendees}</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="bg-green-50 p-1.5 rounded-md text-green-600">
                <User className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Kontaktperson</p>
                <p className="font-medium">{bookingData.contactName}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="bg-green-50 p-1.5 rounded-md text-green-600">
                <Mail className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm text-gray-500">E-post</p>
                <p className="font-medium">{bookingData.contactEmail}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="bg-green-50 p-1.5 rounded-md text-green-600">
                <Phone className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Telefon</p>
                <p className="font-medium">{bookingData.contactPhone}</p>
              </div>
            </div>
            
            {bookingData.organization && (
              <div className="flex items-start gap-3">
                <div className="bg-green-50 p-1.5 rounded-md text-green-600">
                  <Building className="h-4 w-4" />
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
          <p className="text-sm text-gray-500">Formål med reservasjonen</p>
          <p className="mt-1">{bookingData.purpose}</p>
        </div>
        
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 text-center">
          <p className="text-blue-800">
            {bookingData.bookingMode === "one-time" && (
              <>
                Du er i ferd med å reservere <span className="font-medium">{facilityName}</span> for {format(bookingData.date, "EEEE d. MMMM", { locale: nb })} kl. {bookingData.timeSlot}
              </>
            )}
            {bookingData.bookingMode === "date-range" && (
              <>
                Du er i ferd med å reservere <span className="font-medium">{facilityName}</span> fra {format(bookingData.date, "d. MMMM", { locale: nb })}
                {bookingData.endDate ? ` til ${format(bookingData.endDate, "d. MMMM", { locale: nb })}` : ""} kl. {bookingData.timeSlot}
              </>
            )}
            {bookingData.bookingMode === "recurring" && (
              <>
                Du er i ferd med å reservere <span className="font-medium">{facilityName}</span> {bookingData.recurrenceDescription?.toLowerCase() || "ukentlig"} 
                fra {format(bookingData.date, "d. MMMM", { locale: nb })}
                {bookingData.endDate ? ` til ${format(bookingData.endDate, "d. MMMM", { locale: nb })}` : ""} kl. {bookingData.timeSlot}
              </>
            )}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
