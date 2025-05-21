
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
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
import { Calendar as CalendarIcon, Search } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import FacilityList from "@/components/FacilityList";

const Index = () => {
  const [date, setDate] = useState<Date>();
  const [facilityType, setFacilityType] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [isSearched, setIsSearched] = useState(false);

  const handleSearch = () => {
    setIsSearched(true);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-[#1A1F2C] py-6">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            Drammen Kommune Booking
          </h1>
          <p className="text-gray-300 mt-2">
            Find and book municipal facilities
          </p>
        </div>
      </header>

      {/* Search Section */}
      <section className="container mx-auto px-4 py-8">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Find Available Facilities</CardTitle>
            <CardDescription>
              Search for available facilities by date, type, and location
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Date</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
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
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Facility Type
                </label>
                <Select value={facilityType} onValueChange={setFacilityType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sports-hall">Sports Hall</SelectItem>
                    <SelectItem value="meeting-room">Meeting Room</SelectItem>
                    <SelectItem value="auditorium">Auditorium</SelectItem>
                    <SelectItem value="classroom">Classroom</SelectItem>
                    <SelectItem value="gym">Gymnasium</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Location
                </label>
                <Select value={location} onValueChange={setLocation}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="central">Central Drammen</SelectItem>
                    <SelectItem value="konnerud">Konnerud</SelectItem>
                    <SelectItem value="aassiden">Åssiden</SelectItem>
                    <SelectItem value="gulskogen">Gulskogen</SelectItem>
                    <SelectItem value="skoger">Skoger</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <Button
                  className="w-full bg-[#1EAEDB] hover:bg-[#33C3F0]"
                  onClick={handleSearch}
                >
                  <Search className="mr-2 h-4 w-4" />
                  Search
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Results Section */}
      {isSearched && (
        <section className="container mx-auto px-4 py-8">
          <h2 className="text-2xl font-semibold mb-6">Available Facilities</h2>
          <FacilityList
            date={date}
            facilityType={facilityType}
            location={location}
          />
        </section>
      )}
    </div>
  );
};

export default Index;
