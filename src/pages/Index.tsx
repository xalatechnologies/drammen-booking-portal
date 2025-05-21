
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
      <header className="bg-gradient-to-r from-[#0B3D91] to-[#0F4CA7] py-4 px-6 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img src="/lovable-uploads/97431924-b9fd-4ccd-b558-a9e90506c716.png" alt="Drammen Kommune Logo" className="h-12 w-auto" />
            <h1 className="text-2xl font-bold text-white">DRAMMEN KOMMUNE</h1>
          </div>
          <div className="text-white text-xl font-medium">Booking System</div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column - Search and Facility Types */}
          <div className="md:col-span-2">
            <h2 className="text-3xl font-bold mb-6 text-gray-800">Find a facility to book</h2>
            
            {/* Search Form */}
            <Card className="mb-8 overflow-hidden border-none shadow-lg bg-white">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 gap-4">
                  <Select value={facilityType} onValueChange={setFacilityType}>
                    <SelectTrigger className="bg-white h-12 border-gray-300">
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

                  <div className="grid grid-cols-2 gap-4">
                    <Select value={location} onValueChange={setLocation}>
                      <SelectTrigger className="bg-white h-12 border-gray-300">
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
                            "w-full justify-start text-left font-normal bg-white border-gray-300 h-12",
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

                  <div className="grid grid-cols-2 gap-4">
                    <Button 
                      variant="outline" 
                      className="w-full h-12 bg-white border-blue-300 hover:bg-blue-50 text-blue-600"
                      onClick={() => window.location.href = "/bookings"}
                    >
                      <BookOpen className="mr-2 h-4 w-4" />
                      View my bookings
                    </Button>
                    
                    <Button 
                      className="w-full h-12 bg-[#F9CB40] hover:bg-[#E6B92E] text-black font-medium"
                    >
                      Search
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Facility Types Grid */}
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Find facilities near you</h2>
            <FacilityTypeGrid />
          </div>

          {/* Right Column - Notifications and Info */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-800 flex items-center">
              <BellRing className="h-5 w-5 mr-2 text-blue-600" />
              Notifications
            </h3>
            <Card className="border border-blue-100 rounded-md overflow-hidden shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-4 bg-gradient-to-r from-blue-50 to-white">
                <div className="flex justify-between items-center">
                  <p className="font-medium">Your booking for Music room at Halleren is approved</p>
                  <Button variant="ghost" className="p-1">
                    <span className="sr-only">View</span>
                    <ChevronRight className="h-5 w-5 text-blue-600" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            <h3 className="text-xl font-bold mt-8 text-gray-800">Resource availability</h3>
            <Card className="overflow-hidden shadow-md border-none">
              <CardContent className="p-5 bg-gradient-to-br from-blue-50 to-white">
                <div className="space-y-4">
                  <p className="text-sm text-gray-600">Check real-time availability of our facilities before making a booking.</p>
                  <Button variant="link" className="p-0 h-auto text-blue-700 hover:text-blue-900 font-medium">
                    Booking guidelines
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card className="overflow-hidden shadow-md border-none mt-6">
              <CardContent className="p-5 bg-gradient-to-br from-amber-50 to-white">
                <div className="space-y-4">
                  <h4 className="font-semibold">Need help?</h4>
                  <p className="text-sm text-gray-600">Our support team is available Monday to Friday, 8:00 - 16:00.</p>
                  <Button variant="outline" className="w-full bg-white text-blue-700 hover:bg-blue-50">
                    Contact support
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white py-6 px-6 border-t shadow-inner mt-10">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex gap-6">
            <Button variant="link" className="p-0 h-auto text-blue-700 hover:text-blue-900 font-medium">
              Privacy policy
            </Button>
            <Button variant="link" className="p-0 h-auto text-blue-700 hover:text-blue-900 font-medium">
              Contact support
            </Button>
            <Button variant="link" className="p-0 h-auto text-blue-700 hover:text-blue-900 font-medium">
              Booking guidelines
            </Button>
          </div>
          <Button variant="link" className="p-0 h-auto text-blue-700 hover:text-blue-900 font-medium">
            English
          </Button>
        </div>
      </footer>
    </div>
  );
};

export default Index;
