import React, { useState } from "react";
import { format } from "date-fns";
import { CheckCircle, Users, Clock, Info } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { isDateUnavailable, isNorwegianHoliday } from "@/utils/holidaysAndAvailability";

interface FacilityInfoTabsProps {
  description: string;
  capacity: number;
  equipment: string[];
}

export function FacilityInfoTabs({ description, capacity, equipment }: FacilityInfoTabsProps) {
  const [calendarView, setCalendarView] = useState<"day" | "week" | "month">("week");
  const [date] = useState<Date>(new Date());

  return (
    <Tabs defaultValue="description" className="bg-white rounded-lg shadow-sm">
      <TabsList className="w-full border-b p-0 h-auto">
        <TabsTrigger value="description" className="flex-1 py-3 rounded-none rounded-tl-lg data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:shadow-none">
          Beskrivelse
        </TabsTrigger>
        <TabsTrigger value="features" className="flex-1 py-3 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:shadow-none">
          Fasiliteter
        </TabsTrigger>
        <TabsTrigger value="calendar" className="flex-1 py-3 rounded-none rounded-tr-lg data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:shadow-none">
          Kalender
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="description" className="p-6">
        <h2 className="text-xl font-medium mb-4">Om lokalet</h2>
        <p className="text-gray-700 whitespace-pre-line">{description}</p>
        
        <div className="mt-6 pt-6 border-t border-gray-100">
          <h3 className="font-medium text-lg mb-2">Egnet for</h3>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="bg-gray-50">Idrett</Badge>
            <Badge variant="outline" className="bg-gray-50">Trening</Badge>
            <Badge variant="outline" className="bg-gray-50">Arrangementer</Badge>
            <Badge variant="outline" className="bg-gray-50">Grupper</Badge>
          </div>
        </div>
      </TabsContent>
      
      <TabsContent value="features" className="p-6">
        <h2 className="text-xl font-medium mb-4">Fasiliteter og utstyr</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4">
          <div className="flex items-start space-x-2">
            <Users className="h-5 w-5 text-blue-600" />
            <div>
              <p className="font-medium">Kapasitet</p>
              <p className="text-gray-600">{capacity} personer</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-2">
            <Clock className="h-5 w-5 text-blue-600" />
            <div>
              <p className="font-medium">Åpningstider</p>
              <p className="text-gray-600">08:00 - 22:00 alle dager</p>
            </div>
          </div>
        </div>
        
        <h3 className="font-medium text-lg mt-6 mb-3">Tilgjengelig utstyr</h3>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 text-gray-700">
          {equipment.map((item, i) => (
            <li key={i} className="flex items-center">
              <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
              {item}
            </li>
          ))}
        </ul>
      </TabsContent>
      
      <TabsContent value="calendar" className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-medium">Tilgjengelighet</h2>
          <div className="flex rounded-md overflow-hidden border">
            <button 
              className={`px-4 py-2 text-sm ${calendarView === "day" ? "bg-blue-600 text-white" : "bg-white"}`} 
              onClick={() => setCalendarView("day")}
            >
              Dag
            </button>
            <button 
              className={`px-4 py-2 text-sm ${calendarView === "week" ? "bg-blue-600 text-white" : "bg-white"}`} 
              onClick={() => setCalendarView("week")}
            >
              Uke
            </button>
            <button 
              className={`px-4 py-2 text-sm ${calendarView === "month" ? "bg-blue-600 text-white" : "bg-white"}`} 
              onClick={() => setCalendarView("month")}
            >
              Måned
            </button>
          </div>
        </div>
        
        {/* Availability Legend */}
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-medium mb-2">Forklaring:</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-50 border border-green-200 rounded mr-2"></div>
              <span>Ledig</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-red-50 border border-red-200 rounded mr-2"></div>
              <span>Helligdag</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-orange-50 border border-orange-200 rounded mr-2"></div>
              <span>Helg</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-yellow-50 border border-yellow-200 rounded mr-2"></div>
              <span>Vedlikehold</span>
            </div>
          </div>
        </div>
        
        <div className="border rounded-lg overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="p-2 border-b border-r text-left">Tid</th>
                {[0, 1, 2, 3, 4].map(day => {
                  const currentDate = new Date(date.getTime() + day * 24 * 60 * 60 * 1000);
                  const unavailableCheck = isDateUnavailable(currentDate);
                  const holidayCheck = isNorwegianHoliday(currentDate);
                  
                  return (
                    <th key={day} className="p-2 border-b border-r text-center">
                      <div>
                        {format(currentDate, "EEE d.MMM")}
                        {holidayCheck.isHoliday && (
                          <div className="text-xs text-red-600 mt-1">{holidayCheck.name}</div>
                        )}
                        {unavailableCheck.isUnavailable && !holidayCheck.isHoliday && (
                          <div className="text-xs text-orange-600 mt-1">{unavailableCheck.details}</div>
                        )}
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {["08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00"].map((time, i) => (
                <tr key={i} className={i % 2 === 0 ? "bg-gray-50" : ""}>
                  <td className="p-2 border-b border-r">{time}</td>
                  {[0, 1, 2, 3, 4].map(day => {
                    const currentDate = new Date(date.getTime() + day * 24 * 60 * 60 * 1000);
                    const unavailableCheck = isDateUnavailable(currentDate);
                    
                    // If the day is unavailable, show the reason
                    if (unavailableCheck.isUnavailable) {
                      const bgColor = {
                        'past': 'bg-gray-100',
                        'weekend': 'bg-orange-100',
                        'holiday': 'bg-red-100',
                        'maintenance': 'bg-yellow-100'
                      }[unavailableCheck.reason!];
                      
                      const textColor = {
                        'past': 'text-gray-500',
                        'weekend': 'text-orange-600',
                        'holiday': 'text-red-600',
                        'maintenance': 'text-yellow-600'
                      }[unavailableCheck.reason!];
                      
                      return (
                        <td 
                          key={day} 
                          className={`p-2 border-b border-r text-center ${bgColor}`}
                          title={unavailableCheck.details}
                        >
                          <span className={textColor}>
                            {unavailableCheck.reason === 'past' ? 'Fortid' : 
                             unavailableCheck.reason === 'weekend' ? 'Helg' :
                             unavailableCheck.reason === 'holiday' ? 'Helligdag' : 'Vedlikehold'}
                          </span>
                        </td>
                      );
                    }
                    
                    // Mock availability - in a real app this would be based on actual bookings
                    const isAvailable = Math.random() > 0.3;
                    return (
                      <td 
                        key={day} 
                        className={`p-2 border-b border-r text-center ${isAvailable ? "bg-green-100" : "bg-red-100"}`}
                      >
                        <span className={isAvailable ? "text-green-600" : "text-red-600"}>
                          {isAvailable ? "Ledig" : "Opptatt"}
                        </span>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <p className="text-sm text-gray-500 mt-4">
          <Info className="h-4 w-4 inline-block mr-1" />
          Fargemarkering viser når lokalet er ledig (grønt), opptatt (rødt), eller ikke tilgjengelig på grunn av helligdager, helger eller vedlikehold.
        </p>
      </TabsContent>
    </Tabs>
  );
}
