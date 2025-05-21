
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
import { Calendar as CalendarIcon, BellRing, BookOpen, ChevronRight, Search } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import FacilityTypeGrid from "@/components/FacilityTypeGrid";

const Index = () => {
  const [date, setDate] = useState<Date>();
  const [facilityType, setFacilityType] = useState<string>("");
  const [location, setLocation] = useState<string>("");

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col">
      {/* Header - Cleaner and more professional */}
      <header className="bg-gradient-to-r from-[#0B3D91] to-[#0F4CA7] py-2 px-4 shadow-md sticky top-0 z-10">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <img src="/lovable-uploads/97431924-b9fd-4ccd-b558-a9e90506c716.png" alt="Drammen Kommune Logo" className="h-8 w-auto" />
            <h1 className="text-xl font-bold text-white hidden sm:block">DRAMMEN KOMMUNE</h1>
          </div>
          <div className="text-white text-base font-medium">Facility Booking System</div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 max-w-7xl flex-grow">
        {/* Enhanced Hero Section with professional image */}
        <div className="mb-8 rounded-xl overflow-hidden shadow-lg">
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
              alt="Drammen Kommune Facilities" 
              className="w-full h-[360px] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-blue-900/30 flex items-center">
              <div className="container mx-auto px-6">
                <div className="max-w-xl">
                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3 leading-tight">
                    Find and Book Municipal Facilities
                  </h1>
                  <p className="text-lg text-blue-100 mb-6 max-w-lg">
                    Access Drammen Kommune's extensive network of facilities for your events, 
                    sports activities, and community gatherings.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Button className="bg-[#F9CB40] hover:bg-[#E6B92E] text-black font-medium py-2 px-6 text-base">
                      Browse All Facilities
                    </Button>
                    <Button variant="outline" className="border-white text-white hover:bg-white/10 font-medium">
                      Learn More
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Search and Facility Types */}
          <div className="lg:col-span-2">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
              <h2 className="text-xl font-bold text-gray-800">Find a facility to book</h2>
              <Button 
                variant="outline" 
                className="w-auto sm:w-auto h-10 bg-white border-blue-300 hover:bg-blue-50 text-blue-700 self-start"
                onClick={() => window.location.href = "/bookings"}
              >
                <BookOpen className="mr-1 h-4 w-4" />
                <span className="text-sm">My bookings</span>
              </Button>
            </div>
            
            {/* Search Form with improved styling */}
            <Card className="mb-6 overflow-hidden border-none shadow-md bg-white">
              <CardContent className="p-5">
                <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                  <div className="md:col-span-2">
                    <Select value={facilityType} onValueChange={setFacilityType}>
                      <SelectTrigger className="bg-white h-11 border-gray-300 w-full">
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
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="md:col-span-2">
                    <Select value={location} onValueChange={setLocation}>
                      <SelectTrigger className="bg-white h-11 border-gray-300 w-full">
                        <SelectValue placeholder="Location" />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        <SelectItem value="halleren">Halleren</SelectItem>
                        <SelectItem value="city">City</SelectItem>
                        <SelectItem value="plant">Plant</SelectItem>
                        <SelectItem value="gym">Gym</SelectItem>
                        <SelectItem value="kitchen">Kitchen</SelectItem>
                        <SelectItem value="hall">Hall</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="md:col-span-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal bg-white border-gray-300 h-11",
                            !date && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {date ? format(date, "PPP") : <span>Select date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={setDate}
                          initialFocus
                          className="bg-white"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="md:col-span-6">
                    <Button 
                      className="w-full h-11 bg-[#F9CB40] hover:bg-[#E6B92E] text-black font-medium shadow-sm"
                    >
                      <Search className="mr-2 h-4 w-4" />
                      <span>Find facilities</span>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Facility Types Grid with better section heading */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">Popular facility types</h2>
                <Button variant="link" className="text-blue-700 hover:text-blue-900 p-0 h-auto">
                  View all
                </Button>
              </div>
              <FacilityTypeGrid />
            </div>
            
            {/* Mobile-only notifications section with improved styling */}
            <div className="lg:hidden mt-6">
              <h3 className="text-lg font-bold text-gray-800 flex items-center mb-3">
                <BellRing className="h-4 w-4 mr-2 text-blue-600" />
                Notifications
              </h3>
              <Card className="border border-blue-100 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-4 bg-gradient-to-r from-blue-50 to-white">
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

          {/* Right Column - Notifications and Info with enhanced styling */}
          <div className="space-y-5 hidden lg:block">
            <div>
              <h3 className="text-lg font-bold text-gray-800 flex items-center mb-3">
                <BellRing className="h-4 w-4 mr-2 text-blue-600" />
                Notifications
              </h3>
              <Card className="border border-blue-100 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-4 bg-gradient-to-r from-blue-50 to-white">
                  <div className="flex justify-between items-center">
                    <p className="font-medium text-sm">Your booking for Music room at Halleren is approved</p>
                    <Button variant="ghost" className="p-1">
                      <span className="sr-only">View</span>
                      <ChevronRight className="h-4 w-4 text-blue-600" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
              <Card className="border border-blue-100 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow mt-3">
                <CardContent className="p-4 bg-gradient-to-r from-blue-50 to-white">
                  <div className="flex justify-between items-center">
                    <p className="font-medium text-sm">Your booking request for Gymnasium is pending approval</p>
                    <Button variant="ghost" className="p-1">
                      <span className="sr-only">View</span>
                      <ChevronRight className="h-4 w-4 text-blue-600" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-3">Resource availability</h3>
              <Card className="overflow-hidden shadow-sm border-none rounded-lg mb-4">
                <CardContent className="p-4 bg-gradient-to-br from-blue-50 to-white">
                  <div className="space-y-3">
                    <p className="text-sm text-gray-600">Check real-time availability of our facilities before making a booking.</p>
                    <Button variant="link" className="p-0 h-auto text-blue-700 hover:text-blue-900 font-medium text-sm">
                      Booking guidelines
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="overflow-hidden shadow-sm border-none rounded-lg">
                <CardContent className="p-4 bg-gradient-to-br from-amber-50 to-white">
                  <div className="space-y-3">
                    <h4 className="font-semibold text-base">Need help?</h4>
                    <p className="text-sm text-gray-600">Our support team is available Monday to Friday, 8:00 - 16:00.</p>
                    <Button variant="outline" className="w-full bg-white text-blue-700 hover:bg-blue-50 text-sm h-9">
                      Contact support
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Footer with improved styling */}
      <footer className="bg-white py-4 px-4 border-t mt-auto">
        <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="flex flex-wrap justify-center gap-4">
            <Button variant="link" className="p-0 h-auto text-blue-700 hover:text-blue-900 font-medium text-sm">
              Privacy policy
            </Button>
            <Button variant="link" className="p-0 h-auto text-blue-700 hover:text-blue-900 font-medium text-sm">
              Contact support
            </Button>
            <Button variant="link" className="p-0 h-auto text-blue-700 hover:text-blue-900 font-medium text-sm">
              Booking guidelines
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="link" className="p-0 h-auto text-blue-700 hover:text-blue-900 font-medium text-sm">
              English
            </Button>
            <span className="text-gray-300">|</span>
            <Button variant="link" className="p-0 h-auto text-blue-700 hover:text-blue-900 font-medium text-sm">
              Norsk
            </Button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
