
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar as CalendarIcon, BellRing, BookOpen, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import FacilityTypeGrid from "@/components/FacilityTypeGrid";

const Index = () => {
  const [date, setDate] = useState<Date>();
  const [facilityType, setFacilityType] = useState<string>("");
  const [location, setLocation] = useState<string>("");

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <header className="bg-gradient-to-r from-[#0B3D91] to-[#0F4CA7] py-2 px-4 shadow-md sticky top-0 z-10">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <img src="/lovable-uploads/97431924-b9fd-4ccd-b558-a9e90506c716.png" alt="Drammen Kommune Logo" className="h-8 w-auto" />
            <h1 className="text-xl font-bold text-white hidden sm:block">DRAMMEN KOMMUNE</h1>
          </div>
          <div className="text-white text-base sm:text-lg font-medium">Booking System</div>
        </div>
      </header>

      <div className="container mx-auto px-2 py-4 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Left Column - Search and Facility Types */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold mb-3 text-gray-800">Find a facility to book</h2>
            
            {/* Search Form */}
            <Card className="mb-4 overflow-hidden border-none shadow-md bg-white">
              <CardContent className="p-3 sm:p-4">
                <div className="grid grid-cols-1 gap-3">
                  <Select value={facilityType} onValueChange={setFacilityType}>
                    <SelectTrigger className="bg-white h-10 border-gray-300">
                      <SelectValue placeholder="Facility type" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem value="sports-hall">Sports Hall</SelectItem>
                      <SelectItem value="meeting-room">Meeting Room</SelectItem>
                      <SelectItem value="auditorium">Auditorium</SelectItem>
                      <SelectItem value="gymnasium">Gymnasium</SelectItem>
                      <SelectItem value="tennis-court">Tennis Court</SelectItem>
                      <SelectItem value="swimming-pool">Swimming Pool</SelectItem>
                      <SelectItem value="banquet-hall">Banquet Hall</SelectItem>
                      <SelectItem value="kitchen">Kitchen</SelectItem>
                      <SelectItem value="classroom">Classroom</SelectItem>
                      <SelectItem value="theater">Theater</SelectItem>
                      <SelectItem value="music-room">Music Room</SelectItem>
                      <SelectItem value="exhibition-hall">Exhibition Hall</SelectItem>
                      <SelectItem value="squash-court">Squash Court</SelectItem>
                      <SelectItem value="meeting-space">Meeting Space</SelectItem>
                    </SelectContent>
                  </Select>

                  <div className="grid grid-cols-2 gap-3">
                    <Select value={location} onValueChange={setLocation}>
                      <SelectTrigger className="bg-white h-10 border-gray-300">
                        <SelectValue placeholder="Location" />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        <SelectItem value="halleren">Halleren</SelectItem>
                        <SelectItem value="city">City</SelectItem>
                        <SelectItem value="plant">Plant</SelectItem>
                        <SelectItem value="gym">Gym</SelectItem>
                        <SelectItem value="kitchen">Kitchen</SelectItem>
                        <SelectItem value="hall">Hall</SelectItem>
                        <SelectItem value="squash">Squash</SelectItem>
                      </SelectContent>
                    </Select>

                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal bg-white border-gray-300 h-10",
                            !date && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {date ? format(date, "PPP") : <span>Date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={setDate}
                          initialFocus
                          className={cn("p-3 pointer-events-auto")}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <Button 
                      variant="outline" 
                      className="w-full h-10 bg-white border-blue-300 hover:bg-blue-50 text-blue-600"
                      onClick={() => window.location.href = "/bookings"}
                    >
                      <BookOpen className="mr-1 h-4 w-4" />
                      <span className="text-sm">My bookings</span>
                    </Button>
                    
                    <Button 
                      className="w-full h-10 bg-[#F9CB40] hover:bg-[#E6B92E] text-black font-medium"
                    >
                      Search
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Facility Types Grid */}
            <h2 className="text-xl font-bold mb-3 text-gray-800">Find facilities near you</h2>
            <FacilityTypeGrid />
            
            {/* Mobile-only notifications section */}
            <div className="lg:hidden mt-6">
              <h3 className="text-lg font-bold text-gray-800 flex items-center">
                <BellRing className="h-4 w-4 mr-2 text-blue-600" />
                Notifications
              </h3>
              <Card className="mt-2 border border-blue-100 rounded-md overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-3 bg-gradient-to-r from-blue-50 to-white">
                  <div className="flex justify-between items-center">
                    <p className="font-medium text-sm">Your booking for Music room at Halleren is approved</p>
                    <Button variant="ghost" className="p-1">
                      <span className="sr-only">View</span>
                      <ChevronRight className="h-4 w-4 text-blue-600" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Right Column - Notifications and Info (hidden on mobile) */}
          <div className="space-y-4 hidden lg:block">
            <h3 className="text-lg font-bold text-gray-800 flex items-center">
              <BellRing className="h-4 w-4 mr-2 text-blue-600" />
              Notifications
            </h3>
            <Card className="border border-blue-100 rounded-md overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-3 bg-gradient-to-r from-blue-50 to-white">
                <div className="flex justify-between items-center">
                  <p className="font-medium text-sm">Your booking for Music room at Halleren is approved</p>
                  <Button variant="ghost" className="p-1">
                    <span className="sr-only">View</span>
                    <ChevronRight className="h-4 w-4 text-blue-600" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            <h3 className="text-lg font-bold mt-6 text-gray-800">Resource availability</h3>
            <Card className="overflow-hidden shadow-sm border-none">
              <CardContent className="p-3 bg-gradient-to-br from-blue-50 to-white">
                <div className="space-y-3">
                  <p className="text-xs text-gray-600">Check real-time availability of our facilities before making a booking.</p>
                  <Button variant="link" className="p-0 h-auto text-blue-700 hover:text-blue-900 font-medium text-sm">
                    Booking guidelines
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card className="overflow-hidden shadow-sm border-none mt-4">
              <CardContent className="p-3 bg-gradient-to-br from-amber-50 to-white">
                <div className="space-y-3">
                  <h4 className="font-semibold text-sm">Need help?</h4>
                  <p className="text-xs text-gray-600">Our support team is available Monday to Friday, 8:00 - 16:00.</p>
                  <Button variant="outline" className="w-full bg-white text-blue-700 hover:bg-blue-50 text-sm h-8">
                    Contact support
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white py-3 px-4 border-t shadow-inner mt-6">
        <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex flex-wrap justify-center gap-4">
            <Button variant="link" className="p-0 h-auto text-blue-700 hover:text-blue-900 font-medium text-xs sm:text-sm">
              Privacy policy
            </Button>
            <Button variant="link" className="p-0 h-auto text-blue-700 hover:text-blue-900 font-medium text-xs sm:text-sm">
              Contact support
            </Button>
            <Button variant="link" className="p-0 h-auto text-blue-700 hover:text-blue-900 font-medium text-xs sm:text-sm">
              Booking guidelines
            </Button>
          </div>
          <Button variant="link" className="p-0 h-auto text-blue-700 hover:text-blue-900 font-medium text-xs sm:text-sm">
            English
          </Button>
        </div>
      </footer>
    </div>
  );
};

export default Index;
