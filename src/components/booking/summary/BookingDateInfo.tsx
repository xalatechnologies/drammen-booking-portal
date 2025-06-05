
import React from "react";
import { format } from "date-fns";
import { nb } from "date-fns/locale";
import { CalendarDays, Clock, Users, Calendar, Repeat } from "lucide-react";

interface BookingDateInfoProps {
  bookingMode: "one-time" | "date-range" | "recurring";
  date: Date;
  endDate?: Date;
  timeSlot: string;
  attendees: number;
  recurrenceDescription?: string;
}

export function BookingDateInfo({ 
  bookingMode, 
  date, 
  endDate, 
  timeSlot, 
  attendees, 
  recurrenceDescription 
}: BookingDateInfoProps) {
  const renderDateInfo = () => {
    switch (bookingMode) {
      case "one-time":
        return (
          <div className="flex items-start gap-3">
            <div className="bg-blue-50 p-2 rounded-md text-blue-600">
              <Calendar className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Dato</p>
              <p className="font-medium">{format(date, "EEEE d. MMMM yyyy", { locale: nb })}</p>
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
                {format(date, "d. MMMM yyyy", { locale: nb })} 
                {endDate ? ` - ${format(endDate, "d. MMMM yyyy", { locale: nb })}` : ""}
              </p>
              <p className="text-sm text-blue-600">
                {endDate ? 
                  `${Math.ceil((endDate.getTime() - date.getTime()) / (1000 * 60 * 60 * 24) + 1)} dager` 
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
                <p className="font-medium">{format(date, "EEEE d. MMMM yyyy", { locale: nb })}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="bg-blue-50 p-2 rounded-md text-blue-600">
                <Repeat className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Gjentagelse</p>
                <p className="font-medium">{recurrenceDescription || "Hver uke"}</p>
                {endDate && (
                  <p className="text-sm text-blue-600">
                    Til {format(endDate, "d. MMMM yyyy", { locale: nb })}
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
    <div className="space-y-4">
      {renderDateInfo()}
      
      <div className="flex items-start gap-3">
        <div className="bg-blue-50 p-2 rounded-md text-blue-600">
          <Clock className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm text-gray-500">Tidspunkt</p>
          <p className="font-medium">{timeSlot}</p>
        </div>
      </div>
      
      <div className="flex items-start gap-3">
        <div className="bg-blue-50 p-2 rounded-md text-blue-600">
          <Users className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm text-gray-500">Antall deltakere</p>
          <p className="font-medium">{attendees}</p>
        </div>
      </div>
    </div>
  );
}
