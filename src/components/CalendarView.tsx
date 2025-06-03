
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format, addDays, startOfWeek, addWeeks, subWeeks } from "date-fns";
import { ChevronLeft, ChevronRight, CalendarDays } from "lucide-react";
import { nb } from "date-fns/locale";
import { isDateUnavailable, isNorwegianHoliday } from "@/utils/holidaysAndAvailability";

interface Booking {
  id: number;
  facilityId: number;
  facilityName: string;
  date: Date;
  endDate: Date;
  status: string;
}

interface CalendarViewProps {
  date?: Date;
  facilityType?: string;
  location?: string;
  accessibility?: string;
  capacity?: number[];
}

const CalendarView: React.FC<CalendarViewProps> = ({
  date,
  facilityType,
  location,
  accessibility,
  capacity,
}) => {
  const [currentWeekStart, setCurrentWeekStart] = useState(startOfWeek(date || new Date(), { weekStartsOn: 1 }));
  
  // Mock data for facility bookings
  const facilities = [
    {
      id: 1,
      name: "Brandengen Skole - Gymsal",
      location: "Drammen sentrum",
      type: "sports-hall",
      capacity: 120,
      accessibility: ["wheelchair"],
      bookings: [
        { id: 101, date: new Date(2025, 4, 25, 14, 0), endDate: new Date(2025, 4, 25, 16, 0), status: "confirmed" },
        { id: 102, date: new Date(2025, 4, 26, 10, 0), endDate: new Date(2025, 4, 26, 12, 0), status: "pending" }
      ]
    },
    {
      id: 2,
      name: "Fjell Skole - Aktivitetshall",
      location: "konnerud",
      type: "gymnasium",
      capacity: 200,
      accessibility: ["wheelchair", "hearing-loop"],
      bookings: [
        { id: 201, date: new Date(2025, 4, 27, 17, 0), endDate: new Date(2025, 4, 27, 19, 0), status: "confirmed" }
      ]
    },
    {
      id: 3,
      name: "Rådhuset - Møterom 3",
      location: "drammen-sentrum",
      type: "meeting-room",
      capacity: 30,
      accessibility: ["wheelchair", "hearing-loop", "sign-language"],
      bookings: []
    }
  ];

  const days = Array(7).fill(0).map((_, i) => addDays(currentWeekStart, i));
  
  // Filter facilities based on search criteria
  const filteredFacilities = facilities.filter(facility => {
    if (facilityType && facility.type !== facilityType) return false;
    if (location && facility.location !== location) return false;
    if (accessibility && !facility.accessibility.includes(accessibility)) return false;
    if (capacity && (facility.capacity < capacity[0] || facility.capacity > capacity[1])) return false;
    return true;
  });

  // Function to check if a time slot is booked
  const isTimeSlotBooked = (facilityId: number, day: Date, hour: number) => {
    const facility = facilities.find(f => f.id === facilityId);
    if (!facility) return false;
    
    return facility.bookings.some(booking => {
      const bookingDate = new Date(booking.date);
      const bookingEndDate = new Date(booking.endDate);
      const slotStart = new Date(day.setHours(hour, 0, 0, 0));
      const slotEnd = new Date(day.setHours(hour + 1, 0, 0, 0));
      
      return (
        bookingDate.getDate() === day.getDate() &&
        bookingDate.getMonth() === day.getMonth() &&
        bookingDate.getFullYear() === day.getFullYear() &&
        ((bookingDate <= slotStart && bookingEndDate > slotStart) ||
         (bookingDate >= slotStart && bookingDate < slotEnd))
      );
    });
  };

  // Hours to display in the calendar (simplified to 4-hour blocks for this view)
  const hours = [8, 12, 16, 20];
  
  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setCurrentWeekStart(subWeeks(currentWeekStart, 1))}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Forrige uke
        </Button>
        
        <div className="flex items-center">
          <CalendarDays className="h-5 w-5 mr-2 text-blue-600" />
          <span className="font-medium">
            Uke {format(currentWeekStart, "w", { locale: nb })}: {format(currentWeekStart, "dd.MM")} - {format(addDays(currentWeekStart, 6), "dd.MM.yyyy")}
          </span>
        </div>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setCurrentWeekStart(addWeeks(currentWeekStart, 1))}
        >
          Neste uke
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>

      <Card className="overflow-hidden">
        <CardHeader className="bg-gray-50 py-3">
          <CardTitle className="text-lg">Lokale-tilgjengelighet</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="p-2 text-left border-b border-r min-w-[200px]">Lokale</th>
                  {days.map((day, i) => {
                    const unavailableCheck = isDateUnavailable(day);
                    const holidayCheck = isNorwegianHoliday(day);
                    
                    let headerClass = "";
                    if (unavailableCheck.isUnavailable) {
                      switch (unavailableCheck.reason) {
                        case 'past':
                          headerClass = "bg-gray-200 text-gray-600";
                          break;
                        case 'weekend':
                          headerClass = "bg-amber-100 text-amber-800";
                          break;
                        case 'holiday':
                          headerClass = "bg-red-200 text-red-800 font-bold";
                          break;
                        case 'maintenance':
                          headerClass = "bg-yellow-200 text-yellow-800";
                          break;
                      }
                    } else {
                      headerClass = "bg-green-100 text-green-800";
                    }
                    
                    return (
                      <th key={i} className={`p-2 text-center border-b min-w-[100px] ${headerClass}`}>
                        <div className="font-medium">{format(day, "EEEE", { locale: nb })}</div>
                        <div className="text-sm">{format(day, "dd.MM")}</div>
                        {holidayCheck.isHoliday && (
                          <div className="text-xs font-semibold mt-1 text-red-800">
                            {holidayCheck.name}
                          </div>
                        )}
                        {unavailableCheck.isUnavailable && !holidayCheck.isHoliday && (
                          <div className="text-xs mt-1">
                            {unavailableCheck.details}
                          </div>
                        )}
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {filteredFacilities.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-4 text-center text-gray-500">
                      Ingen lokaler funnet med valgte filtre
                    </td>
                  </tr>
                ) : (
                  filteredFacilities.map((facility) => (
                    <React.Fragment key={facility.id}>
                      {hours.map((hour, hourIndex) => (
                        <tr key={`${facility.id}-${hour}`} className={hourIndex === 0 ? "border-t-2 border-gray-200" : ""}>
                          {hourIndex === 0 && (
                            <td rowSpan={hours.length} className="p-2 border-r align-top">
                              <div className="font-medium">{facility.name}</div>
                              <div className="text-sm text-gray-500 mt-1">Kapasitet: {facility.capacity} personer</div>
                              <div className="flex flex-wrap gap-1 mt-2">
                                {facility.accessibility.includes("wheelchair") && (
                                  <span className="px-1.5 py-0.5 bg-blue-100 text-blue-800 rounded-md text-xs">Rullestol</span>
                                )}
                                {facility.accessibility.includes("hearing-loop") && (
                                  <span className="px-1.5 py-0.5 bg-green-100 text-green-800 rounded-md text-xs">Teleslynge</span>
                                )}
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                className="mt-2 text-xs w-full"
                                onClick={() => window.location.href = `/facilities/${facility.id}`}
                              >
                                Se detaljer
                              </Button>
                            </td>
                          )}
                          
                          <td className="p-2 text-center border text-sm">
                            <div className="font-medium">{hour}:00 - {hour + 4}:00</div>
                            {days.map((day, dayIndex) => {
                              const unavailableCheck = isDateUnavailable(new Date(day));
                              const isBooked = isTimeSlotBooked(facility.id, new Date(day), hour);
                              
                              // If the day is unavailable, show the reason with appropriate styling
                              if (unavailableCheck.isUnavailable) {
                                const bgColor = {
                                  'past': 'bg-gray-200',
                                  'weekend': 'bg-amber-200',
                                  'holiday': 'bg-red-300',
                                  'maintenance': 'bg-yellow-200'
                                }[unavailableCheck.reason!];
                                
                                const textColor = {
                                  'past': 'text-gray-600',
                                  'weekend': 'text-amber-800',
                                  'holiday': 'text-red-800',
                                  'maintenance': 'text-yellow-800'
                                }[unavailableCheck.reason!];
                                
                                return (
                                  <td 
                                    key={dayIndex} 
                                    className={`p-2 border text-center ${bgColor}`}
                                    title={unavailableCheck.details}
                                  >
                                    <span className={`${textColor} font-semibold`}>
                                      {unavailableCheck.reason === 'past' ? 'Fortid' : 
                                       unavailableCheck.reason === 'weekend' ? 'Helg' :
                                       unavailableCheck.reason === 'holiday' ? 'Helligdag' : 'Vedlikehold'}
                                    </span>
                                  </td>
                                );
                              }
                              
                              return (
                                <td 
                                  key={dayIndex} 
                                  className={`p-2 border text-center ${isBooked ? 'bg-red-200' : 'bg-green-100'}`}
                                >
                                  {isBooked ? (
                                    <span className="text-red-800 font-bold">Opptatt</span>
                                  ) : (
                                    <Button 
                                      variant="ghost" 
                                      size="sm"
                                      className="text-green-800 hover:text-green-900 hover:bg-green-200 font-semibold"
                                      onClick={() => window.location.href = `/facilities/${facility.id}?date=${format(day, 'yyyy-MM-dd')}&time=${hour}:00`}
                                    >
                                      Ledig
                                    </Button>
                                  )}
                                </td>
                              );
                            })}
                          </td>
                        </tr>
                      ))}
                    </React.Fragment>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CalendarView;
