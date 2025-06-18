import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format, addDays, startOfWeek, addWeeks, subWeeks, isAfter, startOfDay } from "date-fns";
import { ChevronLeft, ChevronRight, Calendar, Clock, Users, MapPin } from "lucide-react";
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
  
  // Check if we can go to previous week (prevent going to past dates)
  const today = startOfDay(new Date());
  const previousWeekStart = subWeeks(currentWeekStart, 1);
  const canGoPrevious = isAfter(addDays(previousWeekStart, 6), today) || format(addDays(previousWeekStart, 6), 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd');
  
  // Mock data for facility bookings
  const facilities = [
    {
      id: 1,
      name: "Brandengen Skole - Gymsal",
      location: "Drammen sentrum",
      type: "sports-hall",
      capacity: 120,
      accessibility: ["wheelchair"],
      address: "Knoffs gate 8, Drammen",
      suitableFor: ["Basketball", "Volleyball", "Badminton"],
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
      address: "Fjellstrand 15, Drammen",
      suitableFor: ["Fotball", "Håndball", "Turn"],
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
      address: "Engene 1, Drammen",
      suitableFor: ["Møter", "Presentasjoner", "Workshops"],
      bookings: []
    }
  ];

  const days = Array(7).fill(0).map((_, i) => addDays(currentWeekStart, i));
  
  const filteredFacilities = facilities.filter(facility => {
    if (facilityType && facility.type !== facilityType) return false;
    if (location && facility.location !== location) return false;
    if (accessibility && !facility.accessibility.includes(accessibility)) return false;
    if (capacity && (facility.capacity < capacity[0] || facility.capacity > capacity[1])) return false;
    return true;
  });

  const isTimeSlotBooked = (facilityId: number, day: Date, hour: number) => {
    const facility = facilities.find(f => f.id === facilityId);
    if (!facility) return false;
    
    return facility.bookings.some(booking => {
      const bookingDate = new Date(booking.date);
      const bookingEndDate = new Date(booking.endDate);
      const slotStart = new Date(day.setHours(hour, 0, 0, 0));
      const slotEnd = new Date(day.setHours(hour + 2, 0, 0, 0));
      
      return (
        bookingDate.getDate() === day.getDate() &&
        bookingDate.getMonth() === day.getMonth() &&
        bookingDate.getFullYear() === day.getFullYear() &&
        ((bookingDate <= slotStart && bookingEndDate > slotStart) ||
         (bookingDate >= slotStart && bookingDate < slotEnd))
      );
    });
  };

  const timeSlots = ["08:00-10:00", "10:00-12:00", "12:00-14:00", "14:00-16:00", "16:00-18:00", "18:00-20:00", "20:00-22:00"];
  
  return (
    <div className="mb-8 space-y-6">
      {/* Enhanced Week Navigation */}
      <div className="flex items-center justify-between p-4 bg-white rounded-lg border shadow-sm">
        <Button 
          variant="outline" 
          onClick={() => setCurrentWeekStart(subWeeks(currentWeekStart, 1))}
          disabled={!canGoPrevious}
          className="flex items-center gap-2 h-10 px-4"
        >
          <ChevronLeft className="h-4 w-4" />
          Forrige
        </Button>
        
        <div className="flex items-center gap-3 bg-blue-50 px-4 py-2 rounded-lg border border-blue-200">
          <Calendar className="h-5 w-5 text-blue-600" />
          <span className="font-semibold text-blue-900">
            {format(currentWeekStart, "dd.MM", { locale: nb })} - {format(addDays(currentWeekStart, 6), "dd.MM.yyyy", { locale: nb })}
          </span>
        </div>
        
        <Button 
          variant="outline" 
          onClick={() => setCurrentWeekStart(addWeeks(currentWeekStart, 1))}
          className="flex items-center gap-2 h-10 px-4"
        >
          Neste
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Enhanced Calendar Grid */}
      <Card className="shadow-lg border-0">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4">
          <CardTitle className="text-xl font-semibold flex items-center gap-2">
            <Calendar className="h-6 w-6" />
            Lokaler og tilgjengelighet
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {filteredFacilities.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium">Ingen lokaler funnet</p>
              <p className="text-sm">Prøv å justere filtrene dine</p>
            </div>
          ) : (
            <div className="space-y-0">
              {filteredFacilities.map((facility, facilityIndex) => (
                <div 
                  key={facility.id} 
                  className={`${facilityIndex !== 0 ? 'border-t-2 border-gray-100' : ''}`}
                >
                  {/* Facility Header */}
                  <div className="bg-gray-50 p-4 border-b">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-bold text-lg text-gray-900 mb-2">{facility.name}</h3>
                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            <span>{facility.address}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            <span>{facility.capacity} personer</span>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {facility.suitableFor.slice(0, 3).map((activity, index) => (
                            <Badge
                              key={index}
                              className="bg-blue-100 text-blue-800 border-blue-200 text-xs"
                            >
                              {activity}
                            </Badge>
                          ))}
                          {facility.accessibility.includes("wheelchair") && (
                            <Badge className="bg-green-100 text-green-800 border-green-200 text-xs">
                              Rullestol
                            </Badge>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="shrink-0"
                        onClick={() => window.location.href = `/facilities/${facility.id}`}
                      >
                        Se detaljer
                      </Button>
                    </div>
                  </div>

                  {/* Time Slots Grid */}
                  <div className="overflow-x-auto">
                    <div className="min-w-[800px]">
                      {/* Day Headers */}
                      <div className="grid grid-cols-8 border-b bg-white">
                        <div className="p-3 border-r bg-gray-50 flex items-center">
                          <Clock className="h-4 w-4 mr-2 text-gray-500" />
                          <span className="font-medium text-gray-700">Tid</span>
                        </div>
                        {days.map((day, i) => {
                          const unavailableCheck = isDateUnavailable(day);
                          const holidayCheck = isNorwegianHoliday(day);
                          const isToday = format(day, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
                          
                          let headerClass = "p-3 border-r text-center ";
                          if (isToday) {
                            headerClass += "bg-blue-100 border-l-4 border-l-blue-500";
                          } else if (unavailableCheck.isUnavailable) {
                            switch (unavailableCheck.reason) {
                              case 'weekend':
                                headerClass += "bg-amber-50";
                                break;
                              case 'holiday':
                                headerClass += "bg-red-50";
                                break;
                              default:
                                headerClass += "bg-gray-50";
                            }
                          } else {
                            headerClass += "bg-green-50";
                          }
                          
                          return (
                            <div key={i} className={headerClass}>
                              <div className={`font-medium ${isToday ? 'text-blue-800' : 'text-gray-700'}`}>
                                {format(day, "EEE", { locale: nb })}
                              </div>
                              <div className={`text-sm font-bold ${isToday ? 'text-blue-900' : 'text-gray-900'}`}>
                                {format(day, "dd.MM", { locale: nb })}
                              </div>
                              {holidayCheck.isHoliday && (
                                <div className="text-xs text-red-600 mt-1" title={holidayCheck.name}>
                                  {holidayCheck.name?.substring(0, 6)}...
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {/* Time Slot Rows */}
                      {timeSlots.map((timeSlot, timeIndex) => (
                        <div key={timeSlot} className="grid grid-cols-8 border-b hover:bg-gray-50/50">
                          <div className="p-3 border-r bg-gray-50 font-medium text-gray-700 flex items-center">
                            {timeSlot}
                          </div>
                          {days.map((day, dayIndex) => {
                            const unavailableCheck = isDateUnavailable(new Date(day));
                            const isBooked = isTimeSlotBooked(facility.id, new Date(day), parseInt(timeSlot.split(':')[0]));
                            
                            let cellClass = "p-3 border-r text-center relative ";
                            let content = null;
                            let clickHandler = null;

                            if (unavailableCheck.isUnavailable) {
                              cellClass += "bg-gray-100";
                              content = (
                                <span className="text-gray-500 text-sm font-medium">
                                  {unavailableCheck.reason === 'past' ? 'Fortid' : 
                                   unavailableCheck.reason === 'weekend' ? 'Helg' :
                                   unavailableCheck.reason === 'holiday' ? 'Helligdag' : 'Stengt'}
                                </span>
                              );
                            } else if (isBooked) {
                              cellClass += "bg-red-100";
                              content = (
                                <Badge variant="destructive" className="text-xs">
                                  Opptatt
                                </Badge>
                              );
                            } else {
                              cellClass += "bg-green-100 hover:bg-green-200 cursor-pointer transition-colors";
                              content = (
                                <Badge className="bg-green-600 hover:bg-green-700 text-white text-xs">
                                  Ledig
                                </Badge>
                              );
                              clickHandler = () => window.location.href = `/facilities/${facility.id}?date=${format(day, 'yyyy-MM-dd')}&time=${timeSlot}`;
                            }
                            
                            return (
                              <div 
                                key={dayIndex} 
                                className={cellClass}
                                onClick={clickHandler}
                                title={unavailableCheck.isUnavailable ? unavailableCheck.details : undefined}
                              >
                                {content}
                              </div>
                            );
                          })}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CalendarView;
