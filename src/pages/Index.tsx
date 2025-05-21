
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
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import FacilityTypeGrid from "@/components/FacilityTypeGrid";
import { Input } from "@/components/ui/input";

const Index = () => {
  const [date, setDate] = useState<Date>();
  const [facilityType, setFacilityType] = useState<string>("");
  const [location, setLocation] = useState<string>("");

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-[#0B3D91] py-4 px-6">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img src="/lovable-uploads/97431924-b9fd-4ccd-b558-a9e90506c716.png" alt="Drammen Kommune Logo" className="h-10 w-auto" />
            <h1 className="text-2xl font-bold text-white">DRAMMEN KOMMUNE</h1>
          </div>
          <div className="text-white text-xl">Booking System</div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column - Search and Facility Types */}
          <div className="md:col-span-2">
            <h2 className="text-3xl font-bold mb-6">Find a facility to book</h2>
            
            {/* Search Form */}
            <div className="grid grid-cols-1 gap-4 mb-8">
              <Select value={facilityType} onValueChange={setFacilityType}>
                <SelectTrigger className="bg-white h-12">
                  <SelectValue placeholder="Facility type" />
                </SelectTrigger>
                <SelectContent>
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
                  <SelectTrigger className="bg-white h-12">
                    <SelectValue placeholder="Location" />
                  </SelectTrigger>
                  <SelectContent>
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
                        "w-full justify-start text-left font-normal bg-white border h-12",
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
                  className="w-full h-12 bg-white"
                  onClick={() => window.location.href = "/bookings"}
                >
                  View my bookings
                </Button>
                
                <Button 
                  className="w-full h-12 bg-[#F9CB40] hover:bg-[#E6B92E] text-black"
                >
                  Search
                </Button>
              </div>
            </div>

            {/* Facility Types Grid */}
            <h2 className="text-2xl font-bold mb-4">Find facilities near</h2>
            <FacilityTypeGrid />
          </div>

          {/* Right Column - Notifications and Info */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold">Notifications</h3>
            <Card className="border rounded-md">
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <p>Your booking for Music room at Halleren is approved</p>
                  <Button variant="ghost" className="p-1">
                    <span className="sr-only">View</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-right"><path d="m9 18 6-6-6-6"/></svg>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <h3 className="text-xl font-bold">Resource availability</h3>
            <Button variant="link" className="p-0 h-auto text-blue-700 hover:text-blue-900">
              Booking guidelines
            </Button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white py-4 px-6 border-t">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex gap-6">
            <Button variant="link" className="p-0 h-auto text-blue-700 hover:text-blue-900">
              Privacy policy
            </Button>
            <Button variant="link" className="p-0 h-auto text-blue-700 hover:text-blue-900">
              Contact support
            </Button>
            <Button variant="link" className="p-0 h-auto text-blue-700 hover:text-blue-900">
              Booking guidelines
            </Button>
          </div>
          <Button variant="link" className="p-0 h-auto text-blue-700 hover:text-blue-900">
            English
          </Button>
        </div>
      </footer>
    </div>
  );
};

export default Index;
